import React, { useState, useContext, useCallback, useEffect } from 'react';
import styled, { Keyframes, keyframes, ThemeContext } from 'styled-components';
import { GlobalContext } from '../containers/GlobalProvider';
import { CategoriesContext, Category, Categories } from '../containers/CategoriesProvider';
import { DatasetsContext, Dataset } from '../containers/DatasetsProvider';
import { slideInLeft, slideInRight, slideOutLeft, slideOutRight, TransparentButton, H3, VerticalFlexBox, HorizontalFlexBox } from '../../reusable-styles';
import { useConditionalEffect, usePrevious } from '../../hooks';
import { AnswersContext, Answers, QuestionInput } from "../containers/AnswersProvider";

//define types here
interface QuestionaireLogicContextProps {
    currentCategoryIndex: number | null,
    setCurrentCategoryIndex: (...args: any[]) => void,
    nextCategory: (...args: any[]) => void,
    prevCategory: (...args: any[]) => void,
    currentDataset: Dataset | null,
    getAnswersIndexFromID: (id: number, thisAnswers: Answers) => number,
    zeroWeight: boolean,
    setZeroWeight: (...args: any[]) => void,
    questionAnimation: Keyframes,
    prevQuestion: (... args: any[]) => void,
    nextQuestion: (... args: any[]) => void,
    finishQuestionaire: (... args: any[]) => void,
}

//initialize state structure here
export const QuestionaireLogicContext = React.createContext<Partial<QuestionaireLogicContextProps>>({});


