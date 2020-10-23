
import React, {useState, useEffect, useContext, useCallback} from 'react';


interface CountryBreakdownPopupProps {
    closePopup: any
}

const CountryBreakdownPopup: React.FunctionComponent<CountryBreakdownPopupProps>  =({closePopup}) =>{
    
return (
<div>
    <h1>Country Name</h1>
    <h2>Score Summary</h2>
    <div>Score summary here</div>
    <button>Detailed Score Breakdown</button>
    <div>detailed breakdown list here</div>
    <div>Ads here</div>

</div>
);
}

export default CountryBreakdownPopup;