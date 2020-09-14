import React from 'react';
import { GlobalContext } from './containers/GlobalProvider';
import { useContext } from 'react';
import Question from './Question';

export default function QuestionCategory({category, questions}) {
    const globalContext = useContext(GlobalContext);
    return(
        <div className={'QuestionCategory'+category}>
            <h4>{category}</h4>
            {Object.keys(questions).map((question,index) => <Question key={'question'+index} text={question.text} possibleAnswers={question.possibleAnswers}/>)}
        </div>
    );
}