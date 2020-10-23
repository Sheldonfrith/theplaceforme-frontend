
import React, {useState, useEffect, useContext, useCallback} from 'react';
import styled from 'styled-components';
import { GlobalContext } from '../containers/GlobalProvider';
import Slider from "react-slick";
import useMyEffect from '../../lib/Hooks/useMyEffect';

const SwiperContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const Category = styled.div<{color:string}>`
    background-color: ${props =>props.color};
    border-radius: 3rem;
    text-align: center;
    padding: 1rem;
    width: 12rem;
    font-size: 1.5rem;
`;

interface CategorySwiperProps{
    setCurrentCategory: any,
    currentCategory: string | null,
}
const CategorySwiper: React.FunctionComponent<CategorySwiperProps> = ({setCurrentCategory, currentCategory}) => {
    const gc = useContext(GlobalContext);
    
    
    return (
       <SwiperContainer>
       {gc.categories?
        Object.keys(gc.categories).map((irelevant,index)=>{
            const categoryToGet = Object.keys(gc.categories!).filter(innerCatCode=>gc.categories![innerCatCode].index===index)[0];
            const category = gc.categories![categoryToGet];
            return <Category key={categoryToGet} color={category.color}>{category.formattedName}</Category>;
        })
       :<></>}
       </SwiperContainer>
    );
}
export default CategorySwiper;
