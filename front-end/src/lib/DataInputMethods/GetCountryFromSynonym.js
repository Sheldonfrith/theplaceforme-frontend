import {useCallback} from 'react';
import GetSynonyms from './GetSynonyms';

const ifSynonymReturnCountry = useCallback(
    (name) => {
      let result = null;
      const countrySynonyms = GetSynonyms();
      Object.keys(countrySynonyms).forEach((country) => {
        countrySynonyms[country].forEach((synonym) => {
          if (synonym.toLowerCase() === name.toLowerCase()) {
            result = country;
          }
        });
      });
      console.log("looked for synonym  of ", name, " found ", result);
      return result;
    },
    [GetSynonyms]
  );