const indexesByCategories: string[] = [
    'geography',
    'health',
    'environment',
    'technology',
    'travel',
    'economics',
    'education',
    'immigration',
    'government',
    'violence',
    'religion',
    'culture',
    'demographics',
    'uncategorized',
];

const getPreferredCategoryIndex =(category: string): number |null =>{
    const result = indexesByCategories.indexOf(category);
    if (result <0) return null;
    return result;
}

export default getPreferredCategoryIndex;