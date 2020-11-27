import React, { useState, useEffect, useCallback, useContext } from 'react';
import { CountriesContext } from './CountriesProvider';
import { GlobalContext } from './GlobalProvider';
import { DatasetsContext, Datasets } from "./DatasetsProvider";
import { MissingDataHandlerMethodsContext } from "./MissingDataHandlerMethodsProvider";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../App';
import { useConditionalEffect } from '../../hooks';
import { basicRequest } from "../../lib/HTTP";
import { Results } from "./ResultsProvider";
import { getAnswersStorageLocation } from "../../app-constants";
import { APIContext } from './APIProvider';

export interface QuestionInput {
    id: number,
    category: string,
    weight: number,
    idealValue: number,
    customScoreFunction: null,
    missingDataHandlerMethod: string,
    missingDataHandlerInput: number | null,
    normalizationPercentage: number,
};
export type Answers = Array<QuestionInput>;

export interface SavedQuestionaireMetadata {
    id: number,
    created_at: any,
    domain: string,
    name: string | null,
    description: string | null,
    user_id: string | null,
}
type SavedQuestionaires = Array<SavedQuestionaireMetadata>;
type LoadScoresInputResponse = [
    SavedQuestionaireMetadata,
    Answers,
    null | Results,
]
//define types here
interface AnswersContextProps {
    currentAnswers: Answers | null,
    setCurrentAnswers: (...args: any[]) => void,
    updateCurrentAnswers: (newVal: any, datasetIndex: number, fieldName: keyof QuestionInput) => void,
    savedQuestionaires: SavedQuestionaires | null,
    setDefaultWeight: (...args: any[]) => void,
    setDefaultMissingDataHandlerMethod: (...args: any[]) => void,
    setDefaultMissingDataHandlerInput: (...args: any[]) => void,
    setDefaultNormalizationPercentage: (...args: any[]) => void,
    defaultWeight: number,
    defaultMissingDataHandlerMethod: string,
    defaultMissingDataHandlerInput: number | null,
    defaultNormalizationPercentage: number,
    resetAnswers: (...args: any[]) => void,
    saveQuestionaire: (...args: any[]) => void,
    loadQuestionaire: (...args: any[]) => void,
    getAnswersIndexFromID: (id: number, thisAnswers: Answers)=> number,
}

//initialize state structure here
export const AnswersContext = React.createContext<Partial<AnswersContextProps>>({});

