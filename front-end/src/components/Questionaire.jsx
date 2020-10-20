import React from "react";
import { useEffect } from "react";
import { useContext, useState, useCallback } from "react";
import { getRequest, postRequest } from "../lib/HTTP";
import _ from "lodash";
import { convertNullsInObject, convertObjectToLowerCase} from "../lib/Utils";
import useMyEffect from "../lib/Hooks/useMyEffect";
import {
  AreaChart, ResponsiveContainer, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import Select from './reusable/Select';

let prevDatasetsData = null;
let prevIsLoading = false;
let prevScoresList = null;

export default function Questionaire() {
  //datasets data structure

  // {
  //     datasetID: {
  //         "meta":{
  //             longName:"",
  //             minVal:"",
  //             etc...
  //         },
  //         "coutry1":"value",
  //         "country2":"value",
  //     }
  // }

  const [datasetIDs, setDatasetIDs] = useState(null);
  const [rawDatasetIDs, setRawDatasetIDs] = useState(null);//not lower cased
  const [longNames, setLongNames] = useState(null);
  const [minVals, setMinVals] = useState(null);
  const [maxVals, setMaxVals] = useState(null);
  const [units, setUnits] = useState(null);
  const [dataTypes, setDataTypes] = useState(null);
  const [vals, setVals] = useState(null);
  const [weights, setWeights] = useState(null);
  const [countries, setCountries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(null);

  const [testChartData, setTestChartData] = useState(null);
  const [testChartMod, setTestChartMod] = useState(null);

  const [missingDataHandlerMethods, setMissingDataHandlerMethods] = useState(null);

  const [lcDatasetsData, setlcDatasetsData] = useState(null);//lowercased
  const [rawDatasetsData, setRawDatasetsData] = useState(null); //not lower cased
  const [scoreBreakdown, setScoreBreakdown] = useState(null); //object with countries as keys, array as value, each value array has dataset name as index 0 and and total score as index 1
  const [howToHandleMissingData, setHowToHandleMissingData] = useState(
    "neutral"
  );

  const [scoresList, setScoresList] = useState(null); //nested array with countries as 0 and scores as 1
  const [simpleResults,setSimpleResults] = useState(null);
  const [sortedResults, setSortedResults] = useState(null);
  const [categories, setCategories] = useState(null);
  const [formValues, setFormValues] = useState(null);
  //object with this structure
  // {
  //   datasetId:{
  //     weight:
  //     idealValue
  //     customScoreFunction
  //     missingDataHandlerMethod
  //     missingDataHandlerInput
  //   }
  // }
  const [scoresRequest, setScoresRequest] = useState(null);
  //scores request is the json object sent in the request to api/scores when we are done the questionairy
  //structure:
  //[{},{}]list with objects corresponding to each dataset
  //each dataset object has this structure:
  //{
  //   datasetID: '',
  //   weight: 0,
  //   idealValue: val OR null,
  //   customScoreFunction: function OR null,
  //   missingDataHandlerMethod: 'text',
  //   missingDataHandlerInput: number OR null
  // }

  
  //onmount get the raw data from the server
  useEffect(() => {
    const asyncWrapper = async () => {
      const httpResponse = await getRequest("/datasets");
      setRawDatasetsData(httpResponse);
      console.log(httpResponse);
      const countries = await getRequest("/countries");
      setCountries(countries);
      const missingDHMethods = await getRequest("/missing-data-handler-methods");
      setMissingDataHandlerMethods(missingDHMethods);
    };
    asyncWrapper();
  }, []);

  //once those states are loaded, set isloading to false
  useEffect(() => {
    if (!rawDatasetsData) return;
    if (!countries) return;
    if (!missingDataHandlerMethods) return;
    //now organize the datasets by category
    let categories = [];
    let categoryNames = [];
    rawDatasetsData.forEach(dataset=>{
        if (!categoryNames.includes(dataset['category'])){
            categories.push({
                name:dataset['category'],
                datasets: [dataset],
            });
            categoryNames.push(dataset['category']);
        } else {
            const index = categories.findIndex(element => element.name===dataset['category']);
            categories[index]['datasets'].push(dataset);
        }
    });
    setCategories(categories);
    //initialize the formValues state object
    const defaultFormValues = {};
    rawDatasetsData.forEach(dataset=>{
      const thisRef = defaultFormValues[dataset['id']] = {};
      thisRef['weight'] = 0;
      thisRef['idealValue'] = Math.abs(dataset['max_value']-dataset['min_value'])/2.0;
      thisRef['customScoreFunction'] = null;
      thisRef['missingDataHandlerMethod'] = 'average';
      thisRef['missingDataHandlerInput'] = null;
      thisRef['normalizationPercentage'] = 0;
    });
    setFormValues(defaultFormValues);
    //initialize the test chart data
    setTestChartData(rawDatasetsData[0]['distribution_map']);
    setIsLoading(false);
  }, [
    missingDataHandlerMethods,
    isLoading,
    setIsLoading,
    minVals,
    longNames,
    maxVals,
    countries,
    vals,
    weights,
    rawDatasetsData,
  ]);

  //whenever scores results are loaded, sort the list for rendering by rank
  useMyEffect([simpleResults],()=>{
    const unsortedResultsList = Object.keys(simpleResults).map(countryCode=>{
      return {'alpha_three_code':countryCode, ...simpleResults[countryCode]};
    });
    const sortedResultsList = unsortedResultsList.sort((a,b)=>a['rank']-b['rank']);
    setSortedResults(sortedResultsList);
  },[simpleResults, setSortedResults])

  const changeVal = (value, index) => {
    const val = parseFloat(value);
    setVals((prev) => {
      return prev.map((v, i) => {
        if (i === index) return val;
        else {
          return v;
        }
      });
    });
  };
  const changeWeight = (value,index) => {
    const val = parseInt(value);
    setWeights((prev) => {
      return prev.map((v, i) => {
        if (i === index) return val;
        else {
          return v;
        }
      });
    });
  };

  const calculateResult = useCallback(() => {
    //TODO handle boolean datasets, record detailed score breakdowns for each country
    const tempScoreBreakdown = {}; //used to set state at the end of this function
    const countryScoreTotal = {}; //key is country, score is cummulative// per dataset
    //for each dataset (one weight value for each dataset)
    weights.forEach((weight, index) => {
      //if the weight value is zero, skip it.
      if (weight === 0 || weight === "") return;
      const thisDataset = lcDatasetsData[datasetIDs[index]];
      // console.log(datasetsData, datasetIDs, index);
      // console.log('calculating for dataset ',thisDataset);
      if (Object.keys(lcDatasetsData).length - 1 !== vals.length)
        console.log("error:length discrepancy in CalculateResult");
      //if not, sort the countries according to proximity to the chosen value
      //if there is no data for the country, handle according to howToHandleMissingData
      //if neutral, determine what the average country has % wise for this dataset and set
      //countries with missing data to that value
      //if good, set countries with missing data to 90% similar to chosen value
      //if bad, set countries with missing data to 10% similar to chosen val
      //get the total range for the dataset (max-min)
      //the total range = 100% determine 1% increments
      //rank countries based on how close they are % wise to the chosen value
      //{country: "% SIMILARITY TO chosen value"} ex: if 1% differenc then 99% similar
      //multiply the results by the weight given to the dataset
      //make a sum for each country, the countries with the highest sum are the closest matches
      const val = vals[index];
      const range = maxVals[index] - minVals[index];
      const onePercent = (range * 1.0) / 100.0;

      //make list of all contries with and without data
      let withData = [];
      let withoutData = [];
      Object.keys(thisDataset).forEach((country) => {
        if (country === "meta") return;
        if (thisDataset[country] === null) {
          withoutData.push(country);
        } else {
          withData.push(country);
        }
      });
      //handle countries WITH data first
      //calculate how similar the actual value is to the ideal value (%)
      // using 100-(abs(thisdata-idealval)*1)/onepercent
      //calculate onepercent using
      //(range * 1.0) / 100.0;
      // multiply the score by the weight
      let percentSimilarList = [];
      withData.forEach((country) => {
        const thisData = thisDataset[country];
        const oldScore = countryScoreTotal[country]
          ? countryScoreTotal[country]
          : 0;
        const percentSimilar =
          100.0 - (Math.abs(thisData - val) * 1.0) / onePercent;
        percentSimilarList.push(percentSimilar);
        const newScore = weight * percentSimilar;
        _.set(tempScoreBreakdown, `${country}[${longNames[index]}]`, newScore);
        countryScoreTotal[country] = oldScore + newScore;
      });
      
    
      //handle countries WITHOUT data
      if (withoutData.length > 0) {
        //get average percent similar for this dataset
        const avePercSimilar =
          (percentSimilarList.reduce((acc, curr) => acc + curr) * 1.0) /
          percentSimilarList.length;
        withoutData.forEach((country) => {
          console.log("in " + country + " calc for " + longNames[index]);
          const oldScore = countryScoreTotal[country]
            ? countryScoreTotal[country]
            : 0;
          let percentSimilar;
          if (howToHandleMissingData === "neutral") {
            percentSimilar = avePercSimilar;
          } else if (howToHandleMissingData === "good") {
            percentSimilar = 90;
          } else if (howToHandleMissingData === "bad") {
            percentSimilar = 10;
          }
          const newScore = weight * percentSimilar;
          countryScoreTotal[country] = oldScore + newScore;
          _.set(
            tempScoreBreakdown,
            `${country}[${longNames[index]}]`,
            newScore
          );
        });
      }
    });
    setScoresList(
      Object.keys(countryScoreTotal).map((country) => [
        country,
        countryScoreTotal[country],
      ])
    );
    setScoreBreakdown(tempScoreBreakdown);
  }, [
    setScoresList,
    setScoreBreakdown,
    datasetIDs,
    lcDatasetsData,
    howToHandleMissingData,
    longNames,
    maxVals,
    minVals,
    vals,
    weights,
  ]);
  const getChartData = (distributionMap)=>{
    const chartData =[];
    const list = Array.isArray(distributionMap)?distributionMap:JSON.parse(distributionMap);
    list.map((count,index)=>{
      chartData.push({percent: index, count:count});
    })
    return chartData;
  }

  const changeTestChartData=(e)=>{
    const modifier = JSON.parse(testChartMod) ||[0,null];
    const index = modifier[0] || 0;
    const mod1 = modifier[1] || null;
    const list = Array.isArray(rawDatasetsData[modifier][index])?rawDatasetsData[modifier][index]:JSON.parse(rawDatasetsData[modifier][index]);
    const newData = list.map(val=>{
      let newVal;
      if (mod1){
        newVal =Math.log1p(val)/Math.log1p(mod1);
      } else {
        newVal = val;
      }
      
      return isFinite(newVal)?newVal:0;
    });
    console.log(newData);
    setTestChartData(newData);
  }

  const submitForm = async ()=>{
    //convert formValues to scoresRequest structure object
    const scoresRequest = [];
    Object.keys(formValues).forEach(datasetID=>{
      scoresRequest.push({
        id:datasetID,
        weight:formValues[datasetID].weight,
        idealValue:formValues[datasetID].idealValue || null,
        customScoreFunction: formValues[datasetID].customScoreFunction || null,
        missingDataHandlerMethod: formValues[datasetID].missingDataHandlerMethod,
        missingDataHandlerInput: formValues[datasetID].missingDataHandlerInput || null,
        normalizationPercentage: formValues[datasetID].normalizationPercentage || 0,
      })
    })
    await setScoresRequest(scoresRequest);
    console.log(scoresRequest);
    const response = await postRequest('/scores',scoresRequest);
    console.log(response);
    setSimpleResults(response);
  }

  if (!isLoading) {
    return (
      <div className="container-fluid text-light p-3 bg-dark">
        <h3>Answer these questions to find out which countries are the best fit for you:</h3>
        {categories.map((obj,ind)=>{
          return (
            <div key={'category'+ind}>
              <h2>{obj.name}</h2>
              {obj.datasets.map((dataset,index)=>{
                return (
                  <div className="container border rounded p-3 m-3 bg-light text-dark" key={"datasetsData"+obj.name+ index}>
                    <h3>Question:</h3>
                    <h4>What {dataset['long_name']} would you prefer your country to have?</h4>
                    {/* distribution map */}
                    <ResponsiveContainer width="100%" height={30}>
                      <AreaChart
                        data={getChartData(dataset['distribution_map'])}
                        margin={{ top: 1, right: 0, left: 0, bottom: 1 }}
                      >
                        <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                    {/* slider */}
                    <input
                      className="form-control-range"
                      type="range"
                      onChange={(e)=>{
                        const newVal = e.target.value;
                        setFormValues(prev=>{
                          const next = {...prev};
                          next[dataset.id]['idealValue']=newVal;
                          return next;
                        })
                      }}
                      min={dataset['min_value']}
                      max={dataset['max_value']}
                      name="idealValue"
                      value={formValues[dataset['id']['idealValue']]}
                      step={Math.abs(dataset['max_value']-dataset['min_value'])/100.0}
                    />
                    <input 
                     type="text"
                     value= {formValues[dataset.id]['idealValue']}
                     
                     onChange={(e)=>{
                      
                      const newVal = e.target.value;
                      if((newVal<=dataset['max_value'] && newVal >=dataset['min_value']) || newVal==='-'){
                      const newObj = {...formValues};
                      newObj[dataset.id]['idealValue'] = newVal;
                      setFormValues(newObj);
                      }
                     }}
                    ></input>
                    <span>
                       {dataset['unit_description']}
                    </span>
                    <h4>How important is this to you?</h4>
                    {/* slider */}
                    <input
                      className="form-control-range"
                      key={"weightSlider" + index}
                      type="range"
                      onChange={(e)=>{
                        const newVal = e.target.value;
                        setFormValues(prev =>{
                          const next = {...prev};
                          next[dataset.id]['weight'] = newVal;
                          return next;
                        })
                      }}
                      min="0"
                      max="100"
                      defaultValue={formValues[dataset.id]['weight']}
                    />
                    <span>{formValues[dataset.id]['weight']}</span>
                    <span>
                      {formValues[dataset.id]['weight']
                        ? ""
                        : "Warning, setting this to 0 means this dataset will not be factored in to your results at all."}
                    </span>
                    <h4>What percentage of normalization would you like to apply?</h4>
                    {/* slider */}
                    <input
                      className="form-control-range"
                      key={"normSlider" + index}
                      type="range"
                      onChange={(e)=>{
                        const newVal = e.target.value;
                        setFormValues(prev =>{
                          const next = {...prev};
                          next[dataset.id]['normalizationPercentage'] = newVal;
                          return next;
                        })
                      }}
                      min="0"
                      max="100"
                      defaultValue={formValues[dataset.id]['normalizationPercentage']}
                    />
                    <span>{formValues[dataset.id]['normalizationPercentage']}</span>
                    <p>Make this value higher for datasets that are highly skewed.</p>
                    
                    {/* set missing data handler method and input here */}
                    <h4>How would you like to handle countries that are missing data in this dataset?</h4>
                    <Select
                      onChange={(e)=>{
                        const newVal = e.target.value;
                        const newObj = {...formValues};
                        newObj[dataset.id]['missingDataHandlerMethod'] = newVal;
                        setFormValues(newObj);
                      }}
                      optionsList={missingDataHandlerMethods}
                    ></Select>
                    {/* TODO make this part appear conditionally based on the method selected */}
                    <input
                      type="text"
                      defaultValue={formValues[dataset.id]['missingDataHandlerInput']}
                      onChange={(e)=>{
                        const newVal = e.target.value;
                        const newObj = {...formValues}
                        newObj[dataset.id]['missingDataHandlerInput'] = newVal;
                        setFormValues(newObj);
                      }}
                      placeholder="missingDataHandlerInput"
                    >
                    </input>
                  </div>
                );
              })}
            </div>
          );
        })}

        <button className="btn-primary"onClick={submitForm}>submit</button>
        {sortedResults?<div>
          {sortedResults.map((object,index) =>{
            return (
              <div key={'countryresults'+index}>
                {object['primary_name']}: Rank: {object['rank']} Score:{object['totalScore']}
              </div>
            );
          })}
        </div>:<></>}
        {scoresList?<div >
          <h3>Results</h3>
          <div className="container table-responsive bg-light p-1 m-1 text-dark">
            <table className="table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Total Score</th>
                  <th>Score Breakdown</th>
                </tr>
              </thead>
              <tbody>
            {scoresList
              ? scoresList
                  .sort((a, b) => b[1] - a[1])
                  .map((arr, index) => {
                    return (
                      <tr className="border" key={"resultList" + index}>
                        <th>{arr[0]}</th>
                        <th>{parseFloat(arr[1]).toFixed(2)}</th>
                        <th>
                              {Object.keys(scoreBreakdown[arr[0]]).map((dataset,index) =>{
                                return (
                                <div key={'scorebreakdown'+index} className="table-responsive">
                                <table className="table" key={"sub-table-"+index}>
                                  <tbody>
                                  <tr className="overflow-auto">
                                    <th>
                                      {dataset}
                                    </th>
                                    <th>
                                      {scoreBreakdown[arr[0]][dataset].toFixed(2)}
                                    </th>
                                  </tr>
                                  </tbody>
                                </table>
                                </div>
                              );
                              })}
                        </th>
                      </tr>
                    );
                  })
              : ""}
              </tbody>
            </table>
          </div>
        </div>:<br></br>}
      </div>
    );
  }
  if (isLoading) {
    return <div> LOADING ....</div>;
  }
}
