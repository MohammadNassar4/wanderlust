import { countrySelect, showToast } from "./main.js";

const restCountriesAPIKey = "rc_live_0809d41cd9fe4e8d87034b58fe8b4069";
export const countrySelectTrigger = document.querySelector(
  ".custom-select-trigger",
);
export const countrySelectDropdown = document.querySelector(
  ".custom-select-dropdown",
);
const customSelectOptions = document.querySelector(".custom-select-options");
const searchCountryInput = document.querySelector("#search-countries");
const selectedDestination = document.querySelector("#selected-destination");
const selectedCountryFlag = document.querySelector("#selected-country-flag");
const selectedCountryName = document.querySelector("#selected-country-name");
const clearSelectionBtn = document.querySelector("#clear-selection-btn");
const globalSearchBtn = document.querySelector("#global-search-btn");
const dashboardCountryInfo = document.querySelector("#dashboard-country-info");
export const loadingOverlay = document.querySelector("#loading-overlay");
export const globalCity = document.querySelector("#global-city");
const loadingCity = document.querySelector(".loading-city");

// * handling the country selection field opening and closing
countrySelectTrigger.addEventListener("click", () => {
  countrySelectDropdown.classList.toggle("open");
  countrySelectTrigger.classList.toggle("open");
  searchCountryInput.focus();
});

// * handling the country selection
customSelectOptions.addEventListener("click", (e) => {
  let target = e.target.closest("div.custom-select-option");
  if (target.getAttribute("data-name") !== "Select Country") {
    countrySelectTrigger.children[0].innerHTML = `<img src="https://flagcdn.com/w40/${target.getAttribute("data-value").toLowerCase()}.png" alt="${target.getAttribute("data-name")}" class="flag-img" onerror="this.style.display='none'">`;
    countrySelectTrigger.children[1].innerHTML =
      target.getAttribute("data-name");
    countrySelectTrigger.children[1].classList.remove("placeholder");
    countrySelect.value = target.getAttribute("data-value");
    countrySelectDropdown.classList.remove("open");
    countrySelectTrigger.classList.remove("open");
    searchCountryInput.blur();

    selectedCountryFlag.src = `https://flagcdn.com/w80/${target.getAttribute("data-value").toLowerCase()}.png`;
    selectedCountryFlag.alt = target.getAttribute("data-name");
    selectedCountryName.innerText = target.getAttribute("data-name");
    selectedDestination.classList.remove("hidden");
    getCity(target.getAttribute("data-name").toLocaleLowerCase());
  }
});

// * handeling the selection clear
clearSelectionBtn.addEventListener("click", () => {
  selectedDestination.classList.add("hidden");
  countrySelectTrigger.children[0].innerHTML = "";
  countrySelectTrigger.children[1].innerHTML = "Select Country";
  countrySelectTrigger.children[1].classList.add("placeholder");
  countrySelect.value = "";
  dashboardCountryInfo.innerHTML = `
                <div class="country-info-placeholder">
                <div class="placeholder-icon">
                  <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas"
                      data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                      <path fill="currentColor"
                        d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z">
                      </path>
                    </svg></i>
                </div>
                <p>Select a country to view detailed information</p>
              </div>
  `;
  globalCity.innerHTML = `<option value="" selected="" disabled="">Select country first</option>`;
  showToast("info", "Selection cleared");
});

export let city;

async function getCity(country) {
  try {
    loadingCity.classList.remove("hidden");
    const capitalRes = await fetch(
      "https://countriesnow.space/api/v0.1/countries/capital",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      },
    );
    const capitalData = await capitalRes.json();
    const capital = capitalData.data.capital;

    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${capital}&count=1`,
    );
    const geoData = await geoRes.json();
    const { latitude, longitude } = geoData.results[0];

    city = { name, latitude, longitude };
    displayCapital(capital);
  } catch (error) {
    globalCity.innerHTML = `<option value="" selected="">No Capitals found</option>`;
    showToast("error", `Couldn't fetch the capital of ${country.slice(0,1).toUpperCase() + country.slice(1)}, Please try again.`);
  } finally {
    loadingCity.classList.add("hidden");
  }
}

