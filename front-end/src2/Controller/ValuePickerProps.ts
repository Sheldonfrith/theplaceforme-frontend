export default function get(){
    IdealValuePickerProps: IdealValuePickerProps,
    NormalizationPickerProps: NormalizationPickerProps,
    MissingDataHandlerPickerProps: MissingDataHandlerPickerProps,
    getShowAdvanced(): boolean,
    setShowAdvanced(val: boolean): void,
}


//Whatch for relevant changes in the state machine using a listener callback

//View creator needs to be subscribed to all relevant events in the state machine,
// and they need to be able to re-render whenever relevant information changes

//REACT is much better at handling the re-rending than I ever will be... I should make sure I'm not doing any of that...
// which means I should only be sending data and callbacks to React, React should handle all the rest,
// If I send them all to a contextComponent, then it can handle rendering or not rendering child components



const Observable = {
    subscribe(){},
    notify(){}
}
const service = interpret(machine).onTransition(state=>{
    
})