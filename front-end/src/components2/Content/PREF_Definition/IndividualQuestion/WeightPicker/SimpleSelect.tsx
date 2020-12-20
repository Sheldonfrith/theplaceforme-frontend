import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {ListGroup} from 'react-bootstrap';

export interface WeightSimpleSelectProps{
    options: {name: string, weightValue: number}[],
    getWeight ():number,
    setWeight (weight: number): void,
}
const WeightSimpleSelect: React.FunctionComponent<WeightSimpleSelectProps> =({options, setWeight, getWeight})=> {

return (
<ListGroup>
    {options.map(option=>{
        return <ListGroup.Item key={option.weightValue} action onClick={()=>setWeight(option.weightValue)} active={(option.weightValue===getWeight())}>{option.name}</ListGroup.Item>
    })}
</ListGroup>
);
}
export default WeightSimpleSelect;
