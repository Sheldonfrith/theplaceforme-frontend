import GetCountries from './GetCountries';

export default function AddMissingCountries(array,insertValue=''){
    const masterCountries = GetCountries();
    const existingCountries = array.map(arr=>arr[0])
    masterCountries.forEach(country =>{
        if (!existingCountries.includes(country))
        array.push([country,insertValue]);
    });
    return array;
}