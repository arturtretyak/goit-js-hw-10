import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { debounce } from 'lodash';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refInput = document.querySelector('#search-box');
const refListCountry = document.querySelector('.country-list');
const refCountryInfo = document.querySelector('.country-info');

refInput.addEventListener('input', debounce(searchHandler, DEBOUNCE_DELAY));

function searchHandler(event) {
  const name = event.target.value.trim();
  if (!name) {
    refListCountry.innerHTML = '';
    refCountryInfo.innerHTML = '';
    return;
  }
  fetchCountries(name)
    .then(data => {
      if (data.length > 10) {
        refListCountry.innerHTML = '';
        refCountryInfo.innerHTML = '';
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        refCountryInfo.innerHTML = '';
        refListCountry.innerHTML = renderList(data);
      } else if (data.length === 1) {
        refListCountry.innerHTML = '';
        refCountryInfo.innerHTML = renderOneCountry(data);
      }
    })
    .catch(error => {
      refListCountry.innerHTML = '';
      refCountryInfo.innerHTML = '';
      Notify.failure('Oops, there is no country with that name');
      //   console.log(error);
    });
}

function renderList(arrCountry) {
  return arrCountry
    .map(
      country =>
        `<li style="display: flex; align-items: center; gap: 10px;">
      <img width="50" height="25" src="${country.flags.svg}"><p>${country.name.official}</p></li>`
    )
    .join('');
}
function renderOneCountry(arrCountry) {
  const country = arrCountry[0];
  return `<div style="display: flex; align-items: center; gap: 10px;">
                <img width="50" height="25" src="${country.flags.svg}">
                <b>${country.name.official}</b>
            </div>
            <ul style='list-style: none;'>
                <li style="display: flex; align-items: center; gap: 10px;"><b>Capital: </b><p>${
                  country.capital
                }</p></li>
                <li style="display: flex; align-items: center; gap: 10px;"><b>Population: </b><p>${
                  country.population
                }</p></li>
                <li style="display: flex; align-items: center; gap: 10px;"><b>Languages: </b><p>${Object.values(
                  country.languages
                ).join(', ')}</p></li>
            </ul>
            `;
}
