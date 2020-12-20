import React, {useState, useCallback} from 'react';
import {ThemeProvider} from 'styled-components';
import {getTheme} from '../../ui-constants';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../App";
import {useMachine} from '@xstate/react';
import {AppMachine} from '../../core/state-machines/App/machine';

const theme = getTheme();
//define our types outside the component so they can be used by both the context and provider components

type CurrentPageType = 'welcome'|'questionaire'|'results';
type CurrentPopupType = 'account'|'login'|'countryBreakdown'|'changeDefaults'|'saveQuestionaire';


//define the types for the GlobalContext component here
interface GlobalContextProps {
   
    currentPage: CurrentPageType | null,
    currentPopup: CurrentPopupType | null,
    setCurrentPage: any,
    setCurrentPopup: any,
    user: any,
    state: any,
    send: any,
}
//create the context here
export const GlobalContext = React.createContext<Partial<GlobalContextProps>>({});

const GlobalProvider: React.FunctionComponent =({children}) =>{
    const [user,loading,error] = useAuthState(auth());
    const [state, send] = useMachine(AppMachine);
    const [currentPage, setCurrentPage] = useState<CurrentPageType|null>('welcome');
    const [currentPopup, setCurrentPopup] = useState<CurrentPopupType|null>(null);
   
    return (
        <GlobalContext.Provider value={{
            currentPage: currentPage,
            setCurrentPage: setCurrentPage,
            currentPopup: currentPopup,
            setCurrentPopup: setCurrentPopup,
            user: user,
            state: state,
            send: send,
            }}>
            <ThemeProvider theme={theme}>
            {children}
            </ThemeProvider>
        </GlobalContext.Provider>
    );
}
export default GlobalProvider;