import React from "react";
import { useEffect } from "react";
import { useContext, useState, useCallback } from "react";
import { getRequest } from "../lib/HTTP";
import _ from "lodash";
import { convertNullsInObject, convertObjectToLowerCase} from "../lib/Utils";

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
  const [lcDatasetsData, setlcDatasetsData] = useState(null);//lowercased
  const [rawDatasetsData, setRawDatasetsData] = useState(null); //not lower cased
  const [scoreBreakdown, setScoreBreakdown] = useState(null); //object with countries as keys, array as value, each value array has dataset name as index 0 and and total score as index 1
  const [howToHandleMissingData, setHowToHandleMissingData] = useState(
    "neutral"
  );
  const [scoresList, setScoresList] = useState(null); //nested array with countries as 0 and scores as 1

  //onmount get the raw data from the server
  useEffect(() => {
    const asyncWrapper = async () => {
      const httpResponse = await getRequest("/datasets");
      const nullsConverted = await convertNullsInObject(httpResponse);
      const lowerCased = await convertObjectToLowerCase(nullsConverted);
      setlcDatasetsData(lowerCased);
      setRawDatasetsData(nullsConverted);
    };
    asyncWrapper();
  }, []);

  //once the data is retrieved, use it to set the relevant state variables
  useEffect(() => {
    //only run once, when datasetsData has been loaded
    if (lcDatasetsData && isLoading && rawDatasetsData) {
      console.log(lcDatasetsData);
      const getFromDatasetsData = (property) => {
        //remove meta from the iteration array
        let result = [];
        Object.keys(rawDatasetsData).forEach((rawID) => {
          const id=rawID.toLowerCase();
          //ignore meta field
          if (id === "meta") return;
          //create list of dataset ids;
          if (property === "id") {
            result.push(id);
            return;
          }
          if (property === 'rawID'){
            result.push(rawID);
            return;
          }
          //create list of vals that are halfway between min and max vals
          if (property === "val") {
            const max = lcDatasetsData[id].meta.maxvalue;
            const min = lcDatasetsData[id].meta.minvalue;
            result.push((max - min * 1.0) / 2.0 + min);
            return;
          }
          const thisData = lcDatasetsData[id].meta[property];
          result.push(thisData);
          return;
        });
        return result;
      };
      const blankList = () => {
        const result = Object.keys(lcDatasetsData).map((id) => {
          return "";
        });
        result.pop(); //remove the last value to account for the meta field in the datasets
        return result;
      };
      const getCountries = () => {
        let result = [];
        //go through all countries in 1st dataset and use that as master country list
        Object.keys(lcDatasetsData[Object.keys(lcDatasetsData)[0]]).forEach(
          (country) => {
            if (country === "meta") return;
            result.push(country);
          }
        );
        return result;
      };
      const zeroList = () => {
        let result = [];
        for (let i = 0; i < lcDatasetsData.length - 2; i++) {
          result.push(0);
        }
        return result;
      };
      setDatasetIDs(getFromDatasetsData("id"));
      setRawDatasetIDs(getFromDatasetsData('rawID'));
      setMaxVals(getFromDatasetsData("maxvalue"));
      setLongNames(getFromDatasetsData("longname"));
      setMinVals(getFromDatasetsData("minvalue"));
      setDataTypes(getFromDatasetsData("datatype"));
      setUnits(getFromDatasetsData("unit"));
      setCountries(getCountries());
      setVals(getFromDatasetsData("val"));
      setWeights(blankList());
    }
    return;
  }, [
    lcDatasetsData,
    rawDatasetsData,
    setRawDatasetIDs,
    setDatasetIDs,
    setMinVals,
    setCountries,
    setMaxVals,
    setLongNames,
    setVals,
    setWeights,
    setIsLoading,
    isLoading,
  ]);

  //once those states are loaded, set isloading to false
  useEffect(() => {
    if (!isLoading) return;
    if (!minVals) return;
    if (!longNames) return;
    if (!maxVals) return;
    if (!countries) return;
    if (!vals) return;
    if (!weights) return;
    console.log('done loading', longNames, minVals, maxVals, countries, weights,vals);
    setIsLoading(false);
  }, [
    isLoading,
    setIsLoading,
    minVals,
    longNames,
    maxVals,
    countries,
    vals,
    weights,
  ]);

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
        // console.log(
        //   "in " +
        //     country +
        //     " calc for " +
        //     longNames[index] +
        //     " with " +
        //     thisData +
        //     " turning into " +
        //     newScore +
        //     " plus old " + 
        //     oldScore
        // );
        _.set(tempScoreBreakdown, `${country}[${longNames[index]}]`, newScore);
        // console.log(tempScoreBreakdown);
        countryScoreTotal[country] = oldScore + newScore;
        // console.log(countryScoreTotal);
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

  if (!isLoading) {
    return (
      <div className="container-fluid text-light p-3 bg-dark">
        <h3>Answer these questions to find out which countries are the best fit for you:</h3>
        {longNames.map((name, index) => {
          return (
            <div className="container border rounded p-3 m-3 bg-light text-dark" key={"mockData" + index}>
              <h3>Question {index + 1}:</h3>
              <h4>What {name} would you prefer your country to have?</h4>
              {/* slider */}
              <input
                className="form-control-range"
                key={"valSlider" + index}
                type="range"
                onChange={(e)=>changeVal(e.target.value,index)}
                min={minVals[index]}
                max={maxVals[index]}
                defaultValue={vals[index]}
              />
              <span>
                {parseFloat(vals[index]).toFixed(2)} {units[index]}
              </span>
              <h4>How important is this to you?</h4>
              {/* slider */}
              <input
                className="form-control-range"
                key={"weightSlider" + index}
                type="range"
                onChange={(e)=>changeWeight(e.target.value,index)}
                min="0"
                max="10"
                defaultValue={weights[index] || 0}
              />
              <span>{weights[index]}</span>
              <span>
                {weights[index]
                  ? ""
                  : "Warning, setting this to 0 means this dataset will not be factored in to your results at all."}
              </span>
            </div>
          );
        })}
        <h4>
          What should we do when there is no data available for a country?
        </h4>
        <select
          className="form-control"
          onChange={(e) => {
            setHowToHandleMissingData(e.target.value);
          }}
        >
          <option value={"neutral"}>
            Give it an average value so the lack of data doesn't affect its
            final score
          </option>
          <option value={"good"}>
            Rank it well, reward the country for not having data
          </option>
          <option value={"bad"}>
            Rank it poorly, penalize the country for not having data
          </option>
        </select>
        <button className="btn-primary"onClick={calculateResult}>submit</button>
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
