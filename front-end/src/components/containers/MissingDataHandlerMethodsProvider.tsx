import React, {useState, useEffect, useCallback, useContext} from 'react';
import { useConditionalEffect } from '../../hooks';
import { DatasetsContext } from './DatasetsProvider';
import { GlobalContext } from './GlobalProvider';
import { getRequest } from "../../lib/HTTP";


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
    const dc = useContext(DatasetsContext);
    const currentPage = gc.currentPage;
    const [missingDataHandlerMethods, setMissingDataHandlerMethods] = useState<MissingDataHandlerMethods|null>(null);

    useConditionalEffect([currentPage], async ()=>{
        if (currentPage !== 'questionaire') return;
        const missingDHMethodsResponse = await <MissingDataHandlerMethods|null><unknown>getRequest("/missing-data-handler-methods");
        if (!missingDHMethodsResponse) {
            console.warn('ERROR: could not get missing data handler methods from API');
            return;
        }
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
