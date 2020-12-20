import {activeMachines as machine}from '../state-machines/App/machine';


export const StateQueries = {
    notInLandingPage(){return !machine.page.state.matches("landing")},
    inSingleQuestionOf_PREF_Form(){return machine.PREF_Form.state.matches("singleQuestion")},
    in_PREF_Definition(){return machine.app.state.matches("PREF_Definition")},
    popupVisible(){return machine.popup.state.matches('visible')},
    viewWideEnoughForSideBar(){return machine.viewport.state.matches('wide')},
    inCategoryOverviewOf_PREF_Form(){return machine.PREF_Form.state.matches('categoryOverview')},
    inLoadingOf_PREF_Definition(){return machine.PREF_Definition.state.matches('loading')},
    inValuePickerOf_PREF_Form(){return machine.singleQuestion.state.matches('valuePicker')},
    PREF_FormAdvancedOptionsEnabled(){return machine.singleQuestionAdvancedOptions.state.matches('enabled')},
    inWeightPickerOf_PREF_Form(){return machine.singleQuestion.state.matches('weightPicker')},
}

export const ModelQueries = {
    getMainMenuItems(){},
    getHeaderLogo(){},
    getHeaderTitle(){},
    getHeaderSubtitle(){},
    getQuestionsInCurrentCategory(){},
    getCurrentQuestion(){},
    getOnChangeForQuestionSelect(){},
    getOnChangeForCategorySelect(){},
    getAllCategories(){},
    getCurrentCategory(){},
    get_PREF_DefinitionFooterButtons(){},
    getCurrentPopupTitle(){},
    getCurrentPopupFooter(){},
    getCurrentPopupContent(){},
    setQuestionsEnabledInCurrentCategory(){},
    getQuestionsEnabledInCurrentCategory(){},
    getCurrentQuestionWeightRange(){},
    getCurrentQuestionWeight(){},
    setCurrentQuestionWeight(){},
    getWeightPickerExplanation(){},
    set_PREF_FormAdvancedOptionsEnabled(){},
    getSimpleWeightSelectOptions(){},
    
    
}