import React, {useContext} from 'react';
import styled from 'styled-components';
import { auth} from './App';
import { useAuthState } from "react-firebase-hooks/auth";
// import {StyledContext} from './containers/StyledProvider';
import {PopupInner, FilledButton, H3,VerticalFlexBox, HorizontalFlexBox, TransparentButton, H1} from '../reusable-styles';
import { AnswersContext, SavedQuestionaireMetadata } from "./containers/AnswersProvider";


const PopupInnerContainer = styled.div`${PopupInner}`;
const LogoutButton = styled.button`
${FilledButton}
`;
const Subtitle = styled.h3`${H3}`;
const AccountInfo = styled.div`
${VerticalFlexBox}
align-items: flex-start;
`;
const QuestionaireContainer = styled.div`
    ${HorizontalFlexBox};
    font-size: ${props=>props.theme.font4};
`;
const QuestionairesContainer = styled.div`
    ${VerticalFlexBox};
    overflow: auto;
    box-shadow: inset 0 2px 5px 1px black;
    padding: 0.5rem 2rem;
    background: ${props=>props.theme.whiteOverlay};

`;
const LoadButton = styled.button`
    ${FilledButton};
    font-size: ${props=>props.theme.font4};
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
const ac = useContext(AnswersContext);
const logout = ()=>null;//TODO

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
    {ac.savedQuestionaires?
    <QuestionairesContainer>
        {ac.savedQuestionaires.map((metadata: SavedQuestionaireMetadata)=>{
            // console.log(metadata);
            return (
                <QuestionaireContainer key={metadata.id}>
                    {metadata.name}
                    <LoadButton 
                        onClick={()=>{
                            ac.loadQuestionaire!(metadata.id);
                        }}
                    >
                        LOAD
                    </LoadButton>
                </QuestionaireContainer>
            );
        })}
    </QuestionairesContainer>
    :<></>}
</PopupInnerContainer>
);
} else {
    return <></>;
}

}

export default AccountPopup;