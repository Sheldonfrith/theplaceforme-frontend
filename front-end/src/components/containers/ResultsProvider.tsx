import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AnswersContext, Answers } from './AnswersProvider';
import { GlobalContext } from './GlobalProvider';
import { APIContext } from "./APIProvider";
import { useConditionalEffect } from '../../hooks';
import {convertToJSON}from '../../lib/Utils';
interface CountryBreakdown {
    score: number,
    rank: number,
    percentile: number,
    dataWasMissing: boolean
}
interface ScoreBreakdown {
    [datasetID: string]: CountryBreakdown //number is score for that dataset
}
interface CategoryBreakdown {
    [category: string]: number // total score for that category
}
export interface CountryResult {
    primary_name: string,
    totalScore: number,
    rank: number,
    percentile: number,
    categoryBreakdown: CategoryBreakdown,
    scoreBreakdown: ScoreBreakdown,
}

export interface Results {
    [alpha_three_code: string]: CountryResult // keys are alpha three codes
}

//define types here
interface ResultsContextProps {
    setCurrentSelectedCountry: (...args: any[]) => void,
    currentSelectedCountry: string | null,
    results: Results | undefined,
    updateResults: (...args: any[]) => Promise<void>,
}

//initialize state structure here
export const ResultsContext = React.createContext<Partial<ResultsContextProps>>({});


const ResultsProvider: React.FunctionComponent = ({ children }) => {
    const api = useContext(APIContext);
    const requestWithValidation = api.requestWithValidation!;
    const gc = useContext(GlobalContext);
    const currentPage = gc.currentPage;
    const ac = useContext(AnswersContext);
    const [results, setResults] = useState<Results | undefined>(undefined);
    const [currentSelectedCountry, setCurrentSelectedCountry] = useState<string | null>(null); // used to show detailed results for each country, one at a time
    const [answersOnLastResultsRequest, setAnswersOnLastResultsRequest] = useState<Answers | null>(null);
    //whenever the currentPage is set to results, load the results , if the currentAnswers object has changed
    useConditionalEffect([currentPage], () => {
        if (currentPage !== 'results') return;
        const currentAnswersHasChanged = (JSON.stringify(ac.currentAnswers) !== JSON.stringify(answersOnLastResultsRequest));
        if (!currentAnswersHasChanged) return;
        updateResults();
    });
    const updateResults = async (): Promise<void> => {
        if (!ac.currentAnswers) return;
        setResults(await getResults(ac.currentAnswers));
        setAnswersOnLastResultsRequest(ac.currentAnswers);
    }
    const getResults = async (answers: Answers): Promise<Results> => {
        const response: Results = await requestWithValidation('POST', '/scores','Results', convertToJSON(answers)) as Results;
        return response;
    }

    return (
        <ResultsContext.Provider
            value={{
                updateResults: updateResults,
                results: results,
                currentSelectedCountry: currentSelectedCountry,
                setCurrentSelectedCountry: setCurrentSelectedCountry,
            }}
        >
            {children}
        </ResultsContext.Provider>
    );
}
export default ResultsProvider;