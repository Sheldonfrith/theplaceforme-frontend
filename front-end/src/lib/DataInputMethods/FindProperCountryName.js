import GetSynonyms from './GetSynonyms';
import GetCountries from './GetCountries';

export default function FindProperCountryName(synonym){//returns null if not found
    const synonyms = GetSynonyms();
    let matchedCountry = null;
    Object.keys(synonyms).forEach(properName=>{
        if (synonyms[properName].includes(synonym)){
            matchedCountry = properName;
        }
    })
    return matchedCountry;

}