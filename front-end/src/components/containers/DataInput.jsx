import React, { useState, useEffect, useContext, useCallback } from "react";
import useMyEffect from '../../lib/Hooks/useMyEffect';
import GetUnhandledDatapoints from "../../lib/DataInputMethods/GetUnhandledDatapoints";
import StageOne from "../../lib/DataInputMethods/StageOne";
import useHasChanged from "../../lib/Hooks/useHasChanged";
import DependentCombine from "../../lib/DataInputMethods/DependentCombine";
import useMyState from '../../lib/Hooks/useMyState';
import GetCountries from '../../lib/DataInputMethods/GetCountries';
import GetSynonyms from '../../lib/DataInputMethods/GetSynonyms';
import GetDependents from '../../lib/DataInputMethods/GetDependents';
import {postRequest} from '../../lib/HTTP';

//initialize state structure here
export const DataInputContext = React.createContext({
    showPopup: null,
    showFinalReview: null,
    CountryNamesMaster: [],
    changeRawText: ()=>{},
    setDataLabel: ()=>{},
    setDataSourceLink: ()=>{},
    setDataLongName: ()=>{},
    setShouldRemoveMultiYearData: ()=>{},
    setShouldCombineDependents: ()=>{},
    setDependentCombineMethod: ()=>{},
    combineMethodList: [],
    handleSubmitRaw: ()=>{},
    popupHandlers: {},
    setShowPopup: ()=>{},
    setShowFinalReview: ()=>{},
    popupQueu: ()=>{},
    intermediateDataList: [],
    finalDataList: [],
    savedByPopup: [],
    setFinalDataList:()=>{},
    mainSubmit: ()=>{},
    dataLongName: '',
    dataSourceLink: '',
    dataLabel: '',
    dataType: '',
    setDataType: ()=>{},
    shouldCombineDependents: null,
});


