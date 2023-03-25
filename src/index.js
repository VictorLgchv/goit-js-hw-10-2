import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import API from './fetchCountries';
const refs = {
  searchInputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.searchInputEl.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

function onInputChange(event) {
  event.preventDefault();
  const inputValue = event.target.value.trim();
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
  if (inputValue === '') {
    return;
  }
  
  callFetchCountry(inputValue);
}

function createCountryList(countries) {
  return countries
    .map(
      ({ name, flags }) =>
        `<li class="country-item"><img width="40" class="country-item__img" src="${flags.svg}" alt="${name.official}"><p class="country-item__text">${name.official}</p></li>`
    )
    .join('');
}

function renderCountryList(res) {
  refs.countryListEl.insertAdjacentHTML('beforeend', createCountryList(res));
}

function createCountryInfo(countries) {
  return countries
    .map(({ name, flags, capital, population, languages }) => {
      return `<div class="country-info__box"><img class="country-info__img" width="40" src="${
        flags.svg
      }" alt="${name.official}">
        <h3 class="country-info__title">${name.official}</h3>
        </div>
        <ul class="country-info__list">
          <li class="country-info__item">
            <p>Capital: ${capital}</p>
          </li>
          <li class="country-info__item">
            <p>Population: ${population}</p>
          </li>
          <li class="country-info__item">
            <p>Languages: ${Object.values(languages).join(', ')}</p>
          </li>
        </ul>`;
    })
    .join('');
}

function renderCountryInfo(res) {
  refs.countryInfoEl.insertAdjacentHTML('beforeend', createCountryInfo(res));
}

async function callFetchCountry(inputValue) {
  try {
    const response = await API.fetchCountries(inputValue);
    if (response.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      return;
    }
    if (response.length > 1) {
      // делаем список стран (иконка + название)
      renderCountryList(response);
      return;
    }
    // рендерим карточку страны
    renderCountryInfo(response);
  } catch (error) {
    Notify.failure('Oops, there is no country with that name');
    return;
  }
}
// 1. Создать независимую функцию fetchCountries(name).
// 2. Функцция должна возвращать промис с массивом стран.
// 3. Если функция возвращает промис с массивом с 10+ стран, то нужно вывести предупреждение Notify.info("Too many matches found. Please enter a more specific name.");.
// 4. Если функция возвращает промис с массивом <2 и >10 стран, то нужно вывести список стран с их флагом под текстовым полем.
// 5. Если функцция вернула промис с массивом, в котором всего 1 объект, то в интерфейсе отображается розметка карточки с данными про страну.
// 6. Если пользователь ввёл название страны, которой рне существует, то нужно уведомить его об этом Notify.failure("Oops, there is no country with that name");.
