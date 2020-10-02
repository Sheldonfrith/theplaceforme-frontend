import React, { useState, useEffect, useContext } from "react";
import { postRequest } from "../lib/HTTP";
import { DataInputContext } from "./containers/DataInput";
import useMyState from "../lib/Hooks/useMyState";
import Table from "./reusable/Table";
import TextInput from "./reusable/TextInput";
import Button from './reusable/Button';

const googleSearch = (searchQuery) => {
  //replace spaces in the search query with +
  searchQuery = searchQuery.replace(" ", "+");
  const baseURL = "https://www.google.com/search?q=";
  const fullURL = baseURL + searchQuery;
  window.open(fullURL, "_blank");
};

export default function DataInputFinalReview(props) {
  const dataInputContext = useContext(DataInputContext);
  const {
    setDataSourceLink,
    setDataLabel,
    setDataLongName,
    finalDataList,
    savedByPopup,
    setFinalDataList,
    CountryNamesMaster,
    dataLongName,
    dataSourceLink,
    dataLabel,
    mainSubmit,
  } = dataInputContext;
  //show one table that has only the country names from the master list, plus there recently
  //calculated values, with the ability to manually change these values
  //show beside it another list with the datapoints saved during the popup phase of the data processing
  //have one submit button
  const initializeInputVals = () => {
    const result = {};
    finalDataList.forEach((arr) => {
      result[arr[0]] = "";
    });
    return result;
  };
  const [inputVals, setInputVals] = useMyState(initializeInputVals(), "object");
  const [isBooleans, setIsBooleans] = useState(false, "boolean");
  const [dataUnit, setDataUnit] = useState("", "string");
  const [dataNotes, setDataNotes] = useState("", "string");

  const getTable1Column3 = ()=>{
    return [
      <TextInput onChange={(e)=> {const val = e.target.value; setDataLongName(val);}} />,
      <TextInput onChange={(e)=> {const val = e.target.value; setDataSourceLink(val);}} />,
      <TextInput onChange={(e)=> {const val = e.target.value; setDataLabel(val);}} />,
      <TextInput onChange={(e)=> {const val = e.target.value; setDataUnit(val);}} />,
      <TextInput onChange={(e)=> {const val = e.target.value; setDataNotes(val);}} />
    ];
  }

  const getTable2Column1 = ()=>{
    return  finalDataList.map((arr) => arr[0]);
  }
  const getTable2Column2 = ()=>{
    return finalDataList.map((arr) => arr[1]);
  }
  const getTable2Column3 = ()=>{
    return finalDataList.map((arr,index)=>{
    return (
      <div key={arr[0]+index}>
        <TextInput
          onChange={(e) => {
            const newVal = e.target.value;
            setInputVals((prev) => {
              prev[arr[0]] = newVal;
              return prev;
            });
          }}
        />
        <Button
          onClick={() => googleSearch(arr[0] + " " + dataLongName)}
        >
          Google
        </Button>
      </div>
    );});
  }

  //TODO ADD dataType and Unit fields...
  return (
    <div>
      <h2>Final Review of Data</h2>
      <Table
        header={["Meta Field", "Value", "Edit Value"]}
        columns={
          [["Dataset Name", "Source Link", "Label", "Unit", "Notes"],
          [dataLongName, dataSourceLink, dataLabel, dataUnit, dataNotes],
          getTable1Column3()]
        }
      />
      <Table
        header={["Country Name", "Value", "Edit Value"]}
        columns={
         [getTable2Column1(),
         getTable2Column2(),
         getTable2Column3()]
        }
      />
      <button onClick={(e) => mainSubmit(e, inputVals)}>
        SUBMIT TO DATABASE
      </button>
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
