import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import Header from '../Header';
import styled, {css, keyframes, ThemeContext} from 'styled-components';
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
import getCategoryColor from '../../lib/UI-Constants/categoryColors';
import getAllFormDataStorageLocation from '../../lib/APP-Constants/localStorage';
import {TransparentButton, H3, VerticalFlexBox} from '../ReusableStyles';
import {Ring} from 'react-spinners-css';
import DatasetNotes from './DatasetNotes';

const slideOutLeft = keyframes`
    0% {
        left: 0;
        right: 0;
    }
    100% {
        left: -1000px;
        right: 1000px;
    }
`;
const slideOutRight = keyframes`
    0% {
        left: 0;
        right: 0;
    }
    100% {
        left: 1000px;
        right: -1000px;
    }
`;
const slideInLeft = keyframes`
    0% {
        left: -1000px;
        right: 1000px;
    }
    100% {
        left: 0;
        right: 0;
    }
`;
const slideInRight = keyframes`
    0% {
        left: 1000px;
        right: -1000px;
    }
    100% {
        left: 0;
        right: 0;
    }
`;
const QuestionText = styled.h3`
    font-size: ${props=>props.theme.font4};
    font-family: ${props=>props.theme.fontFamHeader};
    padding: 0 3rem;
`;

const BottomButtonContainer = styled.div`
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    padding: 1rem;
    margin: 1rem;
`;
const BottomButton = styled.button`
   ${TransparentButton}
   font-family: ${props=>props.theme.fontFamHeader};
`;
const AdvancedOptionsTitle = styled.h4`
    ${H3};
    margin: 1rem;
    font-family: ${props=>props.theme.fontFamHeader};
`;
const LoadingContainer = styled.div`
    ${VerticalFlexBox};
    width: 100%;
    height: 100%;
`;

interface QuestionairePageProps {
    setbgTrio: any
}

let prevCategoryIndex = 0; //used for detecting which way slide animations should move

