import React, {useState, useCallback} from 'react';
import useMyEffect from '../../lib/Hooks/useMyEffect';
import { getRequest } from '../../lib/HTTP';
import getColorByCategory from '../../lib/UI-Constants/categoryColors';
import getIndexByCategory from '../../lib/UI-Constants/categoryOrder';
import {ThemeProvider} from 'styled-components';
import getThemeColors from '../../lib/UI-Constants/themeColors';
import {postRequest} from '../../lib/HTTP';
import getAllFormDataStorageLocation from '../../lib/APP-Constants/localStorage';
import {FormData, QuestionInput} from '../Page-Questionaire/index';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth} from '../App';


//define our types outside the component so they can be used by both the context and provider components
export interface Dataset{
    id: string,
    updated_at: any,
    long_name: string,
    data_type:string,
    max_value?:number|null,
    min_value?:number|null,
    source_link?:string|null,
    source_description?:string|null,
    unit_description:string,
    notes?:string|null,
    category:string,
    distribution_map:number[],
    missing_data_percentage:number,
}
interface Datasets {
    [datasetID: string]: Dataset,// the key is the dataset id, even though it also appears in the value object
}
interface Category {
    index: number,
    formattedName: string,
    color: string,
    datasets: Array<string>, // list of dataset ids associated with each category
}
interface Categories {
    [categoryCode: string]: Category
}
interface MissingDataHandlerObject {
    formattedName: string,
    requiresInput: boolean,
    description: string,
}
export interface MissingDataHandlerMethods {
    [methodName: string]: MissingDataHandlerObject // key is the camelCase name of the method
}
type CurrentPageType = 'welcome'|'questionaire'|'results';
type CurrentPopupType = 'account'|'login'|'countryBreakdown'|'changeDefaults'|'saveQuestionaire';

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

interface Results {
    [alpha_three_code: string]: CountryResult // keys are alpha three codes
}

export interface CountryMetadata {
    id: any,
    updated_at: any,
    alpha_three_code: string,
    alpha_two_code: string,
    numeric_code: string,
    primary_name: string,
}
interface Countries {
    [alpha_three_code: string]: CountryMetadata
}
export interface SavedQuestionaireMetadata {
    id: number,
    created_at: any,
    domain: string,
    name: string | null,
    description: string | null,
    user_id: string | null,
}
type SavedQuestionaires = Array<SavedQuestionaireMetadata>;

//define the types for the GlobalContext component here
interface GlobalContextProps {
    categories: Categories | null,
    datasets: Datasets | null,
    missingDataHandlerMethods: MissingDataHandlerMethods | null,
    currentPage: CurrentPageType | null,
    currentPopup: CurrentPopupType | null,
    setCurrentPage: any,
    setCurrentPopup: any,
    getCategoryByIndex: (index: number) => string|null,
    setResults: any,
    results: Results,
    setCurrentCountry: any,
    currentCountry: string | null,
    defaultWeight: number,
    setDefaultWeight: any,
    defaultMissingDataHandlerMethod: string,
    setDefaultMissingDataHandlerMethod: any,
    defaultMissingDataHandlerInput: number | null,
    setDefaultMissingDataHandlerInput: any,
    defaultNormalizationPercentage: number,
    setDefaultNormalizationPercentage: any,
    resetFormData: any,
    shouldResetFormData: boolean,
    setShouldResetFormData: any,
    countries: Countries,
    saveQuestionaire: any,
    loadQuestionaire: any,
    loadQuestionaires: any,
    convertDatasetsToFormData: any,
    savedQuestionaires: SavedQuestionaires | null,
    allFormData: FormData | null,
    setAllFormData: any,
    user: any,
}
//create the context here
export const GlobalContext = React.createContext<Partial<GlobalContextProps>>({});