const AnswersProvider: React.FunctionComponent = ({ children }) => {
    const gc = useContext(GlobalContext);
    const dc = useContext(DatasetsContext);
    const mc = useContext(MissingDataHandlerMethodsContext);
    const cc = useContext(CountriesContext);
    const api = useContext(APIContext);
    const requestWithValidation = api.requestWithValidation!;
    const datasets = dc.datasets;
    const currentPage = gc.currentPage;
    const [user, loading, error] = useAuthState(auth());
    const [defaultWeight, setDefaultWeight] = useState<number>(0);
    const [defaultMissingDataHandlerMethod, setDefaultMissingDataHandlerMethod] = useState<string>('average');
    const [defaultMissingDataHandlerInput, setDefaultMissingDataHandlerInput] = useState<number | null>(null);
    const [defaultNormalizationPercentage, setDefaultNormalizationPercentage] = useState<number>(0);
    const [savedQuestionaires, setSavedQuestionaires] = useState<SavedQuestionaires | null>(null);
    const [currentAnswers, setCurrentAnswers] = useState<Answers | null>(null);

    const getAnswersIndexFromID = (id: number, thisAnswers: Answers): number => {
        return thisAnswers.findIndex((element: QuestionInput) => element.id == id);
    }
    const setLocalStorage=(newObject: any = null): void=>{
        if (newObject === null){
            localStorage.removeItem(getAnswersStorageLocation());
        } else {
            localStorage.setItem(getAnswersStorageLocation(), JSON.stringify(newObject));
        }
    }
    const convertDatasetsToEmptyAnswers = useCallback((datasets: Datasets): Answers => {
        const newFormObject: Answers = Object.keys(datasets).map((datasetID: string): QuestionInput => {
            const thisDataset = datasets![datasetID];
            const max = thisDataset.max_value!;
            const min = thisDataset.min_value!;
            return {
                id: parseInt(datasetID),
                category: thisDataset.category,
                weight: defaultWeight,
                idealValue: min + (0.5 * (max-min)),
                customScoreFunction: null,
                missingDataHandlerMethod: defaultMissingDataHandlerMethod,
                missingDataHandlerInput: defaultMissingDataHandlerInput,
                normalizationPercentage: defaultNormalizationPercentage,
            };
        });
        console.log(newFormObject);
        return newFormObject;
    }, [defaultMissingDataHandlerInput, defaultMissingDataHandlerMethod, defaultNormalizationPercentage, defaultWeight])
    const loadSavedQuestionaires = useCallback(async () => {
        if (!user) { console.error('cannot load saved questionaires if no user is logged in'); return; }
        const response: SavedQuestionaires = await requestWithValidation('GET', `/scores?user_id=${user.uid}`,'SavedQuestionaires') as SavedQuestionaires;
        setSavedQuestionaires(response);
    }, [user, setSavedQuestionaires, requestWithValidation]);

    //saves questionaire using /scores POST api method with empty_response= true query param
    const saveQuestionaire = useCallback(async (answersToSave, name, description) => {
        if (!user) { console.error('error, cannot save Questionaires if no user is logged in'); return; }
        const results = await basicRequest('POST', `/scores?empty_response=true&name=${name}&description=${description}&user_id=${user.uid}`, answersToSave);
        setTimeout(() => loadSavedQuestionaires(), 1000);
    }, [user, loadSavedQuestionaires]);

    const loadQuestionaire = useCallback(async (id) => {
        if (!user) { console.error('error, cannot load saved Questionaires if no user is logged in'); return; }
        console.log('loading questionaire ',id);
        const noScores = (currentPage === 'results') ? false : true; //dont get scores unless on results page, cause they will be recalculated anyways
        const results: LoadScoresInputResponse = await requestWithValidation('GET', `/scores?no_scores=${noScores}&id=${id}`,'LoadScoresInputResponse') as LoadScoresInputResponse;
        if (!noScores) {
            console.log('updating results with loaded questionaires data');
            gc.setCurrentPage(null);
            gc.setCurrentPage('results');
        }
        setLocalStorage(null);
        setLocalStorage(results[1]);
        setCurrentAnswers(results[1]);
    }, [convertDatasetsToEmptyAnswers,gc, requestWithValidation, currentPage, user, setCurrentAnswers]);
    //whenever user changes, and is not null, then load their saved questionaires
    useConditionalEffect([user], () => {
        if (!user) return;
        loadSavedQuestionaires();
    });

    //whenever the Answers change, update the localstorage value
    useConditionalEffect([currentAnswers],() => {
        if (!currentAnswers) return;
        console.log('currentAnswers changed');
        setLocalStorage(currentAnswers);
    });

    //initialize the Answers object
    useConditionalEffect([datasets], () => {
        if (!datasets || currentAnswers) return;
        const answersFromLocalStorage = localStorage.getItem(getAnswersStorageLocation());
        const localVersion: unknown = answersFromLocalStorage ? JSON.parse(answersFromLocalStorage) : null;
        const haveIdenticalDatasetIDs = (answers: Answers, datasets: Datasets)=>{
            const allCurrentDatasetIDs: string[] = Object.keys(datasets);
            const allLocalDatasetIDs: string[] = answers.map(object => object['id'].toString());
            const correctVersion: string = JSON.stringify(allCurrentDatasetIDs.sort((a: any, b: any) => a - b));
            const localVersion: string = JSON.stringify(allLocalDatasetIDs.sort((a: any, b: any) => a - b));
            console.log(allCurrentDatasetIDs, allLocalDatasetIDs);
            return (correctVersion === localVersion);
        }
        if (api.isValidType!(localVersion, 'Answers') && haveIdenticalDatasetIDs(localVersion as Answers, datasets)) {
            console.log('valid saved questionaire detected in local storage, loading it');
            setCurrentAnswers(localVersion as Answers);
        } else {
            if (localVersion){
                setLocalStorage(null);
            }
            console.log('no valid saved questionaire found in local storage, generating a fresh one');
            const newFormObject: Answers = convertDatasetsToEmptyAnswers(datasets);
            setCurrentAnswers(newFormObject);
        }
    });

    //actual reset currentAnswers method
    const resetAnswers = useCallback(() => {
        const shouldReset = window.confirm('Are you sure you want to reset all answers to all questions?');
        if (!shouldReset || !datasets) return;
        const newCurrentAnswers: Answers = convertDatasetsToEmptyAnswers(datasets);
        setCurrentAnswers(newCurrentAnswers);
        setLocalStorage(null);
    }, [setCurrentAnswers, datasets, convertDatasetsToEmptyAnswers]);
    
    function updateCurrentAnswers<T>(newVal: any, datasetID: number, fieldName: keyof QuestionInput) {
        if (!currentAnswers)return;
        const datasetIndex = getAnswersIndexFromID(datasetID, currentAnswers);
        const paramsAreValid = (datasetIndex >= 0 && datasetIndex < currentAnswers.length);
        if (!paramsAreValid) return;
        console.log('updating current answers with', newVal, datasetIndex, fieldName);
        setCurrentAnswers!((prev: any) => {
            const newObj = [...prev];//!potential source of inefficiency,slowdown if there are many datasets
            newObj[datasetIndex][fieldName] = newVal;
            return newObj;
        });
    }

    return (
        <AnswersContext.Provider
            value={{
                currentAnswers: currentAnswers,
                setCurrentAnswers: setCurrentAnswers,
                updateCurrentAnswers: updateCurrentAnswers,
                savedQuestionaires: savedQuestionaires,
                setDefaultMissingDataHandlerInput: setDefaultMissingDataHandlerInput,
                setDefaultMissingDataHandlerMethod: setDefaultMissingDataHandlerMethod,
                setDefaultNormalizationPercentage: setDefaultNormalizationPercentage,
                setDefaultWeight: setDefaultWeight,
                defaultMissingDataHandlerInput: defaultMissingDataHandlerInput,
                defaultMissingDataHandlerMethod: defaultMissingDataHandlerMethod,
                defaultNormalizationPercentage: defaultNormalizationPercentage,
                defaultWeight: defaultWeight,
                resetAnswers: resetAnswers,
                saveQuestionaire: saveQuestionaire,
                loadQuestionaire: loadQuestionaire,
                getAnswersIndexFromID: getAnswersIndexFromID,
            }}
        >
            {children}
        </AnswersContext.Provider>
    );
}
export default AnswersProvider;
