
import React, {useState, useContext, useRef} from 'react';
import styled from 'styled-components';
import { GlobalContext } from '../containers/GlobalProvider';
import Swipe from 'react-easy-swipe';
import useMyEffect from '../../lib/Hooks/useMyEffect';


const Category = styled.div<{color:string}>`
    background: ${props =>props.color};
    border-radius: 3rem;
    text-align: center;
    padding: 1rem;
    width: 12rem;
    font-size: 1.5rem;
    color: ${props=>props.theme.white};
    margin: 0 1rem;
    box-shadow: 1px 2px 3px rgba(0,0,0,0.8);
    :hover{
        box-shadow: 2px 3px 3px rgba(0,0,0,0.9);
    }
`;

const SwipeSubcontainer= styled.div<{positionLeft:number}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    position: absolute;
    left: -${props=>props.positionLeft}rem;
    transition: left 0.3s ease 0s;

`;

interface CategorySwiperProps{
    prevCategory: any,
    nextCategory: any,
    currentCategory: string | null,
    currentCategoryIndex: number,
    setCurrentCategoryIndex: any,
    categoryChangeQueu: number,
    setCategoryChangeQueu: any,
}
const CategorySwiper: React.FunctionComponent<CategorySwiperProps> = ({prevCategory,setCategoryChangeQueu, categoryChangeQueu, setCurrentCategoryIndex, currentCategoryIndex, nextCategory, currentCategory}) => {
    const categoryItemWidth = 15.75;
    const zeroPosition = categoryItemWidth/2;
    const [categoriesLength, setCategoriesLength] = useState<number>(0);
    const getLeftPositionFromIndex = (index: number): number =>{
        return (index*categoryItemWidth)+zeroPosition;
    };
    const getIndexFromLeftPosition = (leftPosition: number): number =>{
        let newCatIndex = Math.round(leftPosition/categoryItemWidth)-1;
        if (newCatIndex<0) newCatIndex = 0;
        if (newCatIndex>(categoriesLength-1)) newCatIndex = categoriesLength-1;
        return newCatIndex;
    }
    const gc = useContext(GlobalContext);
    const [positionLeft, setPositionLeft] = useState<number>((currentCategoryIndex!==null)?getLeftPositionFromIndex(currentCategoryIndex):zeroPosition);
    const [extraPositionLeft, setExtraPositionLeft] = useState<number>(0);
    //keep categoriesLength up to date
    useMyEffect([gc.categories],()=>{
        if (!gc.categories) return;
        setCategoriesLength(Object.keys(gc.categories).length);
    },[gc.categories, setCategoriesLength, gc.categories])

    const timerToClearSomewhere = useRef<number>(0);

    //set category based on position, not the other way around
    useMyEffect([positionLeft],()=>{
       const newCatIndex = getIndexFromLeftPosition(positionLeft);
        if (newCatIndex === currentCategoryIndex) return;
        setCurrentCategoryIndex(newCatIndex);
    },[positionLeft, getIndexFromLeftPosition, currentCategoryIndex, setCurrentCategoryIndex])

    //when categoryChangeQueu changes, means parent component has changed category and 
    //swiper needs to update position
    // console.log(categoryChangeQueu);
     useMyEffect([categoryChangeQueu],()=>{
        // console.log('category change queu has changed', categoryChangeQueu);
        if (!categoryChangeQueu) return;
        const newLeftPosition = getLeftPositionFromIndex(currentCategoryIndex+categoryChangeQueu);
        console.log('dealing with category change queu', newLeftPosition);
        setPositionLeft(newLeftPosition);
        setCategoryChangeQueu(0);
    },[categoryChangeQueu, setPositionLeft, getLeftPositionFromIndex, currentCategoryIndex])

    const handleSwipeLeft=()=>{
        console.log('swipe left detected');
        
        setPositionLeft(getLeftPositionFromIndex(currentCategoryIndex+1));
    }
    const handleSwipeRight=()=>{
        console.log('swipe right detected');
        
        
        setPositionLeft(getLeftPositionFromIndex(currentCategoryIndex-1));
    }
    const handleSwipeMove=(position:any, event:any)=>{
        console.log('swipe move detected', position.x);
        let xPosition = position.x/10; // divide by 10 to account for rems
        const newPositionLeft = -xPosition; 
        setExtraPositionLeft(newPositionLeft);
        //update the categories while moving, since the useeffect wont fire while dragging
        const newCatIndex = getIndexFromLeftPosition(positionLeft+newPositionLeft);
        if (newCatIndex === currentCategoryIndex) return;
        setCurrentCategoryIndex(newCatIndex);
        //give visuals of moving the category items around
        //but do not change the categories in reality
        return true;
    }
    const handleSwipeEnd = async (event: any)=>{
        //snap to proper index=
        const indexAtEnd = currentCategoryIndex;
        setExtraPositionLeft(0);
        setPositionLeft(getLeftPositionFromIndex(indexAtEnd));
        
    }

    return (
           <Swipe
           onSwipeLeft={handleSwipeLeft}
           onSwipeRight={handleSwipeRight}
           onSwipeMove={handleSwipeMove}
           onSwipeEnd={handleSwipeEnd}
           tolerance={5}
           allowMouseEvents
           innerRef={()=>null}
           style={{position: 'relative'}}
           >
        <SwipeSubcontainer
        positionLeft={positionLeft+extraPositionLeft}
        >
       {gc.categories?
        Object.keys(gc.categories).map((irrelivant,index)=>{
            const categoryToGet = Object.keys(gc.categories!).filter(innerCatCode=>gc.categories![innerCatCode].index===index)[0];
            const category = gc.categories![categoryToGet];
            return <Category onClick={(e)=>setPositionLeft(getLeftPositionFromIndex(index))} key={categoryToGet} color={category.color}>{category.formattedName}</Category>;
        })
       :<></>}
       </SwipeSubcontainer>
       </Swipe>
    );
}
export default CategorySwiper;
