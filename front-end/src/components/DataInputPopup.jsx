import React, {useState, useEffect, useContext} from 'react';
import Select from './Select';

export default function DataInputPopup({handlers, CountryNamesMaster, shouldCombineDependents, popupData}) {
const [addToSynonym, setAddToSynonym] = useState(false);
const [addToDependent, setAddToDependent] = useState(false);
const [synCountry, setSynCountry] = useState(null);
const [depCountry, setDepCountry] = useState(null);

const onChange=(e)=>{
    return;
}

return (
<div>
        <h2>The following data was not able to be matched to a known country: {popupData}</h2>
        <h3>What would you like to do?</h3>
        <h4>Delete</h4>
          <button onClick={handlers.popupDelete}>Delete the entry, it is not needed</button>
        <h4>Set to Country</h4>
          <Select onChange={(e)=>setSynCountry(e.target.value)} list={CountryNamesMaster}/>
          <input type="checkbox" onChange={()=> setAddToSynonym(prev => !prev)}/><span>Add this name to the country's synonyms list?</span>
          <button onClick={() => handlers.popupSynonym(addToSynonym,synCountry)}>Set it as this country's value</button>
        <h4>Set as dependent of Country</h4>
          <Select onChange={(e)=>setDepCountry(e.target.value)} list={CountryNamesMaster}/>
          <input type="checkbox" onChange={()=> setAddToDependent(prev => !prev)}/><span>Add this name to the country's dependents list?</span>
          <button onClick={()=>handlers.popupDependent(addToDependent,depCountry)}>{
            shouldCombineDependents?'Combine with this country using previously selected method':'Combine with this country using simple addition method'
            }</button>
        <h4>Save to note list</h4>
            <button onClick={handlers.popupSave}>do not use in the dataset, but make it visible for the manual review stage </button>
    </div>
);
}