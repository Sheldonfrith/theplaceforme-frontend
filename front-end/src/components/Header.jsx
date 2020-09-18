import React from 'react';
import { getRequest } from '../lib/HTTP';

export default function Header({setShowDataEntry}) {

    const updateDatabase =()=>{
        getRequest('/update-database');
    }

    return (
        <div className="Header">
        <h1>Where Should I Live?</h1>
    <button onClick={()=>{setShowDataEntry(prev => !prev)}}>Switch View</button>
    <button onClick={updateDatabase}>Update Database Meta-Info</button>
        </div>
    );
}