import React, {useState, useContext, useCallback, useEffect} from 'react';
import Header from '../Header';
import styled, { keyframes, ThemeContext} from 'styled-components';
import CategorySwiper from './CategorySwiper';
import IdealValuePicker from './IdealValuePicker';
import NormalizationPicker from './NormalizationPicker';
import QuestionContainer from './QuestionContainer';
import QuestionSwiper from './QuestionSwiper';
import WeightPicker from './WeightPicker';
import MissingDataHandlerPicker from './MissingDataHandlerPicker';
import { GlobalContext} from '../containers/GlobalProvider';
import {CategoriesContext, Category, Categories} from '../containers/CategoriesProvider';
import {DatasetsContext, Dataset} from '../containers/DatasetsProvider';
import {postRequest} from '../../lib/HTTP';
import {getColorByCategory} from '../../ui-constants';
import {getAllFormDataStorageLocation} from '../../app-constants';
import {Ring} from 'react-spinners-css';
import DatasetNotes from './DatasetNotes';
import {slideInLeft, slideInRight, slideOutLeft, slideOutRight, TransparentButton, H3, VerticalFlexBox, HorizontalFlexBox}from '../../reusable-styles';
import {useConditionalEffect} from '../../hooks';
import {convertToJSON} from '../../lib/Utils';
const QuestionText = styled.h3`
    font-size: ${props=>props.theme.font4};
    font-family: ${props=>props.theme.fontFamHeader};
    padding: 0 3rem;
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

export interface QuestionInput{
    id: string,
    category: string,
    weight: number,
    idealValue: number,
    customScoreFunction: null ,
    missingDataHandlerMethod: string,
    missingDataHandlerInput: number | null,
    normalizationPercentage: number,
};
export  type FormData = Array<QuestionInput>;

interface QuestionairePageProps {
}


const QuestionairePage :React.FunctionComponent<QuestionairePageProps> = () =>{

    //! states
    const gc = useContext(GlobalContext);
    const cc = useContext(CategoriesContext);
    const dc = useContext(DatasetsContext);
    const datasets = dc.datasets;
    const getCategoryNameByIndex: (index: number)=> string = cc.getCategoryNameByIndex;

    const categories = cc.categories;
    const theme = useContext(ThemeContext);
   const allFormData = gc.allFormData; 
   const setAllFormData = gc.setAllFormData;
    const [prevCategoryIndex, setPrevCategoryIndex] = useState<number>(0);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number|null>(null);
    const [currentQuestion, setCurrentQuestion] =useState<string|null>(null);//dataset id
    const [currentDataset, setCurrentDataset] = useState<Dataset|null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number|null>(null);
    const [zeroWeight, setZeroWeight]= useState<boolean>(true);
    const [questionAnimation, setQuestionAnimation] = useState<any>(`slideInRight`);
    const [categoryChangeQueu, setCategoryChangeQueu] = useState<number>(0); //hack for sending info down to the category swiper
    
    const getFormDataIndexFromID = useCallback((id: string, thisFormData: FormData): number=>{
        return thisFormData.findIndex(element => element.id == id);
    },[allFormData]);

    //initialize the first category[0]
    useConditionalEffect([categories],():void=>{
        if (!categories) return;
        setCurrentCategoryIndex(0);
    });
    

    //whenever the category changes set the current question to the first dataset+ in that category
    useConditionalEffect([currentCategory], ()=>{
        if (!currentCategory|| !categories || !getCategoryNameByIndex || currentCategoryIndex===null) return;
       
        const nextCategoryIsToTheRight: boolean = (prevCategoryIndex > currentCategoryIndex);
        const getProperOutAnimation = ()=> nextCategoryIsToTheRight?slideOutLeft:slideOutRight;
        const getProperInAnimation = ()=>nextCategoryIsToTheRight?slideInRight:slideInLeft;
        const removePreviousQuestionContainer = () =>{
            setQuestionAnimation(getProperOutAnimation());
        }
        const addNewQuestionContainer = ()=>{
            if (currentQuestionIndex===0){
                if (!datasets) return;
                const newQuestion =gc.categories![currentCategoryName].datasets[currentQuestionIndex];
                const newDataset = gc.datasets[newQuestion];
                setCurrentQuestion(newQuestion);
                setCurrentDataset(newDataset);
            }
            setCurrentQuestionIndex(0);

            setQuestionAnimation(getProperInAnimation());
        }
        //first make the existing question exit the screen 
        //detect whether the current category is before or after the previous category

        //wait for the animation to finish before doing the rest
        setTimeout(()=>{
            setQuestionAnimation(slideFromRight?slideInRight:slideInLeft);
            //if the current question index is zero our next useeffect to update the question
            //will not trigger because there will be no change to current question index
            //so must mannually trigger here
            
            // console.log('current cat changed...', currentCategory);
        },50);
        const BottomButtonArea = gc.categories![currentCategoryName].index;
        setPrevCategoryIndex(currentCategoryIndex);
    });

    //whenever the current question index changes, update the current question and current dataset
    useConditionalEffect([currentQuestionIndex],():void=>{
        // console.log(currentQuestionIndex);
        if (currentQuestionIndex===null || !gc.datasets|| !gc.categories || !currentCategoryName) return;
        // console.log('got past conditions?');
        const newQuestion =gc.categories[currentCategoryName].datasets[currentQuestionIndex];
        const newDataset = gc.datasets[newQuestion];
        // console.log('updating current question and dataset', newQuestion, newDataset);
        setCurrentQuestion(newQuestion);
        setCurrentDataset(newDataset);
    });

    //whenever the current dataset, or formdata changes update the zeroWeight boolean and localStorage value
    useConditionalEffect([currentDataset, allFormData],()=>{
        // console.log('waiting for condition');
        if (!allFormData || currentDataset==null) return;
        const weight =allFormData[getFormDataIndexFromID(currentDataset.id)].weight;
        // console.log('updating zeroWeight boolean', weight);
        if (weight == 0){
            setZeroWeight(true);
        } else {
            setZeroWeight(false);
        }
    })

    //whenever the formdata changes, update the localstorage value
    useEffect(()=>{
        if (!allFormData) return;
        // console.log('saving to local storage', getAllFormDataStorageLocation(), allFormData);
        localStorage.setItem(getAllFormDataStorageLocation(),JSON.stringify(allFormData));
    },[allFormData])

    //!methods
    
    //actual reset form data method
    const resetFormData = useCallback(()=>{
        //first make sure the user wants to do this 
        const shouldReset = window.confirm('Are you sure you want to reset all answers to all questions?');
        // console.log('reset info', shouldReset, gc.datasets);
        if (!shouldReset) return;
        if (!gc.datasets) return;
        // console.log('initializing form data reset');
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
        // console.log('resetting all form data and clearing local storage', newFormObject, getAllFormDataStorageLocation());
        setAllFormData(newFormObject);
        //now clear local storage
        localStorage.removeItem(getAllFormDataStorageLocation());
    },[ setAllFormData, gc.datasets, gc.defaultMissingDataHandlerInput, gc.defaultMissingDataHandlerMethod, gc.defaultNormalizationPercentage, gc.defaultWeight]);
    //used by components in separate scope to tell the questionaire to reset via the global context
    useConditionalEffect([gc.shouldResetFormData],()=>{
        if (!gc.shouldResetFormData) return;
        resetFormData();
        gc.setShouldResetFormData(false);
    });

    
    const prevCategory =useCallback( ():void =>{
        if (currentCategoryIndex === null) return;
        //if at first category do nothing
        if (currentCategoryIndex<1) return;
        //otherwise move back
        // console.log('setting category change queu -1',currentCategoryIndex);
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
        // console.log('setting category change queu 1', currentCategoryIndex);
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
        if (currentQuestionIndex ===null || !gc.categories || !currentCategoryName) return;
         //if at last question go to next category
         if (currentQuestionIndex>=gc.categories[currentCategoryName].datasets.length-1){
            nextCategory();
            return;
         }
         //otherwise move forward one question
         setQuestionAnimation(slideOutLeft);
         setTimeout(()=>{
            setQuestionAnimation(slideInRight);
            setCurrentQuestionIndex(prev => prev!+1);
         },100)
    },[currentQuestionIndex, gc.categories, setQuestionAnimation, nextCategory, setCurrentQuestionIndex, currentCategoryName]);

    //!submit form to api
    const getResults = useCallback(async ()=>{
        //validate the form data object
        gc.setCurrentPage('results');
        // console.log('sending this to /scores ',allFormData);
        const results = await postRequest('/scores', convertToJSON(allFormData));
        // console.log('received this from /scores ', results);    
        gc.setResults(results);
    },[allFormData, gc, gc.setCurrentPage, gc.setResults]);

//! RENDER
return (
<>
    <Header resetHandler={resetFormData}/>
    <CategorySwiper
    prevCategory={prevCategory}
    nextCategory={nextCategory}
    currentCategory={currentCategoryName}
    currentCategoryIndex={currentCategoryIndex||0}
    setCurrentCategoryIndex={setCurrentCategoryIndex}
    categoryChangeQueu={categoryChangeQueu}
    setCategoryChangeQueu={setCategoryChangeQueu}
    />
    <QuestionSwiper 
        prevQuestion={prevQuestion}
        nextQuestion={nextQuestion}
        backgroundColor={currentCategoryName?getColorByCategory(currentCategoryName):theme.primaryGradient}
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
                <DatasetNotes 
                text={
                    'Data Source: '+currentDataset.source_link || 
                    'Data Source: '+ currentDataset.source_description || 
                    'Notes For This Dataset: '+currentDataset.notes || 
                    'Nothing to display.'}
                />
            </QuestionContainer>
        :<LoadingContainer><Ring color={theme.white} size={80}/></LoadingContainer>}
    </QuestionSwiper>
    <BottomButtonArea/>
</>
);
}

export default QuestionairePage;