export default function DataInputProvider({children}) {
//view managemet
const [showPopup, setShowPopup] = useMyState(false, 'boolean');
const [showFinalReview, setShowFinalReview] = useMyState(false, 'boolean');

//initial state variables (params) for this component
//shallow array with list of allowed country names
const [countrySynonyms, setCountrySynonyms] = useMyState(GetSynonyms(),'object'); //object with allowed country names as keys and array of synonym names as values
const [countryDependents, setCountryDependents] = useMyState(GetDependents(), 'object'); //object with allowed country names as keys and array of dependent names (including synonyms) as values
const [CountryNamesMaster, setCountryNamesMaster] = useMyState(GetCountries(),'array');

//UI Input State Variables
const [dataLongName, setDataLongName] = useMyState("",'string');
const [rawText, setRawText] = useMyState("",'string');
const [dataSourceLink, setDataSourceLink] = useMyState("",'string');
const [dataLabel, setDataLabel] = useMyState("",'string');
const [dataType, setDataType] = useMyState('','string');
const [dataUnit, setDataUnit] = useMyState('','string');
const [dataNotes, setDataNotes] = useMyState('','string');
const [shouldCombineDependents, setShouldCombineDependents] = useMyState(false,'boolean');
const [shouldRemoveMultiYearData, setShouldRemoveMultiYearData] = useMyState('','string');
const [dependentCombineMethod, setDependentCombineMethod] = useMyState(
  "simple-addition", 'string'
);
const combineMethodList = [
  "simple-addition",
  // "simple-average",
  "bias-false",
  "bias-true",
];

//DATA PROCESSING algorithm state variables
const [rawDataList, setRawDataList] = useMyState(null,'array');
const [finalDataList, setFinalDataList] = useMyState([
  ["", ""],
  ["", ""],
],'array');
const [intermediateDataList, setIntermediateDataList] = useMyState(null,'array');
const deleteThese = [];
//popup phase state variables
const [deleteByPopup, setDeleteByPopup] = useMyState([],'array');
const [savedByPopup, setSavedByPopup] = useMyState([],'array');
const [synConvert, setSynConvert] = useMyState([],'array');
const [depCombine, setDepCombine] = useMyState([],'array');
const [popupQueu, setPopupQueu] = useMyState([],'array');

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
    //convert it all to lowercase immediately
    setRawText(event.target.value.toLowerCase());
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

//!Primary data processing algorithm is here, first stage
const hasRawDataListChanged = useHasChanged(rawDataList);
useMyEffect([hasRawDataListChanged],() => {
  //whenever RawDataList Changes, run it through this verification function
  if (!rawDataList) return;
  console.log("rawdatalist has changed, processing the data");
  const processedRawDataList = StageOne(rawDataList,{
    dependentCombineMethod: dependentCombineMethod,
    shouldRemoveMultiYearData: shouldRemoveMultiYearData,
  });
  setPopupQueu(GetUnhandledDatapoints(processedRawDataList));
  setIntermediateDataList(processedRawDataList);  
  //finish the 1st stage process here:
  setShowPopup(true);
}, [
  rawDataList, setShowPopup, setPopupQueu, setIntermediateDataList
]);

//!Second stage, after user input gotten from popup component, data processing
const hasShowFinalReviewChanged = useHasChanged(showFinalReview);
useMyEffect([hasShowFinalReviewChanged],() => {
    console.log(showFinalReview)
  //runs whenever showFinalReview becomes true
  if (!showFinalReview) return;
  console.log('showfinal review has changed and is truthy',showFinalReview);
  //process the actions requested by the popup component
  let secondTempDataList = intermediateDataList;
  //DELETE
  deleteByPopup.forEach(
    (name) =>
      (secondTempDataList = secondTempDataList.filter(
        (arr) => arr[0] !== name
      ))
  );
  //SAVED (delete from main list)
  savedByPopup.forEach(
    (arr1) =>
      (secondTempDataList = secondTempDataList.filter(
        (arr) => arr[0] !== arr1[0]
      ))
  );
  //SYNONYMS
  synConvert.forEach((arr) => {
    const thisIndex = secondTempDataList.findIndex(
      (element) => element[0] === arr[0]
    );
    secondTempDataList[thisIndex][0] = arr[1];
  });
  //DEPENDENTS
  depCombine.forEach((arr) => {
    const parentIndex = secondTempDataList.findIndex(
      (element) => element[0] === arr[1]
    );
    const parentData = secondTempDataList[parentIndex][1];
    const dependentData =
      secondTempDataList[
        secondTempDataList.findIndex((element) => element[0] === arr[0])
      ][1];
    const action = arr[2];
    let method;
    switch (action) {
      case 4:
        method = "simple-addition";
        break;
      case 5:
        method = "bias-false";
        break;
      case 6:
        method = "bias-true";
        break;
      default:
        console.log("error, couldnt find action in second useeffect");
        return;
    }
    secondTempDataList = DependentCombine(
      secondTempDataList,
      parentIndex,
      parentData,
      arr[0],
      dependentData,
      method
    );
  });
  //delete the dependents just dealt with
  console.log("deleting these: ", deleteThese);
  if(deleteThese) secondTempDataList = secondTempDataList.filter((arr) => !deleteThese.includes(arr[0]));
  //SORT THE LIST IN ALPHABETICAL ORDER
  secondTempDataList = secondTempDataList.sort((a,b)=>{
    if (a[0]===b[0]) return 0;
    return a[0]<b[0]? -1: 1;
  });
  
  //Finish up
  setFinalDataList(secondTempDataList);
}, [
  showFinalReview,
  deleteThese,
  deleteByPopup,
  depCombine,
  DependentCombine,
  intermediateDataList,
  savedByPopup,
  synConvert,
]);

const mainSubmit = (e, inputVals) => {
    
    //are there any extra or missing countries?
    if (finalDataList.length !== CountryNamesMaster.length){
      alert('wrong number of countries. Should have '+CountryNamesMaster.length+' but instead have '+finalDataList.length);
      return;
    }
    //are any of the meta fields missing?
    if (!dataLongName || !dataSourceLink || !dataLabel || !dataUnit || !dataNotes){
      alert('missing metadata');
      return;
    }
    if (!window.confirm("You sure you want to submit this to the database?"))return;
    console.log('submitting to database...');
    //create the dataset object to be sent as body of http request
    const requestBody = {
      meta: {
        longName: dataLongName,
        label: dataLabel,
        sourceLink: dataSourceLink,
        unit: dataUnit,
        dataType: ((dataType!=='number')?dataType:'float'),
        note: dataNotes
      },
    };
    //add each country's data to the requestBody
    //if the data is blank or falsy make it "NULL"
    //validate it to be either floats or booleans
    if (dataType === 'boolean') {console.log('booleans detected')} else {console.log('numbers detected')}

    finalDataList.forEach((arr, index) => {
      //if there is custom input in the final review, use that, otherwise use the value
      //in the finalDataList
      let thisVal = inputVals[arr[0]] ? inputVals[arr[0]] : arr[1];
      if (thisVal === '' || thisVal=== null || thisVal ===' '){ thisVal = null}
      if (dataType === 'boolean'){
        if (thisVal === ('TRUE'||'true'||'True'||true)){
          thisVal = true;
        } else {thisVal = (thisVal===null)?null:false;}
      } else {
        thisVal = (thisVal===null)?null:parseFloat(thisVal);
      }
      //FIREBASE CANNOT STORE NULL VALUES, convert to "NULL" string
      console.log(thisVal);
      if (thisVal===null) thisVal = "NULL";
      if (thisVal===undefined) thisVal = "NULL";
      if (isNaN(thisVal)) thisVal = "NULL";
      requestBody[arr[0]] = thisVal;
    });

    //send the http request
    console.log('submitting this data to the database:',requestBody)
    postRequest("/datasets", requestBody);

    return;
  };

return (
<DataInputContext.Provider
value={{
    showPopup: showPopup,
    showFinalReview: showFinalReview,
    CountryNamesMaster: CountryNamesMaster,
    changeRawText: changeRawText,
    setDataLabel: setDataLabel,
    setDataSourceLink: setDataSourceLink,
    setDataLongName: setDataLongName,
    setShouldRemoveMultiYearData: setShouldRemoveMultiYearData,
    setShouldCombineDependents: setShouldCombineDependents,
    setDependentCombineMethod: setDependentCombineMethod,
    combineMethodList: combineMethodList,
    handleSubmitRaw: handleSubmitRaw,
    popupHandlers: popupHandlers,
    setShowPopup: setShowPopup,
    setShowFinalReview: setShowFinalReview,
    popupQueu: popupQueu,
    intermediateDataList: intermediateDataList,
    finalDataList: finalDataList,
    savedByPopup: savedByPopup,
    setFinalDataList: setFinalDataList,
    mainSubmit: mainSubmit,
    dataLongName: dataLongName,
    dataSourceLink: dataSourceLink,
    dataLabel: dataLabel,
    dataType: dataType,
    setDataType: setDataType,
    shouldCombineDependents: shouldCombineDependents,
}}
>
{children}
</DataInputContext.Provider>
);
}
