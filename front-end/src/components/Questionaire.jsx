import React from 'react';
import { useContext } from 'react';
import {GlobalContext} from './containers/GlobalProvider';
import QuestionCategory from './QuestionCategory';
import { set } from '../../../back-end/app';

export default function Questionaire(){
    const globalContext = useContext(GlobalContext);

    const fetchAllQuestions = () =>{
        fetch('http://localhost:8080/questions')
        .then(response => response.json())
        .then(data => setQuestions(data));
    }

    const fetchResults = async (answeredQuestions) => {
       const response =  await (await fetch('http://localhost:8080/locations',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(answeredQuestions),
    }
       )).json();
       setResults(response);
    }

    const [allQuestions, setAllQuestions] = useState(fetchAllQuestions);
    const [results, setResults] = useState({});
    const handleClick = (event) => {
        fetchResults();
    }
    return (
        <div className="Questionaire">
            <h3>Answer these questions to find out:</h3>
            {Object.keys(questions.categories).map((category, index) => <QuestionCategory category={category} questions={allQuestions[category]} key={"category"+index}/>)}
            <button onClick={handleClick}>Submit</button>
        </div>
    );
}