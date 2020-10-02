import React, {useState, useEffect, useContext, useCallback} from 'react';
import Select from './reusable/Select';

export default function ChooseDataOperations(props) {

return (
<div>
    <h4>Choose additional operations to be done to the data during step one after basic cleaning</h4>
    <Select optionsList={} onChange={}/>
</div>
);
}
