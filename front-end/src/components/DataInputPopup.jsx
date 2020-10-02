import React, { useState, useEffect, useContext } from "react";
import { DataInputContext } from "./containers/DataInput";
import useMyState from '../lib/Hooks/useMyState';

export default function DataInputPopup(props) {
  const dataInputContext = useContext(DataInputContext);
  const {popupHandlers,
     CountryNamesMaster, 
     shouldCombineDependents, 
     popupQueu,
     setShowPopup,
     intermediateDataList,
     setShowFinalReview,
    } = dataInputContext;
    const handlers = popupHandlers;
  
  const tempDeleteList = [];
  const tempSynList = [];
  const tempDepList = [];
  const tempSaveList = [];
  const initCountrySelectList =()=>{
    let obj = {};
    popupQueu.forEach((arr,index)=>obj[arr[0]] = 'none');
    return obj;
  }
  const [countrySelectList, setCountrySelectList] = useMyState(initCountrySelectList(),'object');
  const initPossibleActions = ()=>{
    let obj = {};
    popupQueu.forEach((arr,index)=> obj[arr[0]] = 1);
    return obj;
  }
  const [possibleActionsList, setPossibleActionsList] = useMyState(initPossibleActions(),'object');
  const possibleActions = [
    "delete",
    "saveForReview",
    "setToCountry",
    "combineWithCountry-addition",
    "combineWithCountry-false-bias",
    "combineWithContry-true-bias",
  ];
  const handlePossibleActionsChange = (event) => {
    const dataKey = event.target.id;
    const action = event.target.value;
    console.log('changing action selection for ',dataKey,' to ',action);
    switch (action) {
      case possibleActions[0]:
        setPossibleActionsList((prev) => {prev[dataKey] = 1;return prev;});
        break;
      case possibleActions[1]:
        setPossibleActionsList((prev) => {prev[dataKey] = 2;return prev;});
        break;
      case possibleActions[2]:
        setPossibleActionsList((prev) => {prev[dataKey] = 3;return prev;});
        break;
      case possibleActions[3]:
        setPossibleActionsList((prev) => {prev[dataKey] = 4;return prev;});
        break;
      case possibleActions[4]:
        setPossibleActionsList((prev) => {prev[dataKey] = 5;return prev;});
        break;
      case possibleActions[5]:
        setPossibleActionsList((prev) => {prev[dataKey] = 6;return prev;});
        break;
      default:
        console.log("error, action not found in handlePossibleActionsChange");
        return;
    }
  };
  const handleCountrySelectChange = (event) => {
    const country = event.target.value;
    const dataKey = event.target.id;
    setCountrySelectList((prev) =>{ (prev[dataKey] = country); return prev;});
    console.log('changing selected country ',dataKey,country)
  };

  const submitAll = (event) =>{
    if (!window.confirm('are you sure you are okay with this configuration?')) return;
    popupQueu.forEach((arr,index)=>{
      const invalidName = arr[0];
      const action = possibleActionsList[invalidName];
      const country = countrySelectList[invalidName];
      switch (action){
        case 1:
          tempDeleteList.push(invalidName);
          break;
        case 2:
          tempSaveList.push(arr);
          break;
        case 3:
          tempSynList.push([invalidName,country]);
          break;
        case 4:
          tempDepList.push([invalidName,country,action]);
          break;
        case 5:
          tempDepList.push([invalidName,country,action]);
          break;
        case 6:
          tempDepList.push([invalidName,country,action]);
          break;
        default:
          console.log('error, couldnt find action in submitall ',action, possibleActionsList, invalidName);
          break;
      }
    });
    //set to state
    handlers.popupDelete(tempDeleteList);
    console.log('deleted these ',tempDeleteList);
    handlers.popupSave(tempSaveList);
    console.log('saved these ',tempSaveList);
    handlers.popupSynonym(tempSynList);
    console.log('synonymed these ', tempSynList);
    handlers.popupDependent(tempDepList);
    console.log('dependented these ', tempDepList, 'with... ',countrySelectList);
    setShowPopup(false);
    setShowFinalReview(true);
  }

  return (
    <div>
      {/* List of the popup queu data */}
      {popupQueu.map((arr, index) => {
        return (
          <div key={"popupQueu" + index}>
            <p>
              {arr[0]}:{arr[1]}
            </p>
            <select id={arr[0]} onChange={handlePossibleActionsChange}>
              {possibleActions.map((action, index) => (
                <option
                  id={arr[0]}
                  key={"possibleactions" + index}
                  value={action}
                >
                  {action}
                </option>
              ))}
            </select>
            <select id={arr[0]} onChange={handleCountrySelectChange}>
              <option 
                id={arr[0]}
                value={'none'}
              >
                none
              </option>
              {CountryNamesMaster.map((country, index) => (
                <option
                  id={arr[0]}
                  key={"countrySelect" + index}
                  value={country}
                >
                  {country}
                </option>
              ))}
            </select>
          </div>
        );
      })}
      <button onClick={submitAll}>Submit All</button>
    </div>
  );
}
