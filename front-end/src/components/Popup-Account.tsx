import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import Header from './Header';
import LargePopup from './reusable/LargePopup';

//this page should allow for:
//logout
//view account details (only doing oath so cant change the details)
//view and load saved questionaires

interface AccountPopupProps{
    closePopup: any;
}
const AccountPopup: React.FunctionComponent<AccountPopupProps>=({closePopup}) =>{
    
return (
<div >

    <div>Account info here</div>
    <button>Logout</button>
    <h3>Saved Questionaire's</h3>
    <div>All saved questionaires...</div>
</div>
);
}

export default AccountPopup;