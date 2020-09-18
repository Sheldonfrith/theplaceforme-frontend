import React from 'react';
import { useEffect } from 'react';
import { useContext, useState, useCallback } from 'react';
import { getRequest } from '../lib/HTTP';

let prevDatasetsData = null;
let prevIsLoading = false;

export default function Questionaire(){
    
    //datasets data structure

    // {
    //     datasetID: {
    //         "meta":{
    //             longName:"",
    //             minVal:"",
    //             etc...
    //         },
    //         "coutry1":"value",
    //         "country2":"value",
    //     }
    // }
    

    const [longNames, setLongNames] = useState(null);
    const [minVals, setMinVals] = useState(null);
    const [maxVals, setMaxVals] = useState(null);
    const [vals, setVals] = useState(null);
    const [weights, setWeights] = useState(null);
    const [isLoading, setIsLoading]= useState(true);
    const [datasetsData, setDatasetsData] = useState(null);

    //onmount get the data from the server
    useEffect(()=>{
        const asyncWrapper = async()=>{
        await setDatasetsData(await getRequest('/datasets'));
        }
        asyncWrapper();
    },[]);

    //once the data is retrieved, use it to set the relevant state variables
    useEffect(()=>{
        //only run once, when datasetsData has been loaded
        if (datasetsData && isLoading){
        const getFromDatasetsData = (property)=>{
            //remove meta from the iteration array
            let result = [];
            Object.keys(datasetsData).forEach(id=>{
                    //ignore meta field
                    if (id ==='meta') return;
                    const thisData = datasetsData[id].meta[property];
                    result.push(thisData);
                    return;
            });
            return result;
        };
        const blankList = () =>{
            return Object.keys(datasetsData).map(id=>{
                return '';
            })
        }
        
        setMaxVals(getFromDatasetsData('maxValue'));
        setLongNames(getFromDatasetsData('longName'));
        setMinVals(getFromDatasetsData('minValue'));
        setVals(blankList());
        setWeights(blankList());
        }
        return;
    },[datasetsData, setMinVals, setMaxVals, setLongNames, setVals, setWeights, setIsLoading, isLoading]);

    //once those states are loaded, set isloading to false
    useEffect(()=>{
        if(!isLoading) return;
        if (!minVals) return;
        if (!longNames) return;
        if (!maxVals) return;
        if (!vals) return;
        if (!weights) return;
        setIsLoading(false);
    },[isLoading,setIsLoading,minVals,longNames,maxVals,vals,weights])

    const changeVal= (e)=>{
        const index = parseInt(e.target.className);
        const val = parseFloat(e.target.value);
        setVals(prev =>{
            return prev.map((v,i) =>{
                if (i ===index) return val;
                else {return v};
            } );
        });
    };
    const changeWeight = (e)=>{
        const index = parseInt(e.target.className);
        const val = parseInt(e.target.value);
        setWeights(prev =>{
            return prev.map((v,i) =>{
                if (i ===index) return val;
                else {return v};
            } );
        });
    };
  
if (!isLoading){
    return (
        <div className="Questionaire">
            <h3>Answer these questions to find out:</h3>
            {longNames.map((name,index)=>{
                return (
                <div key={'mockData'+(index)}>
                    <h3>Question {index+1}</h3>
                    <h4>What {name} would you prefer your country to have?</h4>
                    {/* slider */}
                    <input className={index} key={'valSlider'+index} type="range" onChange={changeVal} min={minVals[index]} max={maxVals[index]} defaultValue={vals[index]}/>
                    <span>{vals[index]}</span>
                    <h4>How important is this to you?</h4>
                    {/* slider */}
                    <input className={index} key={'weightSlider'+index} type="range" onChange={changeWeight} min="0" max="10" defaultValue={weights[index]}/>
                    <span>{weights[index]}</span>
                </div>
                );
            })}
        </div>
    );
        }
if (isLoading) {
        return (
            <div> LOADING ....</div>
        );
    }
}