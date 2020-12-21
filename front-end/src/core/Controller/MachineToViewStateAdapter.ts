import {CategoryModel, SendAdaptedViewState, ViewObjectProps, MainMachineState, ViewState, QuestionModel, ButtonModel} from '../HelperTypes';

export default class MachineToViewStateAdapter {
    protected sendAdaptedViewState: SendAdaptedViewState;
    protected adaptedViewState: ViewState = {};
    public constructor(sendAdaptedViewState: SendAdaptedViewState){
        this.sendAdaptedViewState = sendAdaptedViewState;
    }
    public handleNewState (newState: MainMachineState){

    }
}

export const StateQueries = {
    notInLandingPage(mState:MainMachineState){return !mState.PageMachine.state.matches("landing")},
    inSingleQuestionOf_PREF_Form(mState:MainMachineState){return mState.PREF_FormMachine.state.matches("singleQuestion")},
    in_PREF_Definition(mState:MainMachineState){return mState.AppMachine.state.matches("PREF_Definition")},
    popupVisible(mState:MainMachineState){return mState.PopupMachine.state.matches('visible')},
    viewWideEnoughForSideBar(mState:MainMachineState){return mState.ViewPortMachine.state.matches('wide')},
    inCategoryOverviewOf_PREF_Form(mState:MainMachineState){return mState.PREF_FormMachine.state.matches('categoryOverview')},
    inLoadingOf_PREF_Definition(mState:MainMachineState){return mState.PREF_DefinitionMachine.state.matches('loading')},
    inValuePickerOf_PREF_Form(mState:MainMachineState){return mState.SingleQuestionMachine.state.matches('valuePicker')},
    PREF_FormAdvancedOptionsEnabled(mState:MainMachineState){return mState.SingleQuestionAdvancedOptionsMachine.state.matches('enabled')},
    inWeightPickerOf_PREF_Form(mState:MainMachineState){return mState.SingleQuestionMachine.state.matches('weightPicker')},
}
const mState: MainMachineState = {};
export const ModelQueries = {
    getMainMenuItems():ViewObjectProps[]{
        return mState.MainMenuMachine.state.context.items;
    },
    getHeaderLogo():{url: string, onClick: any}{
        return {
            url: mState.ViewMachine.state.context.logoURL,
            onClick: mState.ViewMachine.send('LogoClick'),
        };
    },
    getHeaderTitle():ViewObjectProps{
        return {
            id: 0,
            text: mState.ViewMachine.state.context.mainTitle,
            onClick: mState.ViewMachine.send('TitleClick')
        };
    },
    getHeaderSubtitle():ViewObjectProps{
        return {
            id: 0,
            text: mState.ViewMachine.state.context.subTitle,
            onClick: mState.ViewMachine.send('SubTitleClick'),
        };
    },
    getQuestionsInCurrentCategory(): ViewObjectProps[]{
        return mState.PREF_FormMachine.state.context.questionsInCurrentCategory.map(
            (question: QuestionModel<any>)=>({
                    id: question.id,
                    text: question.text,
                    onClick: mState.PREF_FormMachine.send({type: 'SetCurrentQuestion', questionID: question.id})
                })
        )
    },
    getCurrentQuestion():number{
        return mState.PREF_FormMachine.state.context.currentQuestion.id;
    },
    getOnChangeForQuestionSelect(){
        return (questionID: number)=> mState.PREF_FormMachine.send({type: 'SetCurrentQuestion', questionID: questionID});
    },
    getOnChangeForCategorySelect(){
        return (categoryID: number) => mState.PREF_FormMachine.send({type: 'SetCurrentCategory', categoryID: categoryID});
    },
    getAllCategories(){
        return mState.PREF_FormMachine.state.context.allCategories.map(
            (category: CategoryModel)=>({
                id: category.id,
                text: category.text,
                onClick: mState.PREF_FormMachine.send({type: 'SetCurrentCategory', categoryID: category.id}),
            })
        );
    },
    getCurrentCategory(){
        return {
            id: mState.PREF_FormMachine.state.context.currentCategory.id,
            text: mState.PREF_FormMachine.state.context.currentCategory.text,
            onClick:()=>{}
        };
    },
    get_PREF_DefinitionFooterButtons(){
        return mState.PREF_FormMachine.state.context.bottomButtons.map(
            (button: ButtonModel)=>({
                id: button.id,
                text: button.text,
                onClick: ()=>mState.PREF_FormMachine.send(button.nameOfEventToSendOnClick),
            })
        )
    },
    getCurrentPopupTitle(){
        return mState.PopupMachine.state.context.title;
    },
    getCurrentPopupContent(){
        
    },
    setQuestionsEnabledInCurrentCategory(){},
    getQuestionsEnabledInCurrentCategory(){},
    getCurrentQuestionWeightRange(){},
    getCurrentQuestionWeight(){},
    setCurrentQuestionWeight(){},
    getWeightPickerExplanation(){},
    set_PREF_FormAdvancedOptionsEnabled(){},
    getSimpleWeightSelectOptions(){},
    
    
}

const GetViewComponentStates: { [key in componentNamesType]: { enabled: any, props: any } } = {
    DefaultHeader: {
        enabled: sq.notInLandingPage(),
        props: { ...DefaultHeaderProps },
    },
    IndividualQuestionSpecificHeader: {
        enabled: sq.inSingleQuestionOf_PREF_Form(),
        props: { ...IndividualQuestionSpecificHeaderProps }
    },
    PREF_DefinitionHeader: {
        enabled: sq.in_PREF_Definition(),
        props: { ...PREF_DefinitionHeaderProps },
    },
    PREF_DefinitionFooter: {
        enabled: sq.in_PREF_Definition(),
        props: { ...PREF_DefinitionFooterProps },
    },
    DefaultPopupContainer: {
        enabled: sq.popupVisible(),
        props: { ...DefaultPopupContainerProps },
    },
    CategoriesSidebar: {
        enabled: (sq.viewWideEnoughForSideBar() && sq.in_PREF_Definition()),
        props: { ...CategoriesSidebarProps },
    },
    LandingPageContent: {
        enabled: !sq.notInLandingPage(),
        props: { ...LandingPageContentProps },
    },
    CategoryOverviewContent: {
        enabled: (sq.inCategoryOverviewOf_PREF_Form()),
        props: { ...CategoryOverviewContentProps },
    },
    Loading_PREF_DefinitionContent: {
        enabled: sq.inLoadingOf_PREF_Definition(),
        props: { ...Loading_PREF_DefinitionContentProps },
    },
    ValuePickerAdvancedOptions: {
        enabled: (sq.inValuePickerOf_PREF_Form() && sq.PREF_FormAdvancedOptionsEnabled()),
        props: { ...ValuePickerAdvancedOptionsProps },
    },
    ValuePickerLayout: {
        enabled: sq.inValuePickerOf_PREF_Form(),
        props: { ...ValuePickerLayoutContentProps },
    },
    WeightPickerAdvanced: {
        enabled: (sq.inWeightPickerOf_PREF_Form() && sq.PREF_FormAdvancedOptionsEnabled()),
        props: { ...WeightAdvancedContentProps },
    },
    WeightPickerLayout: {
        enabled: sq.inWeightPickerOf_PREF_Form(),
        props: { ...WeightPickerLayoutContentProps },
    }
}