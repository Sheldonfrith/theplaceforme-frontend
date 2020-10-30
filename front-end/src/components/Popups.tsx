import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import Header from './Header';
import LargePopup from './reusable/LargePopup';
import AccountPopup from './Popup-Account';
import CountryBreakdownPopup from './Popup-CountryBreakdown';
import LoginPopup from './Popup-Login';
import { GlobalContext } from './containers/GlobalProvider';
import styled from 'styled-components';
import ChangeDefaultsPopup from './Popups-ChangeDefaults';
// import {StyledContext} from './containers/StyledProvider';

//this page should allow for:
//logout
//view account details (only doing oath so cant change the details)
//view and load saved questionaires

interface PopupsProps{

}
const Popups: React.FunctionComponent<PopupsProps>=({}) =>{
    const gc = useContext(GlobalContext);
    const closePopup = ()=>gc.setCurrentPopup(null);
if (gc.currentPopup){
return (
<LargePopup
    containerDisplay={'block'}
    closePopup={closePopup}
    accentColor={null}
    lightColor={null}
    darkColor={null}
    closeButtonBackgroundColor={null}
    closeButtonColor={null}
    containerStyle={null}
>
{gc.currentPopup==='login'?<LoginPopup  closePopup={closePopup}/>:<></>}
{gc.currentPopup==='account'?<AccountPopup  closePopup={closePopup}/>:<></>}
{gc.currentPopup==='countryBreakdown'?<CountryBreakdownPopup closePopup={closePopup}/>:<></>}
{gc.currentPopup==='changeDefaults'?<ChangeDefaultsPopup closePopup={closePopup}/>:<></>}
</LargePopup>
);
} else {
    //current popup === null
    return <></>;
}
}

export default Popups;