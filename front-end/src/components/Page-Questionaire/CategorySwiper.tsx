
import React, { useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { GlobalContext } from '../containers/GlobalProvider';
import Swipe from 'react-easy-swipe';
import { CategoriesContext } from '../containers/CategoriesProvider';
import { useConditionalEffect } from "../../hooks";

const Category = styled.div<{ color: string }>`
    background: ${props => props.color};
    border-radius: 3rem;
    text-align: center;
    padding: 1rem;
    width: 12rem;
    font-size: 1.5rem;
    color: ${props => props.theme.white};
    margin: 0 1rem;
    box-shadow: 1px 2px 3px rgba(0,0,0,0.8);
    :hover{
        box-shadow: 2px 3px 3px rgba(0,0,0,0.9);
    }
`;

const SwipeSubcontainer = styled.div<{ positionLeft: number }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    position: absolute;
    left: -${props => props.positionLeft}rem;
    transition: left 0.3s ease 0s;

`;
const categoryItemWidth = 15.75;
const zeroPosition = categoryItemWidth / 2;

interface CategorySwiperProps {
    prevCategory: any,
    nextCategory: any,
    currentCategory: string | null,
    currentCategoryIndex: number,
    setCurrentCategoryIndex: any,
    categoryChangeQueu: number,
    setCategoryChangeQueu: any,
}
const CategorySwiper: React.FunctionComponent<CategorySwiperProps> = ({ prevCategory, setCategoryChangeQueu, categoryChangeQueu, setCurrentCategoryIndex, currentCategoryIndex, nextCategory, currentCategory }) => {
    const cc = useContext(CategoriesContext);
    const categories = cc.categories;
    const getLeftPositionFromIndex = (index: number): number => {
        return (index * categoryItemWidth) + zeroPosition;
    };
    const getIndexFromLeftPosition = (leftPosition: number): number => {
        if (!categories) return 0;
        const numberOfCategories = Object.keys(categories).length;
        let newCatIndex = Math.round(leftPosition / categoryItemWidth) - 1;
        //prevent overflow
        if (newCatIndex < 0) newCatIndex = 0;
        if (newCatIndex > (numberOfCategories - 1)) newCatIndex = numberOfCategories - 1;
        return newCatIndex;
    }
    const [positionLeft, setPositionLeft] = useState<number>((currentCategoryIndex !== null) ? getLeftPositionFromIndex(currentCategoryIndex) : zeroPosition);
    const [extraPositionLeft, setExtraPositionLeft] = useState<number>(0);
    
    //set category based on position, not the other way around
    useConditionalEffect([positionLeft], () => {
        const newCatIndex = getIndexFromLeftPosition(positionLeft);
        if (newCatIndex === currentCategoryIndex) return;
        setCurrentCategoryIndex(newCatIndex);
    });

    //when categoryChangeQueu changes, means parent component has changed category and 
    //swiper needs to update position
    useConditionalEffect([categoryChangeQueu], () => {
        if (!categoryChangeQueu) return;
        const newLeftPosition = getLeftPositionFromIndex(currentCategoryIndex + categoryChangeQueu);
        console.log('dealing with category change queu', newLeftPosition);
        setPositionLeft(newLeftPosition);
        setCategoryChangeQueu(0);
    });

    const handleSwipeLeft = () => {
        setPositionLeft(getLeftPositionFromIndex(currentCategoryIndex + 1));
    }
    const handleSwipeRight = () => {
        setPositionLeft(getLeftPositionFromIndex(currentCategoryIndex - 1));
    }
    const handleSwipeMove = (position: any, event: any) => {
        let xPosition = position.x / 10; // divide by 10 to account for rems (specific to current style)
        const newPositionLeft = -xPosition;
        setExtraPositionLeft(newPositionLeft);
        //update the categories while moving, since the useeffect wont fire while dragging
        const newCatIndex = getIndexFromLeftPosition(positionLeft + newPositionLeft);
        if (newCatIndex === currentCategoryIndex) return;
        setCurrentCategoryIndex(newCatIndex);
        //give visuals of moving the category items around
        //but do not change the categories in reality
        return true;//!what does this return do?
    }
    const snapToNearestIndex = () => {
        const indexAtEnd = currentCategoryIndex;
        setExtraPositionLeft(0);
        setPositionLeft(getLeftPositionFromIndex(indexAtEnd));
    }

    return (
        <Swipe
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSwipeMove={handleSwipeMove}
            onSwipeEnd={snapToNearestIndex}
            tolerance={5}
            allowMouseEvents
            innerRef={() => null}
            style={{ position: 'relative' }}
        >
            <SwipeSubcontainer
                positionLeft={positionLeft + extraPositionLeft}
            >
                {categories ?
                    Object.keys(categories).map((i, index) => {
                        const categoryToGet = Object.keys(categories!).filter(j => categories![j].index === index)[0];
                        const category = categories![categoryToGet];
                        return <Category 
                                    onClick={(e) => setPositionLeft(getLeftPositionFromIndex(index))} 
                                    key={categoryToGet} 
                                    color={category.color}
                                >{category.formattedName}</Category>;
                    })
                    : <></>}
            </SwipeSubcontainer>
        </Swipe>
    );
}
export default CategorySwiper;
