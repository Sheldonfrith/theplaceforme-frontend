import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import Header from './Header';
import LargePopup from './reusable/LargePopup';
import styled from 'styled-components';
import { logout, auth} from './App';
import { useAuthState } from "react-firebase-hooks/auth";
// import {StyledContext} from './containers/StyledProvider';
import {PopupInner, TransparentButton, FilledButton, H3,VerticalFlexBox, H1} from './ReusableStyles';

const PopupInnerContainer = styled.div`${PopupInner}`;
const LogoutButton = styled.button`
${FilledButton}
`;
const Subtitle = styled.h3`${H3}`;
const AccountInfo = styled.div`
${VerticalFlexBox}
align-items: flex-start;
`;

const Title = styled.div`${H1}`;
const InfoText = styled.div`font-size:200%;`;
//this page should allow for:
//logout
//view account details (only doing oath so cant change the details)
//view and load saved questionaires

interface AccountPopupProps{
    closePopup: any,
}
const AccountPopup: React.FunctionComponent<AccountPopupProps>=({closePopup}) =>{


// const sc = useContext(StyledContext);
// const PopupInner = sc.PopupInner;
// const TransparentButton = sc.TransparentButton;
// const H3 = sc.H3;
// const AccountInfo = styled(sc.VerticalFlexBox)`
// 
// `;
const [user, loading, error] = useAuthState(auth());
const savedQuestionaires = null; //TODO implement this feature
if (user) { return (
<PopupInnerContainer>
    <Title>Account</Title>
    <AccountInfo>
        {user.displayName?<InfoText><b>Display Name:</b> {user.displayName}</InfoText>:<></>}
        {user.email?<InfoText><b>Email:</b> {user.email}</InfoText>:<></>}
        {/* {user.providerId?<InfoText><b>Provider:</b> {user.providerId}</InfoText>:<></>} */}
    </AccountInfo>
    <LogoutButton onClick={()=>logout()}>Logout</LogoutButton>
    <Subtitle>Saved Questionaires</Subtitle>
    {/* {savedQuestionaires?
    <VerticalFlexBox>
        {savedQuestionaires.map((save)=>{
            return (
                <HorizontalFlexBox>
                    {save.name}
                    <TransparentButton>
                        LOAD
                    </TransparentButton>
                </HorizontalFlexBox>
            );
        })}
    </VerticalFlexBox>
    :<></>} */}
</PopupInnerContainer>
);
} else {
    return <></>;
}

}

export default AccountPopup;