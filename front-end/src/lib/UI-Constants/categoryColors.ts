const colorsByCategories: {[key: string]:string} = {
    'demographics':'white',
    'geography':'yellow',
    'violence':'red',
    'religion': 'orange',
    'government':'pink',
    'economics':'light-blue',
    'immigration':'purpel',
    'culture':'orange-yellow',
    'health':'green-yellow',
    'environment':'green',
    'travel':'blue-turquois',
    'education':'blue-purple',
    'technology':'green-turquois',
    'uncategorized':'white-yellow',
}

const getColorByCategory =(category: string): string=>{
    return colorsByCategories[category];
}


export default getColorByCategory;