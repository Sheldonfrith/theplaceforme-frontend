import React, { useState, useEffect, useCallback, useContext } from 'react';
import { GlobalContext } from "./GlobalProvider";
import { DatasetsContext, Datasets } from "./DatasetsProvider";
import { useConditionalEffect } from "../../hooks";

import { getPreferredCategoryIndex, getColorByCategory } from "../../ui-constants";
import { toTitleCase } from "../../lib/Utils";

export interface Category {
    index: number,
    formattedName: string,
    color: string,
    datasets: Array<string>, // list of dataset ids associated with each category
}
type CategoryKeys = 'index' | 'formattedName' | 'color' | 'datasets';
type CategoryFieldTypes = number | string | Array<string>;
export interface Categories {
    [categoryName: string]: Category
}

//define types here
interface CategoriesContextProps {
    categories: Categories | null,
    getCategoryNameByIndex: (index:number)=>string|null,
    getCategoryFieldByIndex: (index: number, fieldName: CategoryKeys) => string | number | string[] | null
}

//initialize state structure here
export const CategoriesContext = React.createContext<Partial<CategoriesContextProps>>({});

const CategoriesProvider: React.FunctionComponent = ({ children }) => {
    const gc = useContext(GlobalContext);
    const dc = useContext(DatasetsContext);
    const datasets = dc.datasets;
    const [categories, setCategories] = useState<Categories | null>(null);

    //whenever Datasets changes, update the Categories
    useConditionalEffect([datasets], () => {
        if (!datasets) return;
        updateCategories(datasets);
    });

    
    const getCategoryNameByIndex = useCallback((index: number): string | null=>{
        if (!categories) return null;
        return Object.keys(categories).filter((categoryCode: string)=>categories[categoryCode].index ===index)[0];
    },[categories]);

    const updateCategories = useCallback((currentDatasets: Datasets): void => {
        const newCategories: Categories = {};
        const categoriesWithoutIndexes: Categories = {};
        const initializeCategory = (category: string): void => {
            const index = getPreferredCategoryIndex(category);
            const newCategory = {
                index: index,
                formattedName: toTitleCase(category),
                color: getColorByCategory(category),
                datasets: []
            }
            if (index) newCategories[category] = newCategory;
            if (!index) categoriesWithoutIndexes[category] = newCategory;
        }
        const mergeCategoriesWithoutIndexes = (): void => {
            const nextIndex: number = Object.keys(newCategories).length;
            Object.keys(categoriesWithoutIndexes).forEach((category, index) => {
                const thisIndex = nextIndex + index;
                newCategories[category] = { ...categoriesWithoutIndexes[category], index: thisIndex }
            })
        }
        const getAllCategoryNames = (): string[] => {
            const categoryNames: string[] = [];
            Object.keys(currentDatasets).forEach((datasetID: string) => {
                const category: string = currentDatasets[datasetID].category;
                if (categoryNames.includes(category)) return;
                categoryNames.push(category);
            })
            return categoryNames;
        }
        const initializeAllCategories = () => {
            getAllCategoryNames().forEach(category => {
                initializeCategory(category);
            });
        }
        const populateCategoryDatasetsLists = () => {
            Object.keys(currentDatasets).forEach((datasetID: string) => {
                const category: string = currentDatasets[datasetID].category;
                newCategories[category]['datasets'].push(datasetID);
            });
        }
        initializeAllCategories();
        mergeCategoriesWithoutIndexes();
        populateCategoryDatasetsLists();
        setCategories(newCategories);
    },[]);

    const getCategoryFieldByIndex = (index: number, fieldName: CategoryKeys) => {
        if (!categories) return null;
        const thisCategory = getCategoryNameByIndex(index);
        if (!thisCategory) throw new Error('Error: could not find category associated with index '+index);
        const fieldValue =  categories[thisCategory][fieldName];
        return fieldValue;
    }

    return (
        <CategoriesContext.Provider
            value={{
                categories: categories,
                getCategoryNameByIndex: getCategoryNameByIndex,
                getCategoryFieldByIndex: getCategoryFieldByIndex,
            }}
        >
            {children}
        </CategoriesContext.Provider>
    );
}
export default CategoriesProvider;
