import React, {useState, useEffect, useContext, useCallback} from 'react';
import Header from '../Header';
import styled from 'styled-components';
import CategorySwiper from './CategorySwiper';
import IdealValuePicker from './IdealValuePicker';
import NormalizationPicker from './NormalizationPicker';
import QuestionContainer from './QuestionContainer';
import QuestionSwiper from './QuestionSwiper';
import WeightPicker from './WeightPicker';
import MissingDataHandlerPicker from './MissingDataHandlerPicker';
import { GlobalContext, Dataset } from '../containers/GlobalProvider';
import useMyEffect from '../../lib/Hooks/useMyEffect';
import {postRequest} from '../../lib/HTTP';


const BottomButtonContainer = styled.div`
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

interface QuestionairePageProps {
    
}

const QuestionairePage :React.FunctionComponent<QuestionairePageProps> = ({}) =>{

    //! states
    const gc = useContext(GlobalContext);

    interface QuestionInput{
        id: number,
        weight: number,
        idealValue: number,
        customScoreFunction: null ,
        missingDataHandlerMethod: string,
        missingDataHandlerInput: number | null,
        normalizationPercentage: number,
    }
    interface FormData extends Array<QuestionInput>{}
    const [allFormData, setAllFormData] =useState<FormData|null>(null);

    const [currentCategory, setCurrentCategory] = useState<string|null>(null);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number|null>(null);
    const [currentQuestion, setCurrentQuestion] =useState<string|null>(null);//dataset id
    const [currentDataset, setCurrentDataset] = useState<Dataset|null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number|null>(null);

    //!USE EFFECTS
    //initialize the first category
    useMyEffect([gc.categories],():void=>{
        if (!gc.categories || !gc.getCategoryByIndex) return;
        const firstCategory: string|null = gc.getCategoryByIndex(0);
        if (!firstCategory) return;
        setCurrentCategory(firstCategory);//set to the first category found
        console.log('initialized currentCategory', firstCategory);
    },[gc.categories, gc.getCategoryByIndex, setCurrentCategory]);

    //whenever the category changes set the current question to the first question in that category, and update the index
    useMyEffect([currentCategory],():void=>{
        if (!currentCategory|| !gc.categories) return;
        setCurrentQuestionIndex(0);
        setCurrentCategoryIndex(gc.categories[currentCategory].index);
        console.log('current cat changed...', currentCategory);
    },[currentCategory, gc.categories, setCurrentQuestion, setCurrentCategoryIndex]);

    //whenever the current question index changes, update the current question and current dataset
    useMyEffect([currentQuestionIndex],():void=>{
        console.log(currentQuestionIndex);
        if (currentQuestionIndex===null || !gc.datasets|| !gc.categories || !currentCategory) return;
        console.log('got past conditions?');
        const newQuestion =gc.categories[currentCategory].datasets[currentQuestionIndex]; 
        const newDataset = gc.datasets[newQuestion];
        console.log('updating current question and dataset', newQuestion, newDataset);
        setCurrentQuestion(newQuestion);
        setCurrentDataset(newDataset);
    },[currentQuestionIndex, currentCategory, setCurrentQuestion, gc.categories, gc.datasets, setCurrentDataset]);

    //!methods

    const prevCategory =useCallback( ():void =>{
        if (currentCategoryIndex === null || !gc.getCategoryByIndex) return;
        //if at first category do nothing
        if (currentCategoryIndex<1) return;
        //otherwise move back
        setCurrentCategory(gc.getCategoryByIndex(currentCategoryIndex-1));
    },[currentCategoryIndex,setCurrentCategory, gc.getCategoryByIndex]);

    const nextCategory =useCallback( ():void =>{
        if (currentCategoryIndex === null || !gc.categories || !gc.getCategoryByIndex) return;
        //if at last category go to results page
        if (currentCategoryIndex>=Object.keys(gc.categories).length-1) gc.setCurrentPage('results');
        //otherwise move forward
        setCurrentCategory(gc.getCategoryByIndex(currentCategoryIndex+1));
    },[currentCategoryIndex,setCurrentCategory, gc.getCategoryByIndex]);

    const prevQuestion =useCallback( ():void =>{
        if (currentQuestionIndex === null) return;
        //if at first question go to previous category
        if (currentQuestionIndex <= 0) prevCategory();
        //otherwise move back a question
        setCurrentQuestionIndex(prev => prev!-1);
    },[currentQuestionIndex, prevCategory, setCurrentQuestionIndex]);

    const nextQuestion = useCallback(():void=>{
        if (currentQuestionIndex ===null || !gc.categories || !currentCategory) return;
         //if at last question go to next category
         if (currentQuestionIndex>=gc.categories[currentCategory].datasets.length-1) nextCategory();
         //otherwise move forward one question
         setCurrentQuestionIndex(prev => prev!+1);
    },[currentQuestionIndex, gc.categories, nextCategory, setCurrentQuestionIndex]);

    //!submit form to api
    const getResults = useCallback(async ()=>{
        const results = await postRequest('/scores',allFormData);
        gc.setResults(results);
        gc.setCurrentPage('results');
    },[allFormData, gc.setCurrentPage, postRequest]);

//! RENDER
return (
<>
    <Header/>
    <CategorySwiper setCurrentCategory={setCurrentCategory} currentCategory={currentCategory}/>
    <QuestionSwiper setCurrentQuestion={setCurrentQuestion} currentQuestion={currentQuestion}>
        {currentDataset?
            <QuestionContainer >
                <h3>What {currentDataset.long_name} would you like your country to have?</h3>
                <IdealValuePicker dataset={currentDataset}/>
                <WeightPicker/>
                <h2>Advanced Options</h2>
                <MissingDataHandlerPicker/>
                <NormalizationPicker/>
            </QuestionContainer>
        :<div>... loading next question</div>}
    </QuestionSwiper>
    <BottomButtonContainer>
        <button onClick={(e)=>prevQuestion()}> prev </button>
        <button onClick={(e)=>nextQuestion()}> next </button>
        <button onClick={(e)=>getResults()}>Submit Now</button>
    </BottomButtonContainer>
</>
);
}

export default QuestionairePage;