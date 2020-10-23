import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import Header from './Header';
import LargePopup from './reusable/LargePopup';
import AccountPopup from './Popup-Account';
import CountryBreakdownPopup from './Popup-CountryBreakdown';
import LoginPopup from './Popup-Login';
import { GlobalContext } from './containers/GlobalProvider';

//this page should allow for:
//logout
//view account details (only doing oath so cant change the details)
//view and load saved questionaires

interface PopupsProps{
}
const Popups: React.FunctionComponent<PopupsProps>=({}) =>{
    const gc = useContext(GlobalContext);
    const containerRef = useRef(null);
    const closePopup = ()=>gc.setCurrentPopup(null);
if (gc.currentPopup){
return (
<div ref={containerRef}>
<LargePopup
    containerRef={containerRef}
    containerDisplay={'block'}
    closePopup={closePopup}
    accentColor={null}
    lightColor={null}
    darkColor={null}
    closeButtonBackgroundColor={null}
    closeButtonColor={null}
    containerStyle={null}
>
{gc.currentPopup==='login'?<LoginPopup closePopup={closePopup}/>:<></>}
{gc.currentPopup==='account'?<AccountPopup closePopup={closePopup}/>:<></>}
{gc.currentPopup==='countryBreakdown'?<CountryBreakdownPopup closePopup={closePopup}/>:<></>}
</LargePopup>
</div>
);
} else {
    //current popup === null
    return <></>;
}
}

export default Popups;