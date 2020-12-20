import {activeMachines} from '../state-machines/App/machine';
import {IActiveMachines}from '../state-machines/Initialize';
import * as c from '../../components2';
import React from 'react';

export const nullElement = (id: string)=><div id={id} key={id}></div>;


const getHeaders=()=>{
    const defaultHeader = nullElement('defaultHeader');
    const IndividualQuestionSpecificHeader = nullElement('individualQuestionHeader');
    const PREF_DefinitionHeader = nullElement('PREF_DefinitionHeader');
    return [defaultHeader,IndividualQuestionSpecificHeader, PREF_DefinitionHeader];

}
const getPopups=()=>{

}
const getSidebarLeft=()=>{

}
const getSidebarRight=()=>{

}
const getContent=()=>{

}
const getFooters=()=>{

}

function getDefaultHeader(){
    if (activeMachines.page.state.matches('landing')) return nullElement('defaultHeader');
    return (<c.DefaultHeader 
        key={0}
        menuItems={[{id:1, text: 'test item1', onClick:()=>{}}, {id: 2, text: 'test item2', onClick:()=>{}}]} 
        logo={{id: 3, text: '/images/logo.svg', onClick: ()=>{}}} 
        title={{id: 4, text: 'ThePlaceFor.Me', onClick: ()=>{}}} 
        subtitle={{id: 5, text: 'by Sheldon Frith', onClick: ()=>window.open('https://sheldonfrith.com')}}
    />);
}
function getIndividualQuestionHeader(){
    const shouldShow = activeMachines.app.state.matches('get_PREF.fillingForm.inIndividualQuestion');
    if (!shouldShow) return nullElement('individualQuestionHeader');
    const questionsInThisCategoryWithoutOnClick = activeMachines.app.children.PREF_DefinitionMachine.children.PREF_FormMachine.context.questionsInCurrentCategory;
    const properlyFormattedQuestionsInThisCategory = addOnClickToObjectList(questionsInThisCategoryWithoutOnClick,null);
    const currentQuestion = activeMachines.app.state.children.PREF_DefinitionMachine.state.children.PREF_Form.context
    return (
        <c.IndividualQuestionSpecificHeader
            questionsInThisCategory={properlyFormattedQuestionsInThisCategory}
            currentQuestion={}
            onChange={}
        />
    );
}
function get_PREF_DefinitionHeader(){
    
}

function addOnClickToObjectList(objectList: {id:number, text:string}[], onClick: null | ((e:any|null)=>void) ){
    return objectList.map(obj=>addOnClickToSimpleElementProps(obj,onClick?onClick:()=>{}));
}

function addOnClickToSimpleElementProps(currentObj: {id: number, text:string}, onClick: (e:any | null)=>void){
    return {...currentObj, onClick: onClick};
}