const QuestionairePage :React.FunctionComponent<QuestionairePageProps> = ({setbgTrio}) =>{

    //! states
    const gc = useContext(GlobalContext);
    const theme = useContext(ThemeContext);
    interface QuestionInput{
        id: string,
        category: string,
        weight: number,
        idealValue: number,
        customScoreFunction: null ,
        missingDataHandlerMethod: string,
        missingDataHandlerInput: number | null,
        normalizationPercentage: number,
    }
    type FormData = Array<QuestionInput>
    const [allFormData, setAllFormData] =useState<FormData|null>(null);

    const getFormDataIndexFromID = useCallback((id: string): number=>{
        if (!allFormData || allFormData instanceof FormData) throw new Error('cant find index, allFormData not initialized yet or not correct type... '+allFormData);
        let i: number =0;
        const found = allFormData.some((element,index) => {i = index; return element.id == id;});
        if (!found)throw new Error('error could not find form index for the given id: '+id);
        return i;

    },[allFormData]);
    const [currentCategory, setCurrentCategory] = useState<string|null>(null);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number|null>(null);
    const [currentQuestion, setCurrentQuestion] =useState<string|null>(null);//dataset id
    const [currentDataset, setCurrentDataset] = useState<Dataset|null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number|null>(null);
    const [zeroWeight, setZeroWeight]= useState<boolean>(true);
    const [questionAnimation, setQuestionAnimation] = useState<any>(`slideInRight`);
    const [categoryChangeQueu, setCategoryChangeQueu] = useState<number>(0); //hack for sending info down to the category swiper
    const getBottomButtonText = (): string[] =>{
        //based on media query make bottom buttons either <> or prev/next
        var width = window.matchMedia(`(max-width: ${theme.primaryBreakpoint}px)`);
        if (width.matches){
            return ['<', '>'];
        } else {
            return ['Previous', 'Next'];
        }
    }
    const [bottomButtonText, setBottomButtonText]= useState<string[]>(getBottomButtonText());//[0] is back button, [1] is forward button


    //!USE EFFECTS
    //initialize the form data
    useMyEffect([gc.datasets],()=>{
        if (!gc.datasets || allFormData) return;
        //check if form data already exists in local storage
        const localVersion = localStorage.getItem(getAllFormDataStorageLocation());
        if (localVersion) {
            console.log('getting formdata from local storage, not initializing');
            //local storage already has a version of form data, use that instead
            //TODO validate the local storage form data to make sure it is not corrupted
            setAllFormData(JSON.parse(localVersion));
            return;
        }
        //no local storage, proceed
        console.log('no local storage formdata available, initializing');
        const newFormObject: FormData = Object.keys(gc.datasets).map((datasetID: string): QuestionInput =>{
            const thisDataset = gc.datasets![datasetID];
            const max = thisDataset.max_value;
            const min = thisDataset.min_value;
            return {
                id: datasetID,
                category: thisDataset.category,
                weight: gc.defaultWeight!,
                idealValue: (max && min)?(max+(0.5*(min-max))):0,
                customScoreFunction: null,
                missingDataHandlerMethod: gc.defaultMissingDataHandlerMethod!,
                missingDataHandlerInput: gc.defaultMissingDataHandlerInput!,
                normalizationPercentage: gc.defaultNormalizationPercentage!,
            };
        });
        console.log('setting new formdata object',newFormObject);
        setAllFormData(newFormObject);
    },[gc.datasets, setAllFormData]);

    //initialize the first category
    useMyEffect([gc.categories],():void=>{
        if (!gc.categories || !gc.getCategoryByIndex) return;
        const firstCategory: string|null = gc.getCategoryByIndex(0);
        if (!firstCategory) return;
        setCurrentCategory(firstCategory);//set to the first category found
        setCurrentCategoryIndex(0);
        console.log('initialized currentCategory', firstCategory);
    },[gc.categories, gc.getCategoryByIndex, setCurrentCategory]);

    

    //whenever the category index changes
    //update the category
    useMyEffect([currentCategoryIndex],()=>{
        if(!gc.getCategoryByIndex || currentCategoryIndex===null ) return;
        setCurrentCategory(gc.getCategoryByIndex(currentCategoryIndex));
    },[currentCategoryIndex])

    //whenever the category changes set the current question to the first question in that category
    // and update the backgroundcolors
    useMyEffect([currentCategory],()=>{
        if (!currentCategory|| !gc.categories || !gc.getCategoryByIndex || currentCategoryIndex===null) return;
        //first make the existing question exit the screen 
        //detect whether the current category is before or after the previous category
        let slideFromRight: boolean = (prevCategoryIndex>currentCategoryIndex)?false:true;
        setQuestionAnimation(slideFromRight?slideOutLeft:slideOutRight);
        //wait for the animation to finish before doing the rest
        setTimeout(()=>{
            setQuestionAnimation(slideFromRight?slideInRight:slideInLeft);
            //if the current question index is zero our next useeffect to update the question
            //will not trigger because there will be no change to current question index
            //so must mannually trigger here
            if (currentQuestionIndex===0){
                if (!gc.datasets) return;
                const newQuestion =gc.categories![currentCategory].datasets[currentQuestionIndex];
                const newDataset = gc.datasets[newQuestion];
                setCurrentQuestion(newQuestion);
                setCurrentDataset(newDataset);
            }

            setCurrentQuestionIndex(0);
            
            console.log('current cat changed...', currentCategory);
        },50);
        //set the colors immediately so the transition looks smoother
        const currentCatIndex = gc.categories![currentCategory].index;
            setbgTrio([
                getCategoryColor(gc.getCategoryByIndex!(currentCatIndex-1)||'demographics'),
                getCategoryColor(currentCategory),
                getCategoryColor(gc.getCategoryByIndex!(currentCatIndex+1)||'demographics')

            ]);
        prevCategoryIndex = currentCategoryIndex;
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

    //whenever the current dataset, or formdata changes update the zeroWeight boolean and localStorage value
    useMyEffect([true],()=>{
        console.log('waiting for condition');
        if (!allFormData || currentDataset==null) return;
        const weight =allFormData[getFormDataIndexFromID(currentDataset.id)].weight;
        console.log('updating zeroWeight boolean', weight);
        if (weight == 0){
            setZeroWeight(true);
        } else {
            setZeroWeight(false);
        }
    },[currentDataset,allFormData, setZeroWeight, getFormDataIndexFromID])

    //whenever the formdata changes, update the localstorage value
    useMyEffect([true],()=>{
        if (!allFormData) return;
        console.log('saving to local storage', getAllFormDataStorageLocation(), allFormData);
        localStorage.setItem(getAllFormDataStorageLocation(),JSON.stringify(allFormData));
    },[allFormData])

    //!methods
    
    //actual reset form data method
    const resetFormData = useCallback(()=>{
        //first make sure the user wants to do this 
        const shouldReset = window.confirm('Are you sure you want to reset all answers to all questions?');
        console.log('reset info', shouldReset, gc.datasets);
        if (!shouldReset) return;
        if (!gc.datasets) return;
        console.log('initializing form data reset');
        const newFormObject: FormData = Object.keys(gc.datasets).map((datasetID: string): QuestionInput =>{
            const thisDataset = gc.datasets![datasetID];
            const max = thisDataset.max_value;
            const min = thisDataset.min_value;
            return {
                id: datasetID,
                category: thisDataset.category,
                weight: gc.defaultWeight!,
                idealValue: (max && min)?(max+(0.5*(min-max))):0,
                customScoreFunction: null,
                missingDataHandlerMethod: gc.defaultMissingDataHandlerMethod!,
                missingDataHandlerInput: gc.defaultMissingDataHandlerInput!,
                normalizationPercentage: gc.defaultNormalizationPercentage!,
            };
        });
        console.log('resetting all form data and clearing local storage', newFormObject, getAllFormDataStorageLocation());
        setAllFormData(newFormObject);
        //now clear local storage
        localStorage.removeItem(getAllFormDataStorageLocation());
    },[ setAllFormData, gc.datasets, gc.defaultMissingDataHandlerInput, gc.defaultMissingDataHandlerMethod, gc.defaultNormalizationPercentage, gc.defaultWeight]);
    //used by components in separate scope to tell the questionaire to reset via the global context
    useMyEffect([gc.shouldResetFormData],()=>{
        if (!gc.shouldResetFormData) return;
        resetFormData();
        gc.setShouldResetFormData(false);
    },[gc.shouldResetFormData, gc.setShouldResetFormData, resetFormData]);

    
    const prevCategory =useCallback( ():void =>{
        if (currentCategoryIndex === null) return;
        //if at first category do nothing
        if (currentCategoryIndex<1) return;
        //otherwise move back
        console.log('setting category change queu -1',currentCategoryIndex);
        setCategoryChangeQueu(-1);
    },[currentCategoryIndex, setCategoryChangeQueu]);

    const nextCategory =useCallback( ():void =>{
        if (currentCategoryIndex === null || !gc.categories) return;
        //if at last category go to results page
        if (currentCategoryIndex>=Object.keys(gc.categories).length-1) {
            getResults();
            gc.setCurrentPage('results');
            return;
        }
        //otherwise move forward
        console.log('setting category change queu 1', currentCategoryIndex);
        setCategoryChangeQueu(1);
    },[currentCategoryIndex, gc, setCategoryChangeQueu]);

    const prevQuestion =useCallback( ():void =>{
        if (currentQuestionIndex === null) return;
        //if at first question go to previous category
        if (currentQuestionIndex <= 0) {
            prevCategory();
            return;
        }
        //otherwise move back a question
        //animate exit of current question
        setQuestionAnimation(slideOutRight);
        setTimeout(()=>{
            setQuestionAnimation(slideInLeft);
            setCurrentQuestionIndex(prev => prev!-1);//set the next question with correct animation type on it
        },100);
    },[currentQuestionIndex, prevCategory, setCurrentQuestionIndex, setQuestionAnimation]);

    const nextQuestion = useCallback(():void=>{
        if (currentQuestionIndex ===null || !gc.categories || !currentCategory) return;
         //if at last question go to next category
         if (currentQuestionIndex>=gc.categories[currentCategory].datasets.length-1){
            nextCategory();
            return;
         }
         //otherwise move forward one question
         setQuestionAnimation(slideOutLeft);
         setTimeout(()=>{
            setQuestionAnimation(slideInRight);
            setCurrentQuestionIndex(prev => prev!+1);
         },100)
    },[currentQuestionIndex, gc.categories, setQuestionAnimation, nextCategory, setCurrentQuestionIndex, currentCategory]);

    //!submit form to api
    const getResults = useCallback(async ()=>{
        //validate the form data object
        gc.setCurrentPage('results');

        console.log('sending this to /scores ',allFormData);
        const results = await postRequest('/scores',allFormData);
        gc.setResults(results);
    },[allFormData, gc, gc.setCurrentPage, gc.setResults]);

//! RENDER
return (
<>
    <Header resetHandler={resetFormData}/>
    <CategorySwiper
    prevCategory={prevCategory}
    nextCategory={nextCategory}
    currentCategory={currentCategory}
    currentCategoryIndex={currentCategoryIndex||0}
    setCurrentCategoryIndex={setCurrentCategoryIndex}
    categoryChangeQueu={categoryChangeQueu}
    setCategoryChangeQueu={setCategoryChangeQueu}
    />
    <QuestionSwiper 
        prevQuestion={prevQuestion}
        nextQuestion={nextQuestion}
        backgroundColor={currentCategory?getCategoryColor(currentCategory):theme.primaryGradient}
        >
        {(currentDataset && currentDataset.id && allFormData)?
            <QuestionContainer animation={questionAnimation}>
                <QuestionText>What <b>{currentDataset.long_name}</b> would you like your country to have?
                </QuestionText>
                <IdealValuePicker
                disabled={zeroWeight}
                dataset={currentDataset}
                updateIdealValue={(e: any, notEvent?: boolean)=>{
                    const newVal: number = notEvent?e:e.target.value;
                    setAllFormData((prev: any)=>{
                        const newObj = [...prev];
                        const thisIndex = getFormDataIndexFromID(currentDataset.id)
                        if (thisIndex >=0){
                            newObj[thisIndex].idealValue = newVal;
                        }
                        return newObj;
                    })
                }}
                idealValue={allFormData[getFormDataIndexFromID(currentDataset.id)].idealValue}/>
                <WeightPicker
                updateWeight={(e: any, notEvent?: boolean)=>{
                    const newVal: number = parseInt(notEvent?e: e.target.value);
                    //convert the newVal to an integer

                    setAllFormData((prev: any)=>{
                        const newObj = [...prev];
                        const thisIndex = getFormDataIndexFromID(currentDataset.id)
                        if (thisIndex >=0){
                            newObj[thisIndex].weight = newVal;
                        }
                        return newObj;
                    })
                }}
                weight={allFormData[getFormDataIndexFromID(currentDataset.id!)].weight||0}
                />
                <AdvancedOptionsTitle>Advanced Options</AdvancedOptionsTitle>
                <MissingDataHandlerPicker
                disabled={zeroWeight}
                />
                <NormalizationPicker
                disabled={zeroWeight}
                updateNormalization={(e: any, notEvent?:boolean)=>{
                    const newVal: number = notEvent?e:e.target.value;
                    setAllFormData((prev: any)=>{
                        const newObj = [...prev];
                        const thisIndex = getFormDataIndexFromID(currentDataset.id!)
                        if (thisIndex >=0){
                            newObj[thisIndex].normalizationPercentage = newVal;
                        }
                        return newObj;
                    });
                }}
                normalization={allFormData[getFormDataIndexFromID(currentDataset.id!)].normalizationPercentage||0}
                />
                {/* {(!currentDataset.source_link && !currentDataset.source_description && !currentDataset.notes)? */}
                <DatasetNotes 
                text={
                    'Data Source: '+currentDataset.source_link || 
                    'Data Source: '+ currentDataset.source_description || 
                    'Notes For This Dataset: '+currentDataset.notes || 
                    'Nothing to display.'}
                />
                {/* :<></>} */}
            </QuestionContainer>
        :<LoadingContainer><Ring color={theme.white} size={80}/></LoadingContainer>}
    </QuestionSwiper>
    <BottomButtonContainer>
        <BottomButton onClick={(e)=>prevQuestion()}>{bottomButtonText[0]}</BottomButton>
        <BottomButton onClick={(e)=>nextQuestion()}>{bottomButtonText[1]}</BottomButton>
        <BottomButton onClick={(e)=>getResults()}>Submit Now</BottomButton>
    </BottomButtonContainer>
</>
);
}

export default QuestionairePage;