import React, { useState, useEffect, useContext, useCallback } from "react";
import CountryNamesMaster from "../lib/CountryNamesMaster.json";
import CountrySynonyms from "../lib/CountrySynonyms.json";
import CountryDependents from "../lib/CountryDependents.json";
import Select from "./Select";
import DataInputPopup from "./DataInputPopup";
import DataInputFinalReview from './DataInputFinalReview';

let prevRawDataList = null;
let prevShowFinalReview = false;

const getCountryNamesMaster = () => {
  return CountryNamesMaster;
};
const getCountrySynonyms = () => {
  return CountrySynonyms;
};
const getCountryDependents = () => {
  return CountryDependents;
};

const tempDataList = [
  ["canada", 30],
  ["brazil", 400],
];



//!FUNCTIONAL COMPONENT STARTS HERE
export default function DataInput(props) {

  //view managemet
  const [showPopup, setShowPopup] = useState(false);
  const [showFinalReview, setShowFinalReview] = useState(false);

  //initial state variables (params) for this component
  const [countryNamesMaster, setCountryNamesMaster] = useState(
    getCountryNamesMaster()
  ); //shallow array with list of allowed country names
  const [countrySynonyms, setCountrySynonyms] = useState(getCountrySynonyms()); //object with allowed country names as keys and array of synonym names as values
  const [countryDependents, setCountryDependents] = useState(
    getCountryDependents()
  ); //object with allowed country names as keys and array of dependent names (including synonyms) as values

  //UI Input State Variables
  const [dataLongName, setDataLongName] = useState('');
  const [rawText, setRawText] = useState('');
  const [dataSourceLink, setDataSourceLink] = useState('');
  const [dataLabel, setDataLabel] = useState('');
  const [shouldCombineDependents, setShouldCombineDependents] = useState(false);
  const [dependentCombineMethod, setDependentCombineMethod] = useState(
    "simple-addition"
  );
  const combineMethodList = [
    "simple-addition",
    // "simple-average",
    "bias-false",
    "bias-true",
  ];

  //DATA PROCESSING algorithm state variables
  const [rawDataList, setRawDataList] = useState(null);
  const [finalDataList, setFinalDataList] = useState([['',''],['','']]);
  const [intermediateDataList, setIntermediateDataList] = useState(null);
  const deleteThese = [];
  //popup phase state variables
  const [deleteByPopup, setDeleteByPopup]= useState([]);
  const [savedByPopup, setSavedByPopup] = useState([]);
  const [synConvert, setSynConvert] = useState([]);
  const [depCombine, setDepCombine] = useState([]);
  const [popupQueu, setPopupQueu] = useState([]);
  const tempPopupQueu = [];

  //popup event handlers
  const popupHandlers = {
    popupDelete: (newList) => {
      setDeleteByPopup(newList);
    },
    popupSynonym: (newList) => {
      setSynConvert(newList);
    },
    popupDependent: (newList) => {
      setDepCombine(newList);
    },
    popupSave: (newList) => {
      setSavedByPopup(newList);
    },
  };

  //DataInput UI Methods
  const changeRawText = useCallback(
    (event) => {
      setRawText(event.target.value);
    },
    [setRawText]
  );
  const handleSubmitRaw = useCallback(
    (event) => {
      event.preventDefault();
      //below function modified stackoverflow function
      function excelToObjects(stringData) {
        const returnArray = [];
        //split into rows
        const rows = stringData.split("\n");
        //Note how we start at rowNr = 1, because 0 is the column row
        for (var rowNr = 0; rowNr < rows.length; rowNr++) {
          const cells = [];
          const data = rows[rowNr].split("\t");
          //Loop through all the data
          for (var cellNr = 0; cellNr < data.length; cellNr++) {
            cells[cellNr] = data[cellNr];
          }
          returnArray.push(cells);
        }
        return returnArray;
      }
      setRawDataList(excelToObjects(rawText));
    },
    [rawText, setRawDataList]
  );

  //
  //First stage sorting helper methods//
  //
  //
  const findParentCountry = useCallback(
    (name) => {
    let result = null;

      Object.keys(countryDependents).forEach((country) => {
        countryDependents[country].forEach((dependent) => {
          if (dependent.toLowerCase() === name.toLowerCase()) {
            result= country;
          }
        });
      });
      return result;
    },
    [countryDependents]
  );

  const ifSynonymReturnCountry = useCallback(
    (name) => {
      let result = null;
      Object.keys(countrySynonyms).forEach((country) => {
        countrySynonyms[country].forEach((synonym) => {
          if (synonym.toLowerCase() === name.toLowerCase()) {
            result = country;
          }
        });
      });
      console.log('looked for synonym  of ',name,' found ',result);
      return result;
    },
    [countrySynonyms]
  );

  const depCombineReturnList = useCallback(
    (mainList, parentCountryIndex, parentData, childName, childData, method = dependentCombineMethod) => {
      switch (method) {
        case "simple-addition":
          console.log("combining dependent with simple addition");
          mainList[parentCountryIndex][1] = parentData + childData;
          break;
        case "bias-false":
          console.log("combining dependent with false bias");
          if (parentData === true && childData === false) {
            mainList[parentCountryIndex][1] = false;
          }
          break;
        case "bias-true":
          console.log("combining dependent with true bias");
          if (parentData === false && childData === true) {
            mainList[parentCountryIndex][1] = true;
          }
          break;
        default:
          console.log("error, dependentCombine method not found");
          break;
      }
      //delete child/dependent data
      deleteThese.push(childName);
      console.log('combined data for ',(mainList[parentCountryIndex][0]),'... ', parentData,' and ',childName,childData,' became:',(mainList[parentCountryIndex][1]))
      return mainList;
    },
    [dependentCombineMethod, deleteThese]
  );

  //!Primary data processing algorithm is here, first stage
  useEffect(() => {
      //whenever RawDataList Changes, run it through this verification function
      if (rawDataList === prevRawDataList) return;
      console.log("rawdatalist has changed, processing the data");
      let newDataList = rawDataList;

      //remove empty rows
      newDataList = newDataList.filter(
        (arr) => arr[0].length >= 1 && arr[0] !== ""
      );

      console.log("current list:", newDataList);
      //make sure all rows contain values
      newDataList = newDataList.filter((arr) => arr.length === 2);

      //remove uneccessary whitespaces from all values
      //trim
      newDataList.forEach((arr, index) => {
        console.log("trimming");
        newDataList[index] = [arr[0].trim(), arr[1].trim()];
      });
      //remove duplicate whitespace inside string
      newDataList.forEach((arr, index) => {
        console.log("removing duplicate whitespaces");
        newDataList[index] = [
          arr[0].replace(/\s+/g, " "),
          arr[1].replace(/\s+/g, " "),
        ];
      });

      //make sure the data is either pure numbers or booleans
      //but preserve periods and - signs necessary to convert accurately to float
      newDataList.forEach((arr, index) => {
        console.log("removing strings from values");
        let thisData = arr[1];
        if (typeof thisData === "boolean") return;
        //remove any non-numeric characters except - and .
        thisData = thisData.replace(/[^0-9.-]/g, "");
        //convert to a float
        newDataList[index][1] = parseFloat(thisData);
      });

      //remove accents from the country lists
      newDataList.forEach((arr, index) => {
        console.log("removing accents");
        newDataList[index][0] = arr[0]
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      });
      console.log("current list:", newDataList);
      //search for any key that does not exactly correspond to a name in the countrys master list
      newDataList.forEach((arr, index) => {
        if (!countryNamesMaster.includes(arr[0])) {
          //this country name is not in the master list
          console.log("found name not in master list");
          //search through the synonyms list and convert it if found
          const shouldBeName = ifSynonymReturnCountry(arr[0]);
          if (shouldBeName) {
            //REPLACE SYNONYM
            //found synonym, replace the original name
            console.log('replacing '+newDataList[index][0]+'with'+shouldBeName);
            newDataList[index][0] = shouldBeName;
            return;
          }
          //search through the dependents
          const parentCountry = findParentCountry(arr[0]);
          if (!parentCountry) {
            console.log("no parent no synonym found");
            //ADD TO POPUP QUEU
            //no synonym and no parent country found, alert user and ask for direction
            tempPopupQueu.push(arr);
          }
          if (parentCountry) {
            console.log("dependent country found");
            //COMBINE PARENT WITH DEPENDENT
            //parent country found, combine according to users configuration
            const parentCountryIndex = newDataList.findIndex(
              (element) => element[0] === parentCountry
            );
            const parentData = newDataList[parentCountryIndex][1];
              const childData = arr[1];
            if (shouldCombineDependents) {
              newDataList = depCombineReturnList(
                newDataList,
                parentCountryIndex,
                parentData,
                arr[0],
                childData
              );
            }
              //delete the dependent now that the dependent is dealt with
            deleteThese.push(arr[0]);

          }
        }
      });
      
      //finish the 1st stage process here:
      //delete everything in deleteThese
      newDataList = newDataList.filter(arr => !deleteThese.includes(arr[0]));
      setPopupQueu(tempPopupQueu);
      setIntermediateDataList(newDataList);
      setShowPopup(true);
      prevRawDataList = rawDataList;
  }, [
    rawDataList,
    tempPopupQueu,
    countryNamesMaster,
    deleteThese,
    depCombine,
    depCombineReturnList,
    findParentCountry,
    ifSynonymReturnCountry,
    shouldCombineDependents,
    synConvert,
  ]);

  //!Second stage, after user input gotten from popup component, data processing
  useEffect(()=>{
    //runs whenever showFinalReview becomes true
    if(prevShowFinalReview === showFinalReview) return;
    //process the actions requested by the popup component
    let secondTempDataList = intermediateDataList;
    //DELETE
    deleteByPopup.forEach(name => secondTempDataList = secondTempDataList.filter(arr => arr[0]!==name));
    //SAVED (delete from main list)
    savedByPopup.forEach(arr1=> secondTempDataList = secondTempDataList.filter(arr=>arr[0]!==arr1[0]));
    //SYNONYMS 
    synConvert.forEach(arr => {
      const thisIndex = secondTempDataList.findIndex(element => element[0]===arr[0]);
      secondTempDataList[thisIndex][0]=arr[1];
    })
    //DEPENDENTS
    depCombine.forEach(arr=>{
      const parentIndex = secondTempDataList.findIndex(element => element[0]===arr[1]);
      const parentData = secondTempDataList[parentIndex][1];
      const dependentData = secondTempDataList[secondTempDataList.findIndex(element => element[0]===arr[0])][1];
      const action = arr[2];
      let method;
      switch (action) {
        case 4:
          method = 'simple-addition'
          break;
        case 5:
          method = 'bias-false';
          break;
        case 6:
          method = 'bias-true';
          break;
        default:
          console.log('error, couldnt find action in second useeffect');
          return; 
      }
      secondTempDataList = depCombineReturnList(secondTempDataList,parentIndex,parentData,arr[0],dependentData,method);
    })
    //delete the dependents just dealt with
    console.log('deleting these: ',deleteThese);
    secondTempDataList = secondTempDataList.filter(arr => deleteThese.includes(arr[0])===false);

    //ADD MISSING COUNTRIES WITH BLANK DATA
    //AND OPEN UP A NEW TAB WITH A GOOGLE SEARCH FOR THE DATA IF THIS OPTION HAS BEEN SET
    //first get a list of all countrys in tempdatalist
    const currentCountries = secondTempDataList.map(arr=>arr[0]);
    CountryNamesMaster.forEach(country =>{
      if (!currentCountries.includes(country)){
        //this country is missing from the submitted dataset
        secondTempDataList.push([country,""]);
      }
    });
    //Finish up
    setFinalDataList(secondTempDataList);
    prevShowFinalReview = showFinalReview;
  },[showFinalReview,deleteThese,deleteByPopup,depCombine,depCombineReturnList,intermediateDataList, savedByPopup,synConvert])

  
  //ACTUAL JSX RETURNS HERE

  if (showFinalReview) {
    return (
      <DataInputFinalReview
        dataSourceLink={dataSourceLink}
        setDataSourceLink={setDataSourceLink}
        dataLabel={dataLabel}
        setDataLabel={setDataLabel}
        dataLongName={dataLongName}
        setDataLongName={setDataLongName}
        finalDataList={finalDataList}
        savedByPopup={savedByPopup}
        setFinalDataList={setFinalDataList}
        CountryNamesMaster={CountryNamesMaster}
      />
    );
  }
  if (showPopup) {
    return (
      <DataInputPopup
        showPopup={showPopup}
        CountryNamesMaster={CountryNamesMaster}
        intermediateDataList={intermediateDataList}
        popupQueu={popupQueu}
        shouldCombineDependents={shouldCombineDependents}
        handlers={popupHandlers}
        setShowPopup={setShowPopup}
        setShowFinalReview={setShowFinalReview}
      />
    );
  }
  else {
    return (
      <div>
        <h2>Input Raw Data</h2>
        <form onSubmit={handleSubmitRaw}>
          <input
            type="checkbox"
            onChange={() => setShouldCombineDependents((prev) => !prev)}
          />
          <span>combine dependents with parent country data?</span>
  
          <select onChange={(e) => setDependentCombineMethod(e.target.value)}>
            {combineMethodList.map((method, index) => (
              <option key={"combineMethod" + index} value={method}>
                {method}
              </option>
            ))}
          </select>
          <input
            onChange={(e) => setDataLongName(e.target.value)}
            placeholder="name this dataset"
          />
          <input
            onChange={(e) => setDataSourceLink(e.target.value)}
            placeholder="source link"
          />
          <input
            onChange={(e) => setDataLabel(e.target.value)}
            placeholder="short label code for database"
          />
          <textarea
            onChange={changeRawText}
            placeholder="paste your table here"
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

}
