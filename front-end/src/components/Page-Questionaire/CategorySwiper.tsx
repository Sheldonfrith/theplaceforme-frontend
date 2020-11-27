
import React, { useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import Swipe from 'react-easy-swipe';
import { CategoriesContext, Categories } from '../containers/CategoriesProvider';
import { useConditionalEffect } from "../../hooks";
import { QuestionaireLogicContext } from './QuestionaireLogicProvider';

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
}
const CategorySwiper: React.FunctionComponent<CategorySwiperProps> = () => {
    const qc = useContext(QuestionaireLogicContext);
    const currentCategoryIndex = qc.currentCategoryIndex ?? 0;
    const setCurrentCategoryIndex = qc.setCurrentCategoryIndex;
    const cc = useContext(CategoriesContext);
    const categories = cc.categories;
    const getLeftPositionFromIndex = (index: number): number => {
        return (index * categoryItemWidth) + zeroPosition;
    };

    const [categoriesJSX, setCategoriesJSX] = useState<JSX.Element[] | null>(null);
    const [userIsSwiping, setUserIsSwiping] = useState<boolean>(false);
    const initializePositionLeft = () => {
        return (currentCategoryIndex !== null) ? getLeftPositionFromIndex(currentCategoryIndex) : zeroPosition;
    }
    const [positionLeft, setPositionLeft] = useState<number>(initializePositionLeft());
    const [extraPositionLeft, setExtraPositionLeft] = useState<number>(0);


    const getIndexFromLeftPosition = (leftPosition: number): number => {
        if (!categories) return 0;
        const numberOfCategories = Object.keys(categories).length;
        let newCatIndex = Math.round(leftPosition / categoryItemWidth) - 1;
        //prevent overflow
        if (newCatIndex < 0) newCatIndex = 0;
        if (newCatIndex > (numberOfCategories - 1)) newCatIndex = numberOfCategories - 1;
        return newCatIndex;
    }

    //set category based on position while userIsSwiping
    useConditionalEffect([positionLeft], () => {
        setCategoryBasedOnPositionLeft(positionLeft);
    });

    const setCategoryBasedOnPositionLeft = (positionLeft: number) => {
        const newCatIndex = getIndexFromLeftPosition(positionLeft);
        if (newCatIndex === currentCategoryIndex) return;
        setCurrentCategoryIndex!(newCatIndex);
    }

    const handleSwipeLeft = () => {
        setPositionLeft(getLeftPositionFromIndex(currentCategoryIndex + 1));
    }
    const handleSwipeRight = () => {
        setPositionLeft(getLeftPositionFromIndex(currentCategoryIndex - 1));
    }
    const handleSwipeMove = (position: any, event: any) => {
        setUserIsSwiping(true);
        let xPosition = position.x / 10; // divide by 10 to account for rems (specific to current style)
        const newPositionLeft = -xPosition;
        setExtraPositionLeft(newPositionLeft);
        //update the categories while moving, since the useeffect wont fire while dragging
        setCategoryBasedOnPositionLeft(positionLeft);
        return true;//!what does this return do?
    }
    const snapToIndex = (index: number) => {
        setExtraPositionLeft(0);
        setPositionLeft(getLeftPositionFromIndex(index));
    }

    //keep categoriesJSX up to date with actual categories object
    useConditionalEffect([categories], () => {
        if (!categories) return;
        updateCategoriesJSX(categories);
    });

    const updateCategoriesJSX = (newCategories: Categories): void => {
        const newCategoriesJSX = Object.keys(newCategories).map((i, index) => {
            const categoryName = Object.keys(newCategories).filter(j => newCategories[j].index === index)[0];
            const category = newCategories[categoryName];
            return <Category
                onClick={(e) => setPositionLeft(getLeftPositionFromIndex(index))}
                key={categoryName}
                color={category.color}
            >{category.formattedName}</Category>;
        });
        setCategoriesJSX(newCategoriesJSX);
    }

    const handleSwipeEnd = () => {
        setUserIsSwiping(false);
        snapToIndex(currentCategoryIndex ?? 0);
    }
    //visual category position will always match the index, but not while user is swiping
    useConditionalEffect([currentCategoryIndex], () => {
        if (userIsSwiping) return;
        const newLeftPosition = getLeftPositionFromIndex(currentCategoryIndex ?? 0);
        setPositionLeft(newLeftPosition);
    });

    return (
        <Swipe
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSwipeMove={handleSwipeMove}
            onSwipeEnd={handleSwipeEnd}
            tolerance={5}
            allowMouseEvents
            innerRef={() => null}
            style={{ position: 'relative' }}
        >
            <SwipeSubcontainer positionLeft={positionLeft + extraPositionLeft}>
                {categoriesJSX ? categoriesJSX : <></>}
            </SwipeSubcontainer>
        </Swipe>
    );
}
export default CategorySwiper;
