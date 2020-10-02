import CountryDependents from "../CountryDependents.json";

export default function GetDependents(inLowerCase = true){
    if (!inLowerCase) return CountryDependents;
    return JSON.parse(JSON.stringify(CountryDependents).toLowerCase());
}