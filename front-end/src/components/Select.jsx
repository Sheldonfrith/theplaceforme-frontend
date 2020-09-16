import React, {useState, useEffect, useContext} from 'react';

export default function Select({onChange, list}) {
const randomKey = Math.random();
return (
<select onChange={onChange}>
    {list.map((item,index)=><option key={randomKey+index} value={item}>{item}</option>)}
</select>
);
}
