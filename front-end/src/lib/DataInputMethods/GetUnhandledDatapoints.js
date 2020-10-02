import GetCountries from './GetCountries';

export default function GetUnhandledDatapoints (array) {
    //this should only be called after other processing is done
    //it will return any datapoint that is not part of the countries master list
    const countriesMaster =GetCountries();
    return array.filter(arr=>!countriesMaster.includes(arr[0]));
}