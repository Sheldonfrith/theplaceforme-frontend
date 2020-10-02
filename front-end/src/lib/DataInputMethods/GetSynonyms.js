import CountrySynonyms from "../CountrySynonyms.json";

export default function GetDependents(inLowerCase = true){
    if (!inLowerCase) return CountrySynonyms;
    return JSON.parse(JSON.stringify(CountrySynonyms).toLowerCase());
}