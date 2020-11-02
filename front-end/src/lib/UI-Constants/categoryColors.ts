import {getSingleColor} from "./themeColors";

const colorsByCategories: {[key: string]:string} = {
    geography:'yellow',
    health:'greenYellow',
    environment:'green',
    technology:'greenTurquois',
    travel:'blueTurquois',
    economics:'lightBlue',
    education:'bluePurple',
    immigration:'purple',
    government:'pink',
    violence:'pinkRed',
    religion: 'red',
    culture:'orange',
    demographics:'whiteYellow',
    uncategorized:'yellow',
}

const getColorByCategory =(category: string): string=>{
    return getSingleColor('primaryGradient');
    // return getSingleColor(colorsByCategories[category]);
}


export default getColorByCategory;