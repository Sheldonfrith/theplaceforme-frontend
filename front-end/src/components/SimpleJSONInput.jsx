import React, {useState, useEffect, useContext, useCallback} from 'react';
import useMyState from '../lib/Hooks/useMyState';
import useMyEffect from '../lib/Hooks/useMyEffect';
import useHasChanged from '../lib/Hooks/useHasChanged';

export default function SimpleJSONInput(props) {
    const [rawInput, setRawInput] = useMyState(null,'string');
    const [jsonInput, setJsonInput] = useMyState(null, 'object');
    const [jsonOutput, setJsonOutput]= useMyState(null,'object');
    const [JSCode, setJSCode] = useMyState(null, 'string');
    
    //when rawInput changes convert it to json
    const hasRawInputChanged = useHasChanged(rawInput);
    useMyEffect([hasRawInputChanged],()=>{
        if (!rawInput) return;
        //DataInput UI Methods
        //convert to lower case
        let modifiedInput = rawInput.toLowerCase();
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
        modifiedInput = excelToObjects(modifiedInput);
        setJsonInput(modifiedInput);
    },[rawInput, setJsonInput])

    //when json input or jscode changes calculate the json output
    const applyCalculation = (inputObject, codeString)=>{
        const result = eval(codeString);
        return result;
    };
    const calculate = ()=>{
        setJsonOutput(applyCalculation(jsonInput,JSCode));
    }

return (
<div className="form-group">
    <h4>Input excel data here, it gets converted to json</h4>
    <textarea 
    type="text" 
    onChange={(e)=>setRawInput(e.target.value)}
    placeholder={'input csv here'}
    ></textarea>
    <h4>Write code to operate on the json here, reference the json with 'inputObject'</h4>
    <textarea
    type="text"
    onChange={(e)=>setJSCode(e.target.value)}
    ></textarea>
    <button onClick={calculate}>Calculate</button>
    <h4>See the results here:</h4>
    <div>{JSON.stringify(jsonOutput)}</div>
    <button>Submit the processed json to data entry</button>
</div>
);
}