const QuestionaireLogicProvider: React.FunctionComponent = ({ children }) => {
    //events this context needs to handle>
    /**
     * initializing states
     * current categories (since these are shared across multiple child components)
     * Current questions and transitions between (since these are also shared across multiple child components)
     * Zero Weight to disable certain fields
     * 
     */
    const gc = useContext(GlobalContext);
    const cc = useContext(CategoriesContext);
    const dc = useContext(DatasetsContext);
    const datasets = dc.datasets;
    const categories = cc.categories;
    const getCategoryNameByIndex = cc.getCategoryNameByIndex;
    const getCategoryFieldByIndex = cc.getCategoryFieldByIndex;
    const theme = useContext(ThemeContext);
    const ac = useContext(AnswersContext);
    const currentAnswers = ac.currentAnswers;
    const setCurrentAnswers = ac.setCurrentAnswers;
    // const [prevCategoryIndex, setPrevCategoryIndex] = useState<number>(0);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number | null>(null);
    // const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);//dataset id
    const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
    const [zeroWeight, setZeroWeight] = useState<boolean>(true);
    const [questionAnimation, setQuestionAnimation] = useState<Keyframes>(slideInRight({}));
    const prevIndex = usePrevious(currentCategoryIndex) ?? 0;

    //Use Effects and their helper methods
    const getAnswersIndexFromID = ac.getAnswersIndexFromID!;
    

    //initialize the first category[0]
    useConditionalEffect([categories], (): void => {
        if (!categories) return;
        setCurrentCategoryIndex(0);
    });

    //category changes
    const nextCategoryIsToTheRight = (prevIndex: number, currIndex: number) => (prevIndex < currIndex);
    const getProperAnimation = (inOrOut: 'in' | 'out'): Keyframes => {
        if (nextCategoryIsToTheRight(prevIndex, currentCategoryIndex ?? 1)) {
            return inOrOut === 'out' ? slideOutLeft({}) : slideInRight({});
        } else {
            return inOrOut === 'out' ? slideOutRight({}) : slideInLeft({});
        }
    }
    //whenever the category changes set the current question to the first dataset+ in that category
    useConditionalEffect([currentCategoryIndex], () => {
        if (!datasets || !categories || !getCategoryNameByIndex || currentCategoryIndex === null) return;
        const removePreviousQuestionContainer = async () => {
            setQuestionAnimation(getProperAnimation('out'));
        }
        const addNewQuestionContainer = () => {
            if (currentQuestionIndex === 0) {
                const currentCategoryDatasets = getCategoryFieldByIndex!(currentCategoryIndex, 'datasets') as string[];
                const newDatasetID = currentCategoryDatasets[currentQuestionIndex];
                setCurrentDataset(datasets[newDatasetID]);
            }
            setCurrentQuestionIndex(0);
            setQuestionAnimation(getProperAnimation('in'));
        }
        //set current question to first dataset in that category
        removePreviousQuestionContainer();
        //wait 50 milliseconds, for removal animation to finish, before doing any more
        setTimeout(() => addNewQuestionContainer(), 50);
    });

    //whenever the current question index changes, update the current dataset
    useConditionalEffect([currentQuestionIndex], (): void => {
        if (currentQuestionIndex === null || !datasets || !categories) return;
        const getDatasetIDFromQuestionIndexAndCategory = (questionIndex: number, categoryIndex: number) =>{
            const categoryName: string = getCategoryNameByIndex!(categoryIndex)!;
            return categories[categoryName].datasets[questionIndex];
        }
        const newDatasetID = getDatasetIDFromQuestionIndexAndCategory(currentQuestionIndex, currentCategoryIndex??0);
        setCurrentDataset(datasets[newDatasetID]);
    });

    //whenever the current dataset, or answers changes update the zeroWeight boolean and localStorage value
    useConditionalEffect([currentDataset, currentAnswers], () => {
        if (!currentAnswers || currentDataset == null) return;
        const weight = currentAnswers[getAnswersIndexFromID(currentDataset.id, currentAnswers)].weight;
        console.log(currentDataset.id, currentAnswers[getAnswersIndexFromID(currentDataset.id, currentAnswers)]);
        console.log('weigth.. ', weight, currentDataset);
        if (weight == 0) {
            setZeroWeight(true);
        } else {
            setZeroWeight(false);
        }
    })


    //!methods
    const finishQuestionaire = ()=>{
        if (window.confirm('Are you sure you are done with the questionaire?')){
            gc.setCurrentPage('results');
        }
    }
    const prevCategory = useCallback((): void => {
        if (currentCategoryIndex === null) return;
        if (currentCategoryIndex < 1) return;
        setCurrentCategoryIndex(prev => prev!-1);
    }, [currentCategoryIndex, setCurrentCategoryIndex]);
    
    const nextCategory = useCallback((): void => {
        if (currentCategoryIndex === null || !categories) return;
        const isLastCategory = (currentCategoryIndex >= Object.keys(categories).length - 1);
        if  (isLastCategory) {finishQuestionaire();} else {setCurrentCategoryIndex(prev => prev! +1);}
    }, [currentCategoryIndex, finishQuestionaire, setCurrentCategoryIndex, categories]);

    const prevQuestion = useCallback((): void => {
        if (currentQuestionIndex === null) return;
        if (currentQuestionIndex <= 0) {prevCategory()} else {
            setQuestionAnimation(slideOutRight);
            setTimeout(() => {
                setQuestionAnimation(slideInLeft);
                setCurrentQuestionIndex(prev => prev! - 1);//set the next question with correct animation type on it
            }, 100);
        }
    }, [currentQuestionIndex, prevCategory, setCurrentQuestionIndex, setQuestionAnimation]);

    const nextQuestion = useCallback((): void => {
        if (currentQuestionIndex === null || !categories || currentCategoryIndex===null) return;
        const isLastQuestionInCategory = (currentQuestionIndex >= categories[getCategoryNameByIndex!(currentCategoryIndex)!].datasets.length - 1);
        if (isLastQuestionInCategory) {nextCategory();} else {
            setQuestionAnimation(slideOutLeft);
            setTimeout(() => {
                setQuestionAnimation(slideInRight);
                setCurrentQuestionIndex(prev => prev! + 1);
            }, 100);
        }
    }, [currentQuestionIndex, getCategoryNameByIndex, categories, setQuestionAnimation, nextCategory, setCurrentQuestionIndex, currentCategoryIndex]);

    return (
        <QuestionaireLogicContext.Provider
            value={{
                currentCategoryIndex: currentCategoryIndex,
                setCurrentCategoryIndex: setCurrentCategoryIndex,
                prevCategory: prevCategory,
                nextCategory: nextCategory,
                currentDataset: currentDataset,
                getAnswersIndexFromID: getAnswersIndexFromID,
                zeroWeight: zeroWeight,
                setZeroWeight: setZeroWeight,
                questionAnimation: questionAnimation,
                prevQuestion: prevQuestion,
                nextQuestion: nextQuestion,
                finishQuestionaire: finishQuestionaire,
            }}
        >
            {children}
        </QuestionaireLogicContext.Provider>
    );
}
export default QuestionaireLogicProvider;
