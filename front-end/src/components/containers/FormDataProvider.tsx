import React, {useState, useEffect, useCallback, useContext} from 'react';
import { CountriesContext } from './CountriesProvider';
import {GlobalContext}from './GlobalProvider';
import { DatasetsContext, Datasets } from "./DatasetsProvider";
import {MissingDataHandlerMethodsContext  } from "./MissingDataHandlerMethodsProvider";
import { useAuthState } from "react-firebase-hooks/auth";
import { getRequest, postRequest } from '../../lib/HTTP';
import {getAllFormDataStorageLocation} from '../../app-constants';
import {FormData, QuestionInput} from '../Page-Questionaire/index';
import { auth} from '../App';
import validateObject from '../../lib/ValidateObject';
import {useConditionalEffect} from '../../hooks';

export interface SavedQuestionaireMetadata {
    id: number,
    created_at: any,
    domain: string,
    name: string | null,
    description: string | null,
    user_id: string | null,
}
type SavedQuestionaires = Array<SavedQuestionaireMetadata>;

//define types here
interface FormDataContextProps {

}

//initialize state structure here
export const FormDataContext = React.createContext<Partial<FormDataContextProps>>({});

const FormDataProvider: React.FunctionComponent =({children}) =>{
    const gc = useContext(GlobalContext);
    const dc = useContext(DatasetsContext);
    const mc = useContext(MissingDataHandlerMethodsContext);
    const cc = useContext(CountriesContext);
    const datasets = dc.datasets;
    const currentPage = gc.currentPage;
    const [user, loading, error] = useAuthState(auth());
    const [defaultWeight, setDefaultWeight] = useState<number>(0);
    const [defaultMissingDataHandlerMethod, setDefaultMissingDataHandlerMethod] = useState<string>('average');
    const [defaultMissingDataHandlerInput, setDefaultMissingDataHandlerInput] = useState<number|null>(null);
    const [defaultNormalizationPercentage, setDefaultNormalizationPercentage] = useState<number>(0);
    const [shouldResetFormData, setShouldResetFormData] = useState<boolean>(false);
    const [savedQuestionaires, setSavedQuestionaires] = useState<SavedQuestionaires|null>(null);
    const [allFormData, setAllFormData] =useState<FormData|null>(null); 

    const convertDatasetsToFormData = useCallback((datasets: Datasets): FormData =>{
        const newFormObject: FormData = Object.keys(datasets).map((datasetID: string): QuestionInput =>{
            const thisDataset = datasets![datasetID];
            const max = thisDataset.max_value;
            const min = thisDataset.min_value;
            return {
                id: datasetID,
                category: thisDataset.category,
                weight: defaultWeight,
                idealValue: (max && min)?(max+(0.5*(min-max))):0,
                customScoreFunction: null,
                missingDataHandlerMethod: defaultMissingDataHandlerMethod,
                missingDataHandlerInput: defaultMissingDataHandlerInput,
                normalizationPercentage: defaultNormalizationPercentage,
            };
        });
        return newFormObject;
    },[])
    const loadQuestionaires = useCallback(async ()=>{
        if (!user) throw new Error('error, cannot load saved Questionaires if no user is logged in');
        const results = await <SavedQuestionaires|null><unknown>getRequest(`/scores?user_id=${user.uid}`);
        if (!results){
            console.warn('Error: could not retrieve saved Questionaires from the API');
            return;
        }
        setSavedQuestionaires(results);
    }, [user, setSavedQuestionaires]);

    //saves questionaire using /scores POST api method with empty_response= true query param
    const saveQuestionaire = useCallback(async (formDataToSave, name, description)=>{
        if (!user) throw new Error('error, cannot save Questionaires if no user is logged in');
        const results = await postRequest(`/scores?empty_response=true&name=${name}&description=${description}&user_id=${user.uid}`,formDataToSave);
        //make the current savedQuestionaires reload to reflect the newly added questionaire
        setTimeout(()=>loadQuestionaires(),1000);
    },[user]);

    const loadQuestionaire = useCallback(async (id)=>{
        if (!user) throw new Error('error, cannot load saved Questionaires if no user is logged in');
        const noScores = (currentPage==='results')?false:true; //dont get scores unless on results page, cause they will be recalculated anyways
        console.log('noScores = ',noScores);
        const results = await getRequest(`/scores?no_scores=${noScores}&id=${id}`);
        //set this to the current allFormData, and results if on results page
        if (!noScores){
            console.log('updating results with loaded questionaires data');
            setResults(results[2]);
        }
        // reset form data by clearing localstorage and then repopulating localstorage, and then 
        //triggering resete of allFormData which will detect the localstorage data and pull from there
        console.log('setting all form data to this... ', results);
        localStorage.removeItem(getAllFormDataStorageLocation());
        localStorage.setItem(getAllFormDataStorageLocation(), JSON.stringify(results[1]));
        setAllFormData(results[1]);
    },[convertDatasetsToFormData, setShouldResetFormData, currentPage, user, setAllFormData]);
 //whenever user changes, and is not null, then load their saved questionaires
 useConditionalEffect([user],()=>{
    if (!user) return;
    loadQuestionaires();
});



     //initialize the form data
     useConditionalEffect([datasets],()=>{
        if (!datasets || allFormData) return;
        //check if form data already exists in local storage
        const formDataFromLocalStorage = localStorage.getItem(getAllFormDataStorageLocation());
        const localVersion = formDataFromLocalStorage?JSON.parse(formDataFromLocalStorage):null;
        if (localVersion && Array.isArray(localVersion) && localVersion.length >0) {//make sure there is actually a valid localversion
            // console.log('getting formdata from local storage, not initializing');
            //local storage already has a version of form data, use that instead, if its valid...

            //validation of local storage data...

            const allFormDataValidatorInnerSchema: Schema = {
                id: (value: number)=> (value !==null && value !== undefined && typeof value === 'number'),
                category: (value: string) => (value && typeof value === 'string'),
                weight: (value: number) => (value !==null && value !== undefined && typeof value === 'number'),
                idealValue: (value: number) => (value !==null && value !==undefined && typeof value=== 'number'),
                customScoreFunction: (value: any) => true,//can have any value or be missing, not implemented yet
                missingDataHandlerMethod: (value: string) => (value && typeof value === 'string'),
                missingDataHandlerInput: (value: any) => (!value || typeof value === 'string'), // can be null or a number
                normalizationPercentage: (value: number) => (value !== null && value !==undefined && typeof value ==='number'),
            };
            const validationResults = localVersion.map((innerObject: any) =>{
                validateObject(innerObject, allFormDataValidatorInnerSchema);
            }); // returns list for each object in the local storage object, with boolean true if it IS valid and error messages otherwise
            let isValid: boolean = !validationResults.every((item: any) => item===true);
            //also check that the length of the array and the ids correspond with the actual
            //databases from the API currently
            const allCurrentDatasetIDs: string[] = Object.keys(datasets);// simple array with all the dataset ids that SHOULD be present
            //get the dataset ids held in the local storage object as a simple array:
            const allLocalDatasetIDs: number[] = localVersion.map(object => object['id']);
            //sort them both and then do a deep stringified compare to make sure they are identical
            const correctVersion: string = JSON.stringify(allCurrentDatasetIDs.sort((a: any,b:any)=> a - b));
            const compareVersion: string = JSON.stringify(allLocalDatasetIDs.sort((a: any,b: any)=>a - b));
            if (correctVersion !== compareVersion) {
                isValid = false;
            }
            if (isValid){
                //LOCAL DATA IS VALID, use it
                setAllFormData(localVersion);
                return;
            } else {
                //LOCAL DATA NOT VALID
                console.log ('local storage version of allFormData is invalid, replacing...');
            }
        }
        //no local storage, proceed
        // console.log('no local storage formdata available, initializing');
        const newFormObject = convertDatasetsToFormData(datasets);
        // console.log('setting new formdata object',newFormObject);
        setAllFormData(newFormObject);
    });

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

    
return (
<FormDataContext.Provider
value={{

}}
>
{children}
</FormDataContext.Provider>
);
}
export default FormDataProvider;