function displayCapital(capital) {
  globalCity.innerHTML = `<option value="${capital}" selected="">${capital}</option>`;
}

export async function getAvailableCountries() {
  let request = await fetch("https://date.nager.at/api/v3/AvailableCountries");
  let json = await request.json();
  addCountriesToSelect(json);
  displayAvailableCountries(json);
}

function addCountriesToSelect(list) {
  for (const country of list) {
    countrySelect.innerHTML += `<option value="${country.countryCode}">${country.name}</option>`;
  }
}

function displayAvailableCountries(list) {
  let countries = ``;
  for (const country of list) {
    countries += `<div class="custom-select-option" data-value="${country.countryCode}" data-name="${country.name}">
                    <img src="https://flagcdn.com/w40/${country.countryCode.toLowerCase()}.png" alt="${country.countryCode}" class="flag-img" onerror="this.style.display='none'">
                    <span class="country-name">${country.name}</span>
                    <span class="country-code">${country.countryCode}</span>
                  </div>`;
  }
  customSelectOptions.innerHTML = countries;
}

// * handeling the country search input logic
searchCountryInput.addEventListener("input", () => {
  let term = searchCountryInput.value.trim().toLowerCase();
  let matches = ``;

  for (const option of countrySelect.children) {
    if (
      option.innerText.toLocaleLowerCase().includes(term) ||
      option.value.toLocaleLowerCase() === term
    ) {
      matches += `
        <div class="custom-select-option" data-value="${option.value}" data-name="${option.innerText}">
          <img src="https://flagcdn.com/w40/${option.value.toLowerCase()}.png" alt="${option.value}" class="flag-img" onerror="this.style.display='none'">
          <span class="country-name">${option.innerText}</span>
          <span class="country-code">${option.value}</span>
        </div>
      `;
    }
  }
  customSelectOptions.innerHTML = matches;
});

// * getting and displaying the selected country info
async function getCountryInfo(country) {
  try {
    loadingOverlay.classList.remove("hidden");
    let request = await fetch(
      `https://api.restcountries.com/countries/v5?q=${country}`,
      {
        headers: {
          Authorization: `Bearer ${restCountriesAPIKey}`,
        },
      },
    );

    let json = await request.json();
    if (json.data === undefined) throw(json);
    let data = json.data.objects.filter(
      (x) => x.names.common.toLocaleLowerCase() === country,
    );
    displayCountryInfo(data[0]);
  } catch (error) {
    dashboardCountryInfo.innerHTML = `
      <div class="country-info-placeholder">
        <div class="placeholder-icon error">
          <i data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
        </div>
        <p>Failed to load country information. Please try again.</p>
      </div>
    `;
    showToast("error", `Something went wrong!`);
    if (error.errors[0].message.includes("Account has been frozen")) console.log("Sorry my monthly REST Country API calls limit has been exceeded.");
    
  } finally {
    loadingOverlay.classList.add("hidden");
  }
}

