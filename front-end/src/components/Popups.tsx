import React, { useContext, useCallback, Suspense} from 'react';
import LargePopup from './reusable/LargePopup';
// import AccountPopup from './Popup-Account';

// import CountryBreakdownPopup from './Popup-CountryBreakdown';
// import LoginPopup from './Popup-Login';
import { GlobalContext } from './containers/GlobalProvider';
import LoadingPopup from './Popup-Loading';
import SaveQuestionairePopup from './Popup-SaveQuestionaire';
// import ChangeDefaultsPopup from './Popups-ChangeDefaults';
const AccountPopup = React.lazy(()=>import('./Popup-Account'));
const CountryBreakdownPopup =React.lazy(()=>import('./Popup-CountryBreakdown'));
const LoginPopup = React.lazy(()=>import('./Popup-Login'));
const ChangeDefaultsPopup = React.lazy(()=>import('./Popups-ChangeDefaults'));

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
    const fallback = ()=>{
        return <LoadingPopup/>;
    }
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
{gc.currentPopup==='login'?<Suspense fallback={fallback()}><LoginPopup  closePopup={closePopup}/></Suspense>:<></>}
{gc.currentPopup==='account'?<Suspense fallback={fallback()}><AccountPopup  closePopup={closePopup}/></Suspense>:<></>}
{gc.currentPopup==='countryBreakdown'?<Suspense fallback={fallback()}><CountryBreakdownPopup closePopup={closePopup}/></Suspense>:<></>}
{gc.currentPopup==='changeDefaults'?<Suspense fallback={fallback()}><ChangeDefaultsPopup closePopup={closePopup}/></Suspense>:<></>}
{gc.currentPopup==='saveQuestionaire'?<Suspense fallback={fallback()}><SaveQuestionairePopup closePopup={closePopup}/></Suspense>:<></>}
</LargePopup>
);
} else {
    //current popup === null
    return <></>;
}
}

export default Popups;