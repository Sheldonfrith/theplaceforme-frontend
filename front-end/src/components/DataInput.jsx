import React, { useState, useEffect, useContext, useCallback } from "react";
import CountryNamesMaster from "../lib/CountryNamesMaster.json";
import CountrySynonyms from "../lib/CountrySynonyms.json";
import CountryDependents from "../lib/CountryDependents.json";
import Select from "./Select";
import DataInputPopup from "./DataInputPopup";

let prevRawDataList = null;

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

export default function DataInput(props) {
  const [currentDataName, setCurrentDataName] = useState("");
  const [currentDataList, setCurrentDataList] = useState(tempDataList);
  const [rawDataList, setRawDataList] = useState(null);
  const [rawText, setRawText] = useState();
  const [dataSourceLink, setDataSourceLink] = useState(null);
  const [dataLabel, setDataLabel] = useState(null);
  const [countryNamesMaster, setCountryNamesMaster] = useState(
    getCountryNamesMaster()
  ); //shallow array with list of allowed country names
  const [countrySynonyms, setCountrySynonyms] = useState(getCountrySynonyms()); //object with allowed country names as keys and array of synonym names as values
  const [countryDependents, setCountryDependents] = useState(
    getCountryDependents()
  ); //object with allowed country names as keys and array of dependent names (including synonyms) as values
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
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [savedByPopup, setSavedByPopup] = useState(null);
  const [deleteThese, setDeleteThese] = useState([]);
  const [synConvert, setSynConvert] = useState({});
  const [depCombine, setDepCombine] = useState({});
  const [intermediateList, setIntermediateList] = useState(null);
  //popup event handlers
  const handlers = {
    popupDelete: () => {
      setDeleteThese((prev) => prev.push(popupData[0]));
      setShowPopup(false);
    },
    popupSynonym: (boolean, country) => {
      //TODO cannot alter json files from the frontend, need to use database requests
      setSynConvert((prev) => (prev[popupData[0]] = country));
      setShowPopup(false);
    },
    popupDependent: (boolean, country) => {
      //TODO cannot alter the json files from the frontend, need to switch to database calls instead of json files
      setDepCombine((prev) => (prev[popupData[0]] = country));
      setShowPopup(false);
    },
    popupSave: () => {
      setSavedByPopup((prev) => prev.push(popupData));
      setShowPopup(false);
    },
  };

  const findParentCountry = useCallback(
    (name) => {
      Object.keys(countryDependents).forEach((country) => {
        countryDependents[country].forEach((dependent) => {
          if (dependent === name) {
            return country;
          }
        });
      });
      return null;
    },
    [countryDependents]
  );

  const ifSynonymReturnCountry = useCallback(
    (name) => {
      Object.keys(countrySynonyms).forEach((country) => {
        countrySynonyms[country].forEach((synonym) => {
          if (synonym === name) {
            return country;
          }
        });
      });
      return null;
    },
    [countrySynonyms]
  );

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
  const depCombineReturnList = useCallback(
    (mainList, parentCountryIndex, parentData, childData) => {
      switch (dependentCombineMethod) {
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
      return mainList;
    },
    [dependentCombineMethod]
  );

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
      newDataList.forEach((arr, index) => {
        console.log("removing strings from values");
        let thisData = arr[1];
        if (typeof thisData === "boolean") return;
        //remove any non-numeric characters
        thisData = thisData.replace(/\D/g, "");
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
      //TODO
      await newDataList.forEach((arr, index) => {
        if (!countryNamesMaster.includes(arr[0])) {
          //this country name is not in the master list
          console.log("found name not in master list");
          //search through the synonyms list and convert it if found
          const shouldBeName = ifSynonymReturnCountry(arr[0]);
          if (shouldBeName) {
            //found synonym, replace the original name
            console.log("found synonym name");
            newDataList[index][0] = shouldBeName;
          }
          //search through the dependents
          const parentCountry = findParentCountry(arr[0]);
          if (!parentCountry) {
            console.log("no parent no synonym found");
            //no synonym and no parent country found, alert user and ask for direction
            setPopupQueu(prev => prev.push(arr))
          }
          if (parentCountry) {
            console.log("dependent country found");
            //parent country found, combine according to users configuration
            //! NO SUPPORT FOR AVERAGE FUNCTION CURRENTLY
            const parentCountryIndex = newDataList.findIndex(
              (element) => element[0] === parentCountry
            );
            if (shouldCombineDependents) {
              const parentData = newDataList[parentCountryIndex][1];
              const childData = arr[1];
              newDataList = depCombineReturnList(
                newDataList,
                parentCountryIndex,
                parentData,
                childData
              );
              //delete the dependent now that the dependent is dealt with
              deleteThese.push(arr[0]);
            }
          }
        }
      });
      setIntermediateList(newDataList);
      prevRawDataList = rawDataList;
  }, [
    rawDataList,
    countryNamesMaster,
    deleteThese,
    depCombine,
    depCombineReturnList,
    findParentCountry,
    ifSynonymReturnCountry,
    shouldCombineDependents,
    synConvert,
    waitForPopupDone,
  ]);

  useEffect(()=>{
    //go through popups after intermediateList changes
    //set showpopup to true
    //popup input
    //then.
  },[])

  useEffect(()=>{


    //final modification based on the results of all popups
    deleteThese.forEach((country) => {
      const countryIndex = newDataList.findIndex(
        (element) => element[0] === country
      );
      newDataList.splice(countryIndex, 1);
    });
    Object.keys(synConvert).forEach((incorrectCountry) => {
      //key is incorrect, value is correct
      const incorrectCountryIndex = newDataList.findIndex(
        (element) => element[0] === incorrectCountry
      );
      newDataList[incorrectCountryIndex][0] = synConvert[incorrectCountry];
    });
    Object.keys(depCombine).forEach((dependent) => {
      const parentCountry = depCombine[dependent];
      const parentCountryIndex = newDataList.findIndex(
        (element) => element[0] === parentCountry
      );
      const childCountryIndex = newDataList.findIndex(
        (element) => element[0] === dependent
      );
      const parentData = newDataList[parentCountryIndex][1];
      const childData = newDataList[childCountryIndex][1];
      newDataList = depCombineReturnList(
        newDataList,
        parentCountryIndex,
        parentData,
        childData
      );
    });

    //check if any countries on master country list were missed
    console.log("checking for missing data");
    countryNamesMaster.forEach((country, index) => {
      let foundIndex = false;
      newDataList.forEach((arr, index) => {
        if (arr[0] === country) return;
        foundIndex = true;
      });
      if (!foundIndex) {
        newDataList.push([country, ""]);
      }
    });
  },[])

  if (showPopup === false) {
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
            onChange={(e) => setCurrentDataName(e.target.value)}
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
        <h2>Verify data and then send to DB</h2>
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>{dataSourceLink}</th>
            </tr>
            <tr>
              <th>Label</th>
              <th>{dataLabel}</th>
            </tr>
            <tr>
              <th>Country Name</th>
              <th>{currentDataName}</th>
            </tr>
          </thead>
          <tbody>
            {currentDataList.map((dataPair, index) => (
              <tr key={"tableRow" + index}>
                <th>{dataPair[0]}</th>
                <th>{dataPair[1]}</th>
              </tr>
            ))}
          </tbody>
        </table>
        <div>{savedByPopup}</div>
      </div>
    );
  }
  if (showPopup) {
    return (
      <DataInputPopup
        CountryNamesMaster={CountryNamesMaster}
        popupData={popupData}
        shouldCombineDependents={shouldCombineDependents}
        handlers={handlers}
      />
    );
  }
}
