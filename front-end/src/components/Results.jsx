import React, {useContext} from 'react';
import {GlobalContext} from './containers/GlobalProvider';

export default function Results() {
    const globalContext = useContext(GlobalContext);

    return (
        <div className="Results">
            <h3>Results:</h3>
        <p>Based on the answers you provided, you should live in {globalContext.topResult}.</p>
        <h5>Full Results:</h5>
        <ol>
            {globalContext.orderedResults.map((result, index) => <li key={'result'+index}>{result}</li>)}
        </ol>
        </div>
    );
}