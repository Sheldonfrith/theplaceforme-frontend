import React, {useState, useContext, useCallback, useEffect} from 'react';
import Header from '../Header';
import CategorySwiper from './CategorySwiper';
import QuestionSwiper from './QuestionSwiper';
import QuestionaireLogicProvider from './QuestionaireLogicProvider';
import BottomButtonArea from './BottomButtonArea';
interface QuestionairePageProps {
}


const QuestionairePage :React.FunctionComponent<QuestionairePageProps> = () =>{

return (
<>
    <QuestionaireLogicProvider>
        <Header />
        <CategorySwiper/>
        <QuestionSwiper />
        <BottomButtonArea/>
    </QuestionaireLogicProvider>
</>
);
}

export default QuestionairePage;