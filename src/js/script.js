import makeCountryListMarkup from "../templates/countryListMarkup.hbs";
import makeCountryMarkup from "../templates/countryMarkup.hbs";
import { fetchCountries } from "./fetchCountries";

import { notice, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";

const refs = {
  search: document.querySelector("#search"),
  countryBox: document.querySelector("#country"),
  countryList: document.querySelector(".countryList"),
};

refs.countryList.addEventListener("click", onCountryClick);

function onCountryClick(e) {
  if (!e.target.classList.contains("country__list--name")) return;

  const searchQuery = e.target.dataset.name;

  fetchCountries(searchQuery).then((countries) => renderCountryCard(countries[0]));
}

refs.search.addEventListener("input", debounce(onSearch, 500));

function onSearch(e) {
  const query = e.target.value.trim();

  clearMarkup();

  if (!query) return;

  fetchCountries(query)
    .then(handleCountries)
    .catch(() => error({ text: "Country not found", delay: 1500 }));
}

function handleCountries(countries) {
  if (countries.length > 10) {
    notice({
      text: "Too many matches found. Please enter a more specific query!",
      delay: 1500,
    });
    return;
  }

  if (countries.length === 1) {
    renderCountryCard(countries[0]);
    return;
  }

  renderCountryList(countries);
}

function renderCountryList(countries) {
  refs.countryList.innerHTML = makeCountryListMarkup(countries);
}

function renderCountryCard(country) {
  const data = {
    title: country.name.common,
    capital: country.capital?.[0],
    population: country.population,
    flag: country.flags.svg,
    lang: Object.values(country.languages),
  };

  refs.countryBox.innerHTML = makeCountryMarkup(data);
}

function clearMarkup() {
  refs.countryList.innerHTML = "";
  refs.countryBox.innerHTML = "";
}
