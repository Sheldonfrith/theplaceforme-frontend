import React, { useState, useEffect, useCallback, useContext } from 'react';
import { MethodNames, basicRequest } from '../../lib/HTTP';
import Joi from 'joi';

const DatasetsEndpointResponse = Joi.array().items(
    Joi.object({
        id: Joi.number().integer().required(),
        updated_at: Joi.any().required(),
        long_name: Joi.string().required(),
        data_type: Joi.string().required(),
        max_value: Joi.number().allow(null),
        min_value: Joi.number().allow(null),
        source_link: Joi.alternatives().conditional('source_description', { is: null, then: Joi.string().required(), otherwise: Joi.string().allow(null) }),
        source_description: Joi.alternatives().conditional('source_link', { is: null, then: Joi.string().required(), otherwise: Joi.string().allow(null) }),
        unit_description: Joi.string().required(),
        notes: Joi.string().allow(null),
        category: Joi.string().required(),
        distribution_map: Joi.array().items(Joi.number()).required(),
        missing_data_percentage: Joi.number().allow(null),
    })
);
const MissingDataHandlerMethods = Joi.object().pattern(/^/, Joi.object({
    formattedName: Joi.string().required(),
    requiresInput: Joi.boolean().required(),
    description: Joi.string().required(),
}));
const CountriesResponse = Joi.array().items(Joi.object({
    id: Joi.number().required(),
    updated_at: Joi.any().required(),
    alpha_three_code: Joi.string().required(),
    alpha_two_code: Joi.string().required(),
    numeric_code: Joi.string().required(),
    primary_name: Joi.string().required(),
}));
const Results = Joi.object().pattern(/^/, Joi.object({
    primary_name: Joi.string().required(),
    totalScore: Joi.number().required(),
    rank: Joi.number().required(),
    percentile: Joi.number().required(),
    categoryBreakdown: Joi.object().pattern(/^/, Joi.number().required()),
    scoreBreakdown: Joi.object().pattern(/^/, Joi.object({
        score: Joi.number().required(),
        rank: Joi.number().required(),
        percentile: Joi.number().required(),
        dataWasMissing: Joi.boolean().required(),
    }).required())
}));
const QuestionInput = Joi.object({
    id: Joi.number().required(),
    category: Joi.string().required(),
    weight: Joi.number().required(),
    idealValue: Joi.number().required(),
    customScoreFunction: Joi.allow(null),
    missingDataHandlerMethod: Joi.string().required(),
    missingDataHandlerInput: Joi.number().allow(null),
    normalizationPercentage: Joi.number().required(),
});
const Answers = Joi.array().items(QuestionInput);
const SavedQuestionaireMetadata = Joi.object({
    id: Joi.number().required(),
    created_at: Joi.any().required(),
    domain: Joi.string().required(),
    name: Joi.string().allow(null),
    description: Joi.string().allow(null),
    user_id: Joi.string().allow(null),
});
const SavedQuestionaires = Joi.array().items(SavedQuestionaireMetadata);
const LoadScoresInputResponse = Joi.array().ordered(SavedQuestionaireMetadata.required(), Answers.required(), Results.allow(null));

const validationSchemas = {
    DatasetsEndpointResponse: DatasetsEndpointResponse,
    Answers: Answers,
    MissingDataHandlerMethods: MissingDataHandlerMethods,
    CountriesResponse: CountriesResponse,
    Results: Results,
    SavedQuestionaires: SavedQuestionaires,
    LoadScoresInputResponse: LoadScoresInputResponse,
}

type ValidationSchemaNames = 'DatasetsEndpointResponse' | 'Answers' | 'MissingDataHandlerMethods' | 'CountriesResponse' | 'Results' | 'SavedQuestionaires' | 'LoadScoresInputResponse';

//define types here
interface APIContextProps {
    requestWithValidation: (method: MethodNames, endpoint: string, responseType: ValidationSchemaNames, body?: JSON | undefined)=> Promise<unknown>,
    isValidType: (objectToValidate: any, typeName: ValidationSchemaNames) => boolean,
}

//initialize state structure here
export const APIContext = React.createContext<Partial<APIContextProps>>({});


const APIProvider: React.FunctionComponent = ({ children }) => {
    function validateResponse(response: unknown, responseType: ValidationSchemaNames) {
        const { error, value } = validationSchemas[responseType].validate(response);
        if (error) console.log(error);
        if (error) return false;
        return true;
    }
    const isValidType = (objectToValidate: any, typeName: ValidationSchemaNames) => {
        const { error, value } = validationSchemas[typeName].validate(objectToValidate);
        if (error) return false;
        return true;
    }
    async function requestWithValidation(method: MethodNames, endpoint: string, responseType: ValidationSchemaNames, body?: JSON): Promise<unknown> {
        let response: unknown = await basicRequest(method, endpoint, body);
        const responseIsValid = validateResponse(response, responseType);
        if (!responseIsValid){ console.error('ERROR: did not receive valid HTTP response from ' + endpoint);}
        console.log(response);
        return response;
    }

    return (
        <APIContext.Provider
            value={{
                requestWithValidation: requestWithValidation,
                isValidType: isValidType,
            }}
        >
            {children}
        </APIContext.Provider>
    );
}
export default APIProvider;
