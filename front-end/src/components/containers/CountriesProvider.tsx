import React, {useState, useEffect, useCallback, useContext} from 'react';
import {MissingDataHandlerMethodsContext} from './MissingDataHandlerMethodsProvider';
import {GlobalContext}from './GlobalProvider';
import { DatasetsContext } from "./DatasetsProvider";
import { useConditionalEffect } from "../../hooks";
import {getRequest}from '../../lib/HTTP';

export interface CountryMetadata {
    id: number,
    updated_at: any,
    alpha_three_code: string,
    alpha_two_code: string,
    numeric_code: string,
    primary_name: string,
}
interface Countries {
    [alpha_three_code: string]: CountryMetadata
}
interface CountriesResponse extends Array<CountryMetadata>{

}

//define types here
interface CountriesContextProps {
    countries: Countries | null,
}

//initialize state structure here
export const CountriesContext = React.createContext<Partial<CountriesContextProps>>({});


const CountriesProvider: React.FunctionComponent =({children}) =>{
    const gc = useContext(GlobalContext);
    const dc = useContext(DatasetsContext);
    const mc = useContext(MissingDataHandlerMethodsContext);
    const currentPage = gc.currentPage;
    const [countries, setCountries] = useState<Countries|undefined>(undefined);

    const formatCountriesResponse = (countriesResponse: CountriesResponse): Countries =>{
        const countriesFormatted: Countries = {};
        countriesResponse.forEach((object: CountryMetadata) => countriesFormatted[object['alpha_three_code']]={...object});
        return countriesFormatted;
    }
    useConditionalEffect([currentPage],async ()=>{
        if (currentPage !== 'questionaire') return;
        const countriesResponse = await <CountriesResponse|null><unknown>getRequest('/countries');
        if (!countriesResponse) {
            console.warn('Error: could not load Countries from API');
            return;
        }
        const countriesFormatted: Countries = formatCountriesResponse(countriesResponse);
        setCountries(countriesFormatted);
    });
return (
<CountriesContext.Provider
value={{
    countries: countries,
}}
>
{children}
</CountriesContext.Provider>
);
}
export default CountriesProvider;
