const BASE_URL = 'https://restcountries.com/v3.1';

async function fetchCountries(name) {
  const resp = await fetch(`${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`);
  const newCountry = await resp.json();
  return newCountry;
}

export default { fetchCountries };