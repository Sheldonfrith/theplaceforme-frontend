
import React, {useState, useEffect, useCallback, useContext} from 'react';
import { GlobalContext } from './GlobalProvider';
import { useConditionalEffect } from "../../hooks";
import {getRequest}from '../../lib/HTTP';

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
export interface Datasets {
    [datasetID: string]: Dataset,// the key is the dataset id, even though it also appears in the value object
}
type DatasetsEndpointResponse = Dataset[];


//define types here
interface DatasetsContextProps {
    datasets: Datasets|null,
}

//initialize state structure here
export const DatasetsContext = React.createContext<Partial<DatasetsContextProps>>({});


const DatasetsProvider: React.FunctionComponent =({children}) =>{
 const gc = useContext(GlobalContext);
 const currentPage = gc.currentPage;

 const [datasets, setDatasets] =useState<Datasets|null>(null);

const apiDatasetsToFormattedDatasets = (apiDatasets: DatasetsEndpointResponse)=>{
    const formattedDatasets: Datasets = {};
    apiDatasets.forEach((dataset: Dataset)=> formattedDatasets[dataset['id']]={...dataset});
    return formattedDatasets;
}

const setDatasetsFromAPI = async (): Promise<void> =>{
    let datasetsResponse =  await <DatasetsEndpointResponse|null><unknown>getRequest("/datasets");
    if (!datasetsResponse) {
        console.warn('ERROR: did not receive valid response from the api, cannot load datasets');
        return;
    }
    const newDatasetsObject :Datasets = apiDatasetsToFormattedDatasets(datasetsResponse);
    setDatasets(newDatasetsObject);
};

// when currentPage is set to Questionaire, load the datasets data if it doesn't already exist
useConditionalEffect([currentPage],async ()=>{
    if (currentPage !== 'questionaire') return;
    if (datasets) return;
    setDatasetsFromAPI();
});



return (
<DatasetsContext.Provider
value={{
    datasets: datasets,
}}
>
{children}
</DatasetsContext.Provider>
);
}
export default DatasetsProvider;
