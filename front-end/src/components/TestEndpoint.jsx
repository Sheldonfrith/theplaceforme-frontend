import React, {useState, useEffect, useContext} from 'react';

const baseURL = 'http://localhost:4000';

export default function TestEndpoint(props) {
const [currentResponseText, setCurrentResponseText] = useState('');
const [currentEndpoint, setCurrentEndpoint] = useState('');

const onChange = (event) => {
    setCurrentEndpoint(baseURL+event.target.value);
}

const onClick = () => {
    console.log(currentEndpoint);
    fetch(currentEndpoint)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setCurrentResponseText(JSON.stringify(data));
        });
}


return (
<div>
    <input type="text" onChange={onChange} defaultValue="type endpoint url here here"></input>
    <button onClick={onClick}>Check this endpoint</button>
    <div>{currentResponseText}</div>
</div>
);
}
