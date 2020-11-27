import React, {useState, useEffect, useCallback, useContext} from 'react';
import { useConditionalEffect } from '../../hooks';
import { DatasetsContext } from './DatasetsProvider';
import { GlobalContext } from './GlobalProvider';
import { APIContext } from "./APIProvider";


interface MissingDataHandlerObject {
    formattedName: string,
    requiresInput: boolean,
    description: string,
}
export interface MissingDataHandlerMethods {
    [methodName: string]: MissingDataHandlerObject // key is the camelCase name of the method
}

//define types here
interface MissingDataHandlerMethodsContextProps {
    missingDataHandlerMethods: MissingDataHandlerMethods | null,
}

//initialize state structure here
export const MissingDataHandlerMethodsContext = React.createContext<Partial<MissingDataHandlerMethodsContextProps>>({});


const MissingDataHandlerMethodsProvider: React.FunctionComponent =({children}) =>{
    const gc = useContext(GlobalContext);
    const api = useContext(APIContext);
    const requestWithValidation = api.requestWithValidation!;
    const currentPage = gc.currentPage;
    const [missingDataHandlerMethods, setMissingDataHandlerMethods] = useState<MissingDataHandlerMethods|null>(null);

    useConditionalEffect([currentPage], async ()=>{
        if (currentPage !== 'questionaire') return;
        const missingDHMethodsResponse = await requestWithValidation('GET','/missing-data-handler-methods','MissingDataHandlerMethods') as MissingDataHandlerMethods;
        setMissingDataHandlerMethods(missingDHMethodsResponse);
    });

return (
<MissingDataHandlerMethodsContext.Provider
value={{
    missingDataHandlerMethods: missingDataHandlerMethods,
}}
>
{children}
</MissingDataHandlerMethodsContext.Provider>
);
}
export default MissingDataHandlerMethodsProvider;
