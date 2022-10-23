'use strict';

import '../css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputRef: document.querySelector('#search-box'),
  countryListRef: document.querySelector('.country-list'),
  countryInfoRef: document.querySelector('.country-info'),
};

refs.inputRef.addEventListener(
  'input',
  debounce(countryNameInputing, DEBOUNCE_DELAY)
);

function countryNameInputing(event) {
  const inputText = event.target.value;
  const normalizedText = inputText.trim().toLowerCase();

  if (normalizedText === '') {
    refs.countryListRef.style.display = 'none';
    refs.countryInfoRef.style.display = 'none';
    return;
  } else {
    fetchCountries(normalizedText)
      .then(countries => {
        const countryFilter = countries.filter(({ name: { common } }) =>
          common.toLowerCase().includes(normalizedText)
        );
        if (countryFilter.length > 10) {
          refs.countryListRef.style.display = 'none';
          refs.countryInfoRef.style.display = 'none';
          Notiflix.Notify.warning(
            `Minions found too many variants for you. Please add more letters to request`
          );
        }
        if (countryFilter.length > 1 && countryFilter.length <= 10) {
          refs.countryListRef.style.display = 'block';
          refs.countryListRef.innerHTML = renderListOfCountries(countryFilter);
          refs.countryInfoRef.style.display = 'none';
          Notiflix.Notify.success(`Look what minions found for you!`);
          return;
        }

        if (countryFilter.length === 1) {
          refs.countryListRef.style.display = 'none';
          refs.countryInfoRef.style.display = 'block';
          refs.countryInfoRef.innerHTML = showCountryInfo(countryFilter[0]);
          Notiflix.Notify.info(`Gotcha!`);
          return;
        }

        if (countryFilter.length === 0) {
          refs.countryListRef.style.display = 'none';
          refs.countryInfoRef.style.display = 'none';
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}

function renderListOfCountries(countries) {
  return countries
    .map(
      ({
        name: { official },
        flags: { svg },
      }) => /*html*/ `<li class="list_country">
  		<img src="${svg}" alt="${official}" class="list_country-flag"/>
  		<p>${official}</p></li>`
    )
    .join('');
}

function showCountryInfo({
  flags: { svg },
  name: { official },
  capital,
  population,
  languages,
}) {
  const lang = Object.values(languages).join(', ');
  return /*html*/ `<div>
  <div class="header"><img src="${svg}" alt="${official}" class="country-flag"/>
  <h2>${official}</h2></div>
  <p><b>Capital:</b> ${capital}</p>
  <p><b>Population:</b> ${population}</p>
  <p><b>Languages:</b> ${lang}</p></div>`;
}
