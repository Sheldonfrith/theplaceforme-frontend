import React, {useState, useEffect, useCallback, useContext} from 'react';
import { FormDataContext } from './FormDataProvider';
import {GlobalContext}from './GlobalProvider';
import { DatasetsContext } from "./DatasetsProvider";
import {MissingDataHandlerMethodsContext  } from "./MissingDataHandlerMethodsProvider";
import { CountriesContext } from "./CountriesProvider";
import requestWithValidation from '../../lib/HTTP';

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

//define types here
interface ResultsContextProps {
    setCurrentSelectedCountry: any,
    currentSelectedCountry: string | null,
}

//initialize state structure here
export const ResultsContext = React.createContext<Partial<ResultsContextProps>>({});


const ResultsProvider: React.FunctionComponent =({children}) =>{
    const gc = useContext(GlobalContext);
    const dc = useContext(DatasetsContext);
    const mc = useContext(MissingDataHandlerMethodsContext);
    const cc = useContext(CountriesContext);
    const fc = useContext(FormDataContext);
    const [results, setResults] = useState<Results|undefined>(undefined);
    const [currentCountry, setCurrentCountry] = useState<string|null>(null); // used to show detailed results for each country, one at a time

    const getResults = async (): Promise<Results> =>{
        const countriesResponse: Results = await requestWithValidation<Results>('POST','/scores',allFormData);
        return countriesResponse;
    }


return (
<ResultsContext.Provider
value={{

}}
>
{children}
</ResultsContext.Provider>
);
}
export default ResultsProvider;