function displayCountryInfo(data) {
  dashboardCountryInfo.innerHTML = `
              <div class="dashboard-country-header">
                <img src="https://flagcdn.com/w160/${data.codes.alpha_2.toLocaleLowerCase()}.png" alt="${data.names.common}" class="dashboard-country-flag">
                <div class="dashboard-country-title">
                  <h3 id="country-info-title">${data.names.common}</h3>
                  <p class="official-name">${data.names.official}</p>
                  <span class="region"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-location-dot" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg></i>${data.region} • ${data.subregion}</span>
                </div>
              </div>
              
              <div class="dashboard-local-time">
                <div class="local-time-display">
                  <i data-fa-i2svg=""><svg class="svg-inline--fa fa-clock" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path></svg></i>
                  <span class="local-time-value" id="country-local-time">${getCountryCurrentTime(data)}</span>
                  <span class="local-time-zone">${getCountryCurrentTime(data)}</span>
                </div>
              </div>
              
              <div class="dashboard-country-grid">
                <div class="dashboard-country-detail">
                  <i data-fa-i2svg=""><svg class="svg-inline--fa fa-building-columns" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="building-columns" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160v8c0 13.3 10.7 24 24 24H456c13.3 0 24-10.7 24-24v-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224H64V420.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512H480c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1V224H384V416H344V224H280V416H232V224H168V416H128V224zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></i>
                  <span class="label">Capital</span>
                  <span class="value">${data.capitals[0].name}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i data-fa-i2svg=""><svg class="svg-inline--fa fa-users" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="users" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"></path></svg></i>
                  <span class="label">Population</span>
                  <span class="value">${data.population.toLocaleString("en-US")}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i data-fa-i2svg=""><svg class="svg-inline--fa fa-ruler-combined" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ruler-combined" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M.2 468.9C2.7 493.1 23.1 512 48 512l96 0 320 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-48 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-48c0-26.5-21.5-48-48-48L48 0C21.5 0 0 21.5 0 48L0 368l0 96c0 1.7 .1 3.3 .2 4.9z"></path></svg></i>
                  <span class="label">Area</span>
                  <span class="value">${data.area.kilometers.toLocaleString("en-US")} km²</span>
                </div>
                <div class="dashboard-country-detail">
                  <i data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"></path></svg></i>
                  <span class="label">Continent</span>
                  ${data.continents[0]}
                </div>
                <div class="dashboard-country-detail">
                  <i data-fa-i2svg=""><svg class="svg-inline--fa fa-phone" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path></svg></i>
                  <span class="label">Calling Code</span>
                  <span class="value">+${data.calling_codes[0]}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i data-fa-i2svg=""><svg class="svg-inline--fa fa-car" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="car" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg></i>
                  <span class="label">Driving Side</span>
                  <span class="value">${data.cars.driving_side}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar-week" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-week" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm80 64c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16H368c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80z"></path></svg></i>
                  <span class="label">Week Starts</span>
                  <span class="value">${data.date.start_of_week}</span>
                </div>
              </div>
              
              <div class="dashboard-country-extras">
                <div class="dashboard-country-extra">
                  <h4><i data-fa-i2svg=""><svg class="svg-inline--fa fa-coins" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="coins" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M512 80c0 18-14.3 34.6-38.4 48c-29.1 16.1-72.5 27.5-122.3 30.9c-3.7-1.8-7.4-3.5-11.3-5C300.6 137.4 248.2 128 192 128c-8.3 0-16.4 .2-24.5 .6l-1.1-.6C142.3 114.6 128 98 128 80c0-44.2 86-80 192-80S512 35.8 512 80zM160.7 161.1c10.2-.7 20.7-1.1 31.3-1.1c62.2 0 117.4 12.3 152.5 31.4C369.3 204.9 384 221.7 384 240c0 4-.7 7.9-2.1 11.7c-4.6 13.2-17 25.3-35 35.5c0 0 0 0 0 0c-.1 .1-.3 .1-.4 .2l0 0 0 0c-.3 .2-.6 .3-.9 .5c-35 19.4-90.8 32-153.6 32c-59.6 0-112.9-11.3-148.2-29.1c-1.9-.9-3.7-1.9-5.5-2.9C14.3 274.6 0 258 0 240c0-34.8 53.4-64.5 128-75.4c10.5-1.5 21.4-2.7 32.7-3.5zM416 240c0-21.9-10.6-39.9-24.1-53.4c28.3-4.4 54.2-11.4 76.2-20.5c16.3-6.8 31.5-15.2 43.9-25.5V176c0 19.3-16.5 37.1-43.8 50.9c-14.6 7.4-32.4 13.7-52.4 18.5c.1-1.8 .2-3.5 .2-5.3zm-32 96c0 18-14.3 34.6-38.4 48c-1.8 1-3.6 1.9-5.5 2.9C304.9 404.7 251.6 416 192 416c-62.8 0-118.6-12.6-153.6-32C14.3 370.6 0 354 0 336V300.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 342.6 135.8 352 192 352s108.6-9.4 148.1-25.9c7.8-3.2 15.3-6.9 22.4-10.9c6.1-3.4 11.8-7.2 17.2-11.2c1.5-1.1 2.9-2.3 4.3-3.4V304v5.7V336zm32 0V304 278.1c19-4.2 36.5-9.5 52.1-16c16.3-6.8 31.5-15.2 43.9-25.5V272c0 10.5-5 21-14.9 30.9c-16.3 16.3-45 29.7-81.3 38.4c.1-1.7 .2-3.5 .2-5.3zM192 448c56.2 0 108.6-9.4 148.1-25.9c16.3-6.8 31.5-15.2 43.9-25.5V432c0 44.2-86 80-192 80S0 476.2 0 432V396.6c12.5 10.3 27.6 18.7 43.9 25.5C83.4 438.6 135.8 448 192 448z"></path></svg></i> Currency</h4>
                  <div class="extra-tags">
                    <span class="extra-tag">${data.currencies[0].name} (${data.currencies[0].code} ${data.currencies[0].symbol})</span>
                  </div>
                </div>
                <div class="dashboard-country-extra">
                  <h4><i data-fa-i2svg=""><svg class="svg-inline--fa fa-language" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="language" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M0 128C0 92.7 28.7 64 64 64H256h48 16H576c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H320 304 256 64c-35.3 0-64-28.7-64-64V128zm320 0V384H576V128H320zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-64 144c-4.5 10.1 .1 21.9 10.2 26.4s21.9-.1 26.4-10.2l8.9-20.1h73.6l8.9 20.1c4.5 10.1 16.3 14.6 26.4 10.2s14.6-16.3 10.2-26.4l-64-144zM160 233.2L179 276H141l19-42.8zM448 164c11 0 20 9 20 20v4h44 16c11 0 20 9 20 20s-9 20-20 20h-2l-1.6 4.5c-8.9 24.4-22.4 46.6-39.6 65.4c.9 .6 1.8 1.1 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.9 27.4s-18 12.5-27.4 6.9l-18.9-11.3c-4.5-2.7-8.8-5.5-13.1-8.5c-10.6 7.5-21.9 14-34 19.4l-3.6 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-6.1 18.5-9.8l-12.2-12.2c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l14.6 14.6 .5 .5c12.4-13.1 22.5-28.3 29.8-45H448 376c-11 0-20-9-20-20s9-20 20-20h52v-4c0-11 9-20 20-20z"></path></svg></i> Languages</h4>
                  <div class="extra-tags">
                    ${data.languages
                      .map((l) => `<span class="extra-tag">${l.name}</span>`)
                      .join("")}
                  </div>
                </div>
                <div class="dashboard-country-extra">
                  <h4><i data-fa-i2svg=""><svg class="svg-inline--fa fa-map-location-dot" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path></svg></i> Neighbors</h4>
                  <div class="extra-tags">
                    ${data.borders
                      .map((c) => `<span class="extra-tag">${c}</span>`)
                      .join("")}
                  </div>
                </div>
              </div>
              
              <div class="dashboard-country-actions">
                <a href="${data.links.google_maps}" target="_blank" class="btn-map-link">
                  <i data-fa-i2svg=""><svg class="svg-inline--fa fa-map" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M384 476.1L192 421.2V35.9L384 90.8V476.1zm32-1.2V88.4L543.1 37.5c15.8-6.3 32.9 5.3 32.9 22.3V394.6c0 9.8-6 18.6-15.1 22.3L416 474.8zM15.1 95.1L160 37.2V423.6L32.9 474.5C17.1 480.8 0 469.2 0 452.2V117.4c0-9.8 6-18.6 15.1-22.3z"></path></svg></i> View on Google Maps
                </a>
              </div>
`;
}

// * adding an event to the explore btn to get and display country info
globalSearchBtn.addEventListener("click", () => {
  let country = countrySelectTrigger.children[1].innerText;
  if (country !== "Select Country") {
    showToast("success", `Exploring ${country}!`);
    getCountryInfo(country.toLocaleLowerCase());
  } else {
    showToast("info", "Please select a country first");
  }
});

function getCountryCurrentTime(countryObj) {
  const tzString = countryObj.timezones[0]; // e.g. "UTC+02:00"
  const match = tzString.match(/UTC([+-])(\d{2}):(\d{2})/);
  const sign = match[1] === "+" ? 1 : -1;
  const offsetMinutes = sign * (parseInt(match[2]) * 60 + parseInt(match[3]));

  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000; // true UTC ms
  const countryTimeMs = utcMs + offsetMinutes * 60000;
  const countryDate = new Date(countryTimeMs);

  return countryDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

