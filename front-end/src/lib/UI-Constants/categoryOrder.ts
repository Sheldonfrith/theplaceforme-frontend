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

const getIndexByCategory =(category: string): number =>{
    const result = indexesByCategories.indexOf(category);
    if (result <0) throw new Error('error, category ('+category+') given to getIndexByCategory could not be found');
    return result;
}

export default getIndexByCategory;