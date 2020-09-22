import React, { useState, useEffect, useContext } from "react";
import { postRequest } from "../lib/HTTP";

const googleSearch = (searchQuery)=>{
  //replace spaces in the search query with +
  searchQuery = searchQuery.replace(" ","+");
  const baseURL = 'https://www.google.com/search?q=';
  const fullURL = baseURL+searchQuery;
  window.open(fullURL,"_blank");
}

export default function DataInputFinalReview({
  dataSourceLink,
  setDataSourceLink,
  dataLabel,
  setDataLabel,
  dataLongName,
  setDataLongName,
  finalDataList,
  savedByPopup,
  setFinalDataList,
  CountryNamesMaster,
}) {
  //show one table that has only the country names from the master list, plus there recently
  //calculated values, with the ability to manually change these values
  //show beside it another list with the datapoints saved during the popup phase of the data processing
  //have one submit button
  const initializeInputVals = () =>{
    const result = {};
    finalDataList.forEach(arr=>{
      result[arr[0]] = '';
    })
    return result;
  }
  const [inputVals, setInputVals] = useState(initializeInputVals());
  const [isBooleans, setIsBooleans] = useState(false);
  const [dataUnit, setDataUnit] = useState('');
  const [dataNotes, setDataNotes]= useState('');

  const mainSubmit = (e) => {
    
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
    const dataType = isBooleans?'boolean':'float';
    const requestBody = {
      meta: {
        longName: dataLongName,
        label: dataLabel,
        sourceLink: dataSourceLink,
        unit: dataUnit,
        dataType: dataType,
        note: dataNotes
      },
    };
    //add each country's data to the requestBody
    //if the data is blank or falsy make it "NULL"
    //validate it to be either floats or booleans
    if (isBooleans) {console.log('booleans detected')} else {console.log('numbers detected')}

    finalDataList.forEach((arr, index) => {
      //if there is custom input in the final review, use that, otherwise use the value
      //in the finalDataList
      let thisVal = inputVals[arr[0]] ? inputVals[arr[0]] : arr[1];
      if (thisVal === '' || thisVal=== null || thisVal ===' '){ thisVal = null}
      if (isBooleans){
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
      if (thisVal===NaN) thisVal = "NULL";
      requestBody[arr[0]] = thisVal;
    });

    //send the http request
    console.log('submitting this data to the database:',requestBody)
    postRequest("/datasets", requestBody);

    return;
  };
//TODO ADD dataType and Unit fields...
  return (
    <div>
      <h2>Final Review of Data</h2>
      <table>
        <thead>
          <tr>
            <th>Data Name</th>
            <th>{dataLongName}</th>
            <th>
              <input
                type="text"
                onChange={(e) => {
                  setDataLongName(e.target.value);
                }}
              />
            </th>
          </tr>
          <tr>
            <th>Source</th>
            <th>{dataSourceLink}</th>
            <th>
              <input
                type="text"
                onChange={(e) => {
                  setDataSourceLink(e.target.value);
                }}
              />
            </th>
          </tr>
          <tr>
            <th>Label</th>
            <th>{dataLabel}</th>
            <th>
              <input
                type="text"
                onChange={(e) => {
                  setDataLabel(e.target.value);
                }}
              />
            </th>
          </tr>
          <tr>
            <th>Unit</th>
            <th>{dataUnit}</th>
            <th>
              <input
                type="text"
                onChange={(e)=>{
                  setDataUnit(e.target.value);
                }}
                />
            </th>
          </tr>
          <tr>
            <th>Notes</th>
            <th>{dataNotes}</th>
            <th>
              <input
                type="text"
                onChange={(e)=>{
                  setDataNotes(e.target.value);
                }}
                />
              </th>
          </tr>
          <tr>
            <th>Country Name</th>
            <th>Value</th>
            <th>Over-ride Value</th>
          </tr>
        </thead>
        <tbody>
          {finalDataList.map((dataPair, index) => (
            <tr key={"tableRow" + index}>
              <th>{dataPair[0]}</th>
              <th>{dataPair[1]}</th>
              <th>
                <input
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setInputVals((prev) => {prev[dataPair[0]] = newVal;return prev});
                  }}
                  defaultValue={inputVals[dataPair[0]]}
                />
              </th>
              <th>
                <button onClick={()=>googleSearch(dataPair[0]+' '+dataLongName)}>Google</button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
      <input type="checkbox" onChange={()=>setIsBooleans(prev => !prev)}/>
      <span>Check if the data is booleans</span>
      <button onClick={mainSubmit}>SUBMIT TO DATABASE</button>
      <h3>Saved (deleted from actual list) values for review:</h3>
      <div>
        {savedByPopup.map((arr, index) => {
          return (
            <p key={"savedvals" + index}>
              {arr[0]} : {arr[1]}
            </p>
          );
        })}
      </div>
    </div>
  );
}