const GlobalProvider: React.FunctionComponent =({children}) =>{

    //! DEFINE ALL STATE VARIABLES HERE
    const [user, loading, error] = useAuthState(auth());
    const [defaultWeight, setDefaultWeight] = useState<number>(0);
    const [defaultMissingDataHandlerMethod, setDefaultMissingDataHandlerMethod] = useState<string>('average');
    const [defaultMissingDataHandlerInput, setDefaultMissingDataHandlerInput] = useState<number|null>(null);
    const [defaultNormalizationPercentage, setDefaultNormalizationPercentage] = useState<number>(0);
    const [shouldResetFormData, setShouldResetFormData] = useState<boolean>(false);
    const [currentCountry, setCurrentCountry] = useState<string|null>(null); // used to show detailed results for each country, one at a time
    const [datasets, setDatasets] =useState<Datasets|null>(null);
    const [categories, setCategories] = useState<Categories|null>(null);
    const [missingDataHandlerMethods, setMissingDataHandlerMethods] = useState<MissingDataHandlerMethods|null>(null);
    const [currentPage, setCurrentPage] = useState<CurrentPageType|null>('welcome');
    const [currentPopup, setCurrentPopup] = useState<CurrentPopupType|null>(null);
    const [results, setResults] = useState<Results|undefined>(undefined);
    const [countries, setCountries] = useState<Countries|undefined>(undefined);
    const [savedQuestionaires, setSavedQuestionaires] = useState<SavedQuestionaires|null>(null);
    const [allFormData, setAllFormData] =useState<FormData|null>(null);

    

    interface Theme {
        [key: string]: string
    }
    const theme: Theme = {
        
        headerPicMax:`/images/sheldonfrith-header-max.jpg`,
        headerPic2050: '/images/sheldonfrith-header-2050.jpg',
        headerPic1500: '/images/sheldonfrith-header-1500.jpg',
        headerPic500: '/images/sheldonfrith-header-500.jpg',
        headerPic850: '/images/sheldonfrith-header-850.jpg',
        aboutPic:`/images/meWithIzzy.png`,
        contactPicLarge:`/images/sheldonfrith-contact-600.jpg`,
        contactPicSmall:'images/sheldonfrith-contact-300.jpg',
        searchBarPic:`/images/Searchbar.svg`,
        arrowGraphicsPic:`/images/ArrowsForAnimation.svg`,
        backgroundTransitionPic:`/images/BackgroundWave.svg`,
        primaryBreakpoint:`500`,
        largerBreakpoint: `800`,
        fontFamHeader: `Marmelad`,
        fontFamBody:`Noto Sans`,
        font1:`0.833rem`,
        font2:`1rem`,
        font3:`1.2rem`,
        font4:`1.44rem`,
        font5:`1.728rem`,
        font6:`2.074rem`,
        font7:`2.488rem`,
        ...getThemeColors()
    }
    //! RUN ONCE ON INITIAL LOAD

    
    //! OTHER USEEFFECTS
    useMyEffect([currentPage],async ()=>{
        // console.log('current page changed',currentPage);
        //DELAY UNTIL QUESTIONAIRE PAGE IS LOADED
        if (currentPage !== 'questionaire') return;
        //AND ONLY RUN ONCE PER QUESTIONAIRE SESSION 
        //which means only run once, unless explicitly called again by the user
        if (datasets) return;
        //HTTP REQUEST
        //get datasets metainfo
        const datasetsResponse = await getRequest("/datasets");
        //format datasets into an object with the ids as keys, for ease of use
        const datasetsFormatted: Datasets = {};
        datasetsResponse.forEach((object: Dataset) => datasetsFormatted[object['id']]={...object});
        setDatasets(datasetsFormatted);
        // console.log(datasetsFormatted);
        //HTTP REQUEST
        //get meta info on missing data handler methods
        const missingDHMethodsResponse = await getRequest("/missing-data-handler-methods");
        setMissingDataHandlerMethods(missingDHMethodsResponse);
        // console.log(missingDHMethodsResponse);
        //HTTP REQUEST
        //get COUNTRIES data
        const countriesResponse = await getRequest('/countries');
        const countriesFormatted: Countries = {};
        countriesResponse.forEach((object: CountryMetadata) => countriesFormatted[object['alpha_three_code']]={...object});
        setCountries(countriesFormatted);
        // console.log('got this countries data from api', countriesFormatted);
        //all http requests done,
        //now use the dataset metainfo to generate the categories metainfo
        const newCategories: Categories = {};
        const indexesGiven: Array<number> = [];
        Object.keys(datasetsFormatted).forEach((datasetID: string):void=>{
            const category: string = datasetsFormatted[datasetID]['category'];
            //initialize the category if it doesn't exist
            if (!newCategories[category]){
            newCategories[category] = {
                index: getIndexByCategory(category),
                formattedName: category.slice(0, 1).toUpperCase() + category.slice(1, category.length),
                color: getColorByCategory(category),
                datasets: [datasetID]
            }
            indexesGiven.push(getIndexByCategory(category));
            } else {
                //the category already has been initialized
                //just add the dataset to the datasets array
                newCategories[category]['datasets'].push(datasetID);
            }
        });
        //go back through the categories and rewrite the indexes, because if categories 
        //are missing there will be gaps in the indexes
        indexesGiven.sort((a,b)=>a-b);
        indexesGiven.forEach((is: number, shouldBe: number):void =>{
            newCategories[Object.keys(newCategories).filter((categoryCode: string)=>newCategories[categoryCode].index ===is)[0]].index = shouldBe;
        })
        //finished creating the categories
        setCategories(newCategories);
        // console.log(newCategories);
        //initiliaze the ordered categories list

    },[currentPage]);
    

    //! METHODS AND CALLBACKS
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
    
    const getCategoryByIndex = useCallback((index: number): string | null=>{
        if (!categories) return null;
        return Object.keys(categories).filter((categoryCode: string)=>categories[categoryCode].index ===index)[0];
    },[categories]);

    const loadQuestionaires = useCallback(async ()=>{
        if (!user) throw new Error('error, cannot load saved Questionaires if no user is logged in');
        const results: SavedQuestionaires = await getRequest(`/scores?user_id=${user.uid}`);
        setSavedQuestionaires(results || null);
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

    

    //! use effects that rely on methods above

    //whenever user changes, and is not null, then load their saved questionaires
    useMyEffect([user],()=>{
        if (!user) return;
        loadQuestionaires();
    },[user, loadQuestionaires]);

     //initialize the form data
     useMyEffect([datasets],()=>{
        if (!datasets || allFormData) return;
        //check if form data already exists in local storage
        const localVersion = localStorage.getItem(getAllFormDataStorageLocation());
        if (localVersion) {
            // console.log('getting formdata from local storage, not initializing');
            //local storage already has a version of form data, use that instead
            //TODO validate the local storage form data to make sure it is not corrupted
            setAllFormData(JSON.parse(localVersion));
            return;
        }
        //no local storage, proceed
        // console.log('no local storage formdata available, initializing');
        const newFormObject = convertDatasetsToFormData(datasets);
        // console.log('setting new formdata object',newFormObject);
        setAllFormData(newFormObject);
    },[datasets, setAllFormData, convertDatasetsToFormData]);

    return (
        <GlobalContext.Provider value={{
            categories: categories,
            datasets: datasets,
            missingDataHandlerMethods: missingDataHandlerMethods,
            currentPage: currentPage,
            setCurrentPage: setCurrentPage,
            currentPopup: currentPopup,
            setCurrentPopup: setCurrentPopup,
            getCategoryByIndex: getCategoryByIndex,
            setResults: setResults,
            results: results,
            setCurrentCountry: setCurrentCountry,
            currentCountry: currentCountry,
            defaultWeight: defaultWeight,
            setDefaultWeight: setDefaultWeight,
            defaultMissingDataHandlerMethod: defaultMissingDataHandlerMethod,
            setDefaultMissingDataHandlerMethod: setDefaultMissingDataHandlerMethod,
            defaultMissingDataHandlerInput: defaultMissingDataHandlerInput,
            setDefaultMissingDataHandlerInput: setDefaultMissingDataHandlerInput,
            defaultNormalizationPercentage: defaultNormalizationPercentage,
            setDefaultNormalizationPercentage: setDefaultNormalizationPercentage,
            shouldResetFormData: shouldResetFormData,
            setShouldResetFormData: setShouldResetFormData,
            countries: countries,
            convertDatasetsToFormData: convertDatasetsToFormData,
            saveQuestionaire: saveQuestionaire,
            loadQuestionaire: loadQuestionaire,
            loadQuestionaires: loadQuestionaires,
            savedQuestionaires: savedQuestionaires,
            allFormData: allFormData,
            setAllFormData: setAllFormData,
            user: user,
            }}>
            <ThemeProvider theme={theme}>
            {children}
            </ThemeProvider>
        </GlobalContext.Provider>
    );
}
export default GlobalProvider;