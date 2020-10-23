import React, {useState, useEffect, useContext, useCallback} from 'react';
import { GlobalContext } from './containers/GlobalProvider';
import Header from './Header';

interface ResultsPageProps {
    
}

const ResultsPage: React.FunctionComponent<ResultsPageProps> = ({}) =>{
const gc = useContext(GlobalContext);
return (
<div>
    <Header/>
    <button onClick={(e)=>gc.setCurrentPage('questionaire')}>Back to Questions</button>
    <h2>Your Results:</h2>
    <div>

    </div>
    <button>Share</button>
    <button>Save</button>
</div>
);
}

export default ResultsPage;