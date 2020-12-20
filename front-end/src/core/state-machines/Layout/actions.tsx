
import { Machine, interpret, assign, spawn, sendParent } from 'xstate';
import {nullElement, ILayoutContext}from './machine';
import * as c from '../../../components2';
import {Container} from 'react-bootstrap';
import React from 'react';

const LayoutContextKeys: keyof typeof ILayoutContext = ['headers', 'popups', 'footers','sidebarLeft','sidebarRight','content'];
const landingPageInitialLayout: ILayoutContext = {
    headers : [<c.DefaultHeader 
        key={0}
        menuItems={[{id:1, text: 'test item1', onClick:()=>{}}, {id: 2, text: 'test item2', onClick:()=>{}}]} 
        logo={{id: 3, text: '/images/logo.svg', onClick: ()=>{}}} 
        title={{id: 4, text: 'ThePlaceFor.Me', onClick: ()=>{}}} 
        subtitle={{id: 5, text: 'by Sheldon Frith', onClick: ()=>window.open('https://sheldonfrith.com')}}
        />],
        //TODO handle the onclick for logo and title below...
    popups : nullElement('popups'),
    footers : [nullElement('footers')],
    sidebarLeft : nullElement('sidebarleft'),
    sidebarRight : nullElement('sidebareRight'),
    content : (
        <Container>
            <c.LandingPageContent/>
        </Container>
    ),
}

const buildPageTemplateFunction = (context: ILayoutContext, newContext: ILayoutContext): void=>{
    LayoutContext.Keys.forEach(key=>{
        context[key] = newContext[key];
    });
}

const buildLandingPageInitial =(context: ILayoutContext)=>{
    buildPageTemplateFunction(context, landingPageInitialLayout);
}
const buildLandingPageWithPopupNotLoggedIn = (context: ILayoutContext)=>{
    buildPageTemplateFunction(context, landingPageWithPopupNotLoggedIn);
}

const actions  = {
    buildLandingPageInitial: buildLandingPageInitial
}
export default actions;

