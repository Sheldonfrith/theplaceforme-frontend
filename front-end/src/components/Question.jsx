import React, {} from 'react';

export default function Question ({text, possibleAnswers}) {
    return (
        <div className="Question">
            <h3>{text}</h3>
            <p>{JSON.stringify(possibleAnswers)}</p>
        </div>
    );
}