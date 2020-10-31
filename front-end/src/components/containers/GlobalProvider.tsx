import React, {useState, createContext, useEffect, useCallback} from 'react';
import useMyEffect from '../../lib/Hooks/useMyEffect';
import { getRequest } from '../../lib/HTTP';
import getColorByCategory from '../../lib/UI-Constants/categoryColors';
import getIndexByCategory from '../../lib/UI-Constants/categoryOrder';
import {ThemeProvider} from 'styled-components';
import getThemeColors from '../../lib/UI-Constants/themeColors';

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
    distribution_map:string,
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
type CurrentPopupType = 'account'|'login'|'countryBreakdown'|'changeDefaults';

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
    defaultMissingDataHandlerInput: number,
    setDefaultMissingDataHandlerInput: any,
    defaultNormalizationPercentage: number,
    setDefaultNormalizationPercentage: any,
    resetFormData: any,
    shouldResetFormData: boolean,
    setShouldResetFormData: any,
    countries: Countries,
}
//create the context here
export const GlobalContext = React.createContext<Partial<GlobalContextProps>>({});

const GlobalProvider: React.FunctionComponent =({children}) =>{

    //! DEFINE ALL STATE VARIABLES HERE
    const [defaultWeight, setDefaultWeight] = useState<number>(0);
    const [defaultMissingDataHandlerMethod, setDefaultMissingDataHandlerMethod] = useState<string>('average');
    const [defaultMissingDataHandlerInput, setDefaultMissingDataHandlerInput] = useState<number|undefined>(undefined);
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
        console.log('current page changed',currentPage);
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
        console.log(datasetsFormatted);
        //HTTP REQUEST
        //get meta info on missing data handler methods
        const missingDHMethodsResponse = await getRequest("/missing-data-handler-methods");
        setMissingDataHandlerMethods(missingDHMethodsResponse);
        console.log(missingDHMethodsResponse);
        //HTTP REQUEST
        //get COUNTRIES data
        const countriesResponse = await getRequest('/countries');
        const countriesFormatted: Countries = {};
        countriesResponse.forEach((object: CountryMetadata) => countriesFormatted[object['alpha_three_code']]={...object});
        setCountries(countriesFormatted);
        console.log('got this countries data from api', countriesFormatted);
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
        console.log(newCategories);
        //initiliaze the ordered categories list

    },[currentPage]);
    //! METHODS AND CALLBACKS
    
    const getCategoryByIndex = useCallback((index: number): string | null=>{
        if (!categories) return null;
        return Object.keys(categories).filter((categoryCode: string)=>categories[categoryCode].index ===index)[0];
    },[categories]);
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
            }}>
            <ThemeProvider theme={theme}>
            {children}
            </ThemeProvider>
        </GlobalContext.Provider>
    );
}
export default GlobalProvider;