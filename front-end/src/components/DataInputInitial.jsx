import React, {useState, useEffect, useContext, useCallback} from 'react';
import { getRequest } from '../lib/HTTP';
import { DataInputContext } from './containers/DataInput';
import Checkbox from './reusable/Checkbox';
import Select from './reusable/Select';

export default function DataInputInitial(props) {
const [testResult, setTestResult] = useState('');
const dataInputContext = useContext(DataInputContext);
const {handleSubmitRaw, 
    setShouldCombineDependents, 
    setDependentCombineMethod, 
    combineMethodList,
    setShouldRemoveMultiYearData,
    setDataLongName,
    changeRawText,
    shouldCombineDependents,
} = dataInputContext;
return (
<div className="form-group">
        <Checkbox label={'Combine dependents with parent country?'} onChange={() => setShouldCombineDependents((prev) => !prev)}/>
        {shouldCombineDependents?
        (
            <div>
                What combine method do you want to use?
                <Select optionsList={combineMethodList} onChange={(e) => setDependentCombineMethod(e.target.value)}/>
            </div>
        )
        :''}
          <label htmlFor="removeMultiYearData">
          Remove Multi year Data</label>
          <Select optionsList={['no','top','bottom']} onChange={(e)=>setShouldRemoveMultiYearData(e.target.value==='no'?'':e.target.value)}/>
          <h4>Dataset Name:</h4>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setDataLongName(e.target.value)}
            placeholder="name this dataset"
          />
        <h2>Input Raw Data</h2>
          <textarea
            onChange={changeRawText}
            placeholder="paste your table here"
          ></textarea>
          <button onClick={async (e)=>{
            const newVal = await getRequest('/countries');
            setTestResult(newVal);
          }}>test getcountries</button>
          <div>result here: {JSON.stringify(testResult)}</div>
          {/* <p>Just the countries</p>
          <textarea
            onChange={changeRawTextCountries}
            placeholder="paste countries list here"
          ></textarea>
          <textarea
            onChange={changeRawTextData}
            placeholder='paste data list here'
          ></textarea> */}
          <button onClick={handleSubmitRaw}>Submit</button>
      </div>
);
}
