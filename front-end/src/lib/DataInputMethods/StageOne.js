import RemoveMultipleYears from "./RemoveMultipleYears";
import AddMissingCountries from "./AddMissingCountries";
import ConvertSynonyms from "./ConvertSynonyms";
import DeepConvertToType from "./DeepConvertToType";
import DeepRemoveWhitespace from "./DeepRemoveWhitespace";
import ObjectToLowerCase from "./ObjectToLowercase";
import ProcessDependents from "./ProcessDependents";
import RemoveAccents from "./RemoveAccents";
import RemoveInvalidChildren from "./RemoveInvalidChildren";

export default function StageOne(array, options){
    const defaultOptions= {
        allLowerCase: true,
        removeInvalidChildren: true,
        removeWhitespace: true,
        forceType: 'number',
        removeAccents: true,
        shouldRemoveMultiYearData: false, //if true give a direction, top or bottom
        handleSynonyms: 'convert',//can be either convert or delete
        dependentCombineMethod: 'delete',// delete does not combine, it just deletes the dependents data
        addMissingCountries: true,
    }
    options = {...defaultOptions,...options};
    if (options.allLowerCase) array = ObjectToLowerCase(array);
    if (options.removeInvalidChildren) array = RemoveInvalidChildren(array);
    if (options.removeWhitespace) array = DeepRemoveWhitespace(array);
    if (options.forceType) array= DeepConvertToType(array,options.forceType);
    if (options.removeAccents) array= RemoveAccents(array);
    if (options.shouldRemoveMultiYearData) array = RemoveMultipleYears(array,options.shouldRemoveMultiYearData);
    if (options.handleSynonyms === 'convert'){
        array = ConvertSynonyms(array);
    } else {throw new Error ('invalid option for handleSynonyms in stageOne')}
    if (options.dependentCombineMethod) array = ProcessDependents(array,options.dependentCombineMethod);
    if (options.addMissingCountries) array = AddMissingCountries(array);
    return array;
}