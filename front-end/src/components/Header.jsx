import React, {useState} from 'react';
import { getRequest } from '../lib/HTTP';

export default function Header(props) {
    

    return (
        <div className="container-fluid bg-dark text-light p-3">
        <h1 className="text-white">The Place For Me</h1>
        <h3 className="text-light">Get accurate country rankings based on what YOU value.</h3>
        <button className="btn btn-warning" onClick={()=>window.open('https://sheldonfrith.com')}>By Sheldon Frith</button>
        <button className="btn btn-warning" onClick={()=>window.open('https://github.com/Sheldonfrith/whereshouldilive')}>View This Project On GitHub</button>
        </div>
    );
}