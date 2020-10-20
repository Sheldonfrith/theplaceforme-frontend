import CountryNamesMaster from "../CountryNamesMaster.json";
import { getRequest } from "../HTTP";


export default function GetCountries(inLowerCase = true){
    if (!inLowerCase) return CountryNamesMaster;
    return JSON.parse(JSON.stringify(CountryNamesMaster).toLowerCase());
    // const countries = await getRequest('/countries');
    // const formattedList = await countries.map(obj=>{
    //     return obj['primary_name'];
    // });
    // return formattedList;
}