const indexesByCategories: {[category: string]:number} = {
    'demographics':0,
    'geography':1,
    'violence':10,
    'religion': 11,
    'government':9,
    'economics':6,
    'immigration':8,
    'culture':12,
    'health':2,
    'environment':3,
    'travel':5,
    'education':7,
    'technology':4,
    'uncategorized':13,
}

const getIndexByCategory =(category: string): number =>{
    const result = indexesByCategories[category];

    if (result === null || result === undefined) throw new Error('error, category ('+category+') given to getIndexByCategory could not be found');
    return result;
}

export default getIndexByCategory;