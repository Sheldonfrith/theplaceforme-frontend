
import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Container, Button} from 'react-bootstrap';

interface AccountPopupProps{
    currentUserDisplayInformation: {id: number, infoLabel: string, infoValue: string}[],
    logoutHandler: any,
}
const AccountPopup: React.FunctionComponent<AccountPopupProps> =({
    currentUserDisplayInformation, logoutHandler
})=> {

return (
<Container>
    {currentUserDisplayInformation.map(item=>(
        <React.Fragment key={item.id}>
        <header>{item.infoLabel}</header>
        <div>{item.infoValue}</div>
        </React.Fragment>
    ))}
    <Button onClick={()=>logoutHandler()}>Logout</Button>
</Container>
);
}
export default AccountPopup;
