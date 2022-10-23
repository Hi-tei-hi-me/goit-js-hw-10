'use strict';

import Notiflix from 'notiflix';

export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      Notiflix.Notify.failure(
        `Oops! Minions can't find anything for you. They are sorry!`
      );
      throw new Error(response.status);
    }
    return response.json();
  });
}
