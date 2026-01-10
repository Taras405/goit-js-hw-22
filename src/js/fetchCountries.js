const BASE_URL = "https://restcountries.com/v3.1";

export const fetchCountries = (searchQuery) => {
  return fetch(`${BASE_URL}/name/${searchQuery}?fields=name,capital,population,flags,languages`)
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    });
};
