//this is all the information that my view layer needs to be able to access in order to render
import * as c from '../../components2';
import React, { FunctionComponent } from 'react';
import * as t from '../HelperTypes';
import { StateQueries as sq, ModelQueries as mq } from './Methods';
import * as props from '../../components2/PropTypes';
import ValuePickerAdvancedOptionsContent from '../../components2/Content/PREF_Definition/IndividualQuestion/ValuePicker/AdvancedOptionsContent';
import getValuePickerProps from './ValuePickerProps';
import { sendParent } from 'xstate';
//FOR EACH COMPONENT> disabled, or enabled
// IF THE PROPS IS NULL THEN THE COMPONENT IS SET TO AN EMPTY COMPONENT (as opposed to an empty object for components that 
// are enabled but take no props?)

//for some components> props

const componentNames = Object.keys(c);
const clone = [...componentNames] as const;
type names = typeof clone[number];
type componentNamesType = typeof componentNames[number];
type Components = { [key in componentNamesType]: React.FunctionComponent<any> };
const components: typeof c = { ...c };




const DefaultHeaderProps: props.DefaultHeaderProps = {
    menuItems: mq.getMainMenuItems(),
    logoURL: mq.getHeaderLogo(),
    title: mq.getHeaderTitle(),
    subtitle: mq.getHeaderSubtitle()
}

const IndividualQuestionSpecificHeaderProps: props.IndividualQuestionSpecificHeaderProps = {
    questionsInThisCategory: mq.getQuestionsInCurrentCategory(),
    currentQuestion: mq.getCurrentQuestion(),
    onChange: mq.getOnChangeForQuestionSelect(),
}
const PREF_DefinitionHeaderProps: props.PREF_DefinitionHeaderProps = {
    categories: mq.getAllCategories(),
    currentCategory: mq.getCurrentCategory(),
    onChange: mq.getOnChangeForCategorySelect(),
}
const PREF_DefinitionFooterProps: props.PREF_DefinitionFooterProps = {
    buttons: mq.get_PREF_DefinitionFooterButtons(),
}
const DefaultPopupContainerProps: props.DefaultPopupContainerProps = {
    title: mq.getCurrentPopupTitle(),
    content: mq.getCurrentPopupContent(),
}
const CategoriesSidebarProps: props.CategoriesSidebarProps = {
    categories: mq.getAllCategories(),
}

const LandingPageContentProps: props.LandingPageContentProps = {}

const CategoryOverviewContentProps: props.CategoryOverviewContentProps = {
    questions: mq.getQuestionsInCurrentCategory(),
    setQuestionsEnabled: mq.setQuestionsEnabledInCurrentCategory(),
    getQuestionsEnabled: mq.getQuestionsEnabledInCurrentCategory(),
}
const Loading_PREF_DefinitionContentProps: props.Loading_PREF_DefinitionProps = {}
const ValuePickerAdvancedOptionsProps: props.ValuePickerAdvancedOptionsContentProps = {}
const ValuePickerLayoutContentProps: props.ValuePickerLayoutContentProps = getValuePickerProps(); //Too many props, extracted this one to its own file
const WeightAdvancedContentProps: props.WeightAdvancedContentProps = {
    weightRange: mq.getCurrentQuestionWeightRange(),
}
const WeightPickerLayoutContentProps: props.WeightPickerLayoutContentProps = {
    Explanation: mq.getWeightPickerExplanation(),
    getShowAdvanced: sq.PREF_FormAdvancedOptionsEnabled(),
    setShowAdvanced:mq.set_PREF_FormAdvancedOptionsEnabled(),
    options: mq.getSimpleWeightSelectOptions(),
    getWeight: mq.getCurrentQuestionWeight(),
    setWeight: mq.setCurrentQuestionWeight(),
}

