import React from 'react';
import { useContext } from 'react';
import {GlobalContext} from './containers/GlobalProvider';
import QuestionCategory from './QuestionCategory';

export default function Questionaire(){
    const globalContext = useContext(GlobalContext);
    const handleClick = (event) => {
        fetch('http://localhost:4000/')
        .then(response => response.json())
        .then(data => console.log(data));
    }
    return (
        <div className="Questionaire">
            <h3>Answer these questions to find out:</h3>
            {globalContext.categories.map((category, index) => <QuestionCategory category={category} key={"category"+index}/>)}
            <button onClick={handleClick}>Submit</button>
        </div>
    );
}