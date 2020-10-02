import {useCallback} from 'react';
import GetDependents from './GetDependents';

export default function findParentCountry// returns the parent country name in lowercase or null if not found
    (name) {
      let result = null;
        const countryDependents = GetDependents();
      Object.keys(countryDependents).forEach((country) => {
        countryDependents[country].forEach((dependent) => {
          if (dependent.toLowerCase() === name.toLowerCase()) {
            result = country;
          }
        });
      });
      return result;
    }