import CountryNamesMaster from "../CountryNamesMaster.json";

export default function GetDependents(inLowerCase = true){
    if (!inLowerCase) return CountryNamesMaster;
    return JSON.parse(JSON.stringify(CountryNamesMaster).toLowerCase());
}