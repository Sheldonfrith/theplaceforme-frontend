import React, {useState, createContext, useEffect} from 'react';
import _ from 'lodash';


export const GlobalContext = React.createContext({
    categories: [],
    questions: [],
    questionsByCategory: {},
    orderedResults: [],
    topResult: '',
});

export default function GlobalProvider({children}) {
    //questions
    const [questions, setQuestions] = useState([{
        id: 1,
        text: 'Question 1',
        category: 'Government',
    }, {
        id: 2,
        text: 'Question 2',
        category: 'Climate',
    }]);

    //categories
    const [categories, setCategories] = useState(['Government', 'Climate']);
    const getQuestionsByCategory = (currentQuestions, currentCategories) => {
        const newQuestionsByCategory = {};
        currentCategories.forEach(category => {
            _.set(newQuestionsByCategory,category, currentQuestions.filter(obj => obj.category === category));
            });
        return (newQuestionsByCategory);
    }
    const [questionsByCategory, setQuestionsByCategory] = useState(getQuestionsByCategory(questions,categories));
    useEffect(()=> {
        setQuestionsByCategory(getQuestionsByCategory(questions,categories));
    }, [questions, categories])

    //results
    const [orderedResults, setOrderedResults] = useState(['Canada','Brazil','US']);
    const [topResult, setTopResult] = useState(['Brazil']);
    useEffect(() => {
        setTopResult(orderedResults[0])
    }
    , [orderedResults]);

    return (
        <GlobalContext.Provider value={{
            categories: categories,
            questions: questions,
            questionsByCategory: questionsByCategory,
            orderedResults: orderedResults,
            topResult: topResult,

            }}>
            {children}
        </GlobalContext.Provider>
    );
}