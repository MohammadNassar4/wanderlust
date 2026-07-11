import { loadingOverlay } from "./dashboard.js";
import { monthes } from "./publicHolidays.js";

export const currencyAmountInput = document.querySelector("#currency-amount");
export const currencyFromInput = document.querySelector("#currency-from");
export const currencyToInput = document.querySelector("#currency-to");
export const currencyBtn = document.querySelector("[data-view=currency]");
const popularCurrencies = document.querySelector("#popular-currencies");
const exchangeRateInfo = document.querySelector(".exchange-rate-info");
const conversionFrom = document.querySelector(".conversion-from");
const conversionTo = document.querySelector(".conversion-to");
export const convertBtn = document.querySelector("#convert-btn");
export const swapCurrenciesBtn = document.querySelector("#swap-currencies-btn");

export async function getLatestExchangeRate(code) {
  try {
    const request = await fetch(
      `https://v6.exchangerate-api.com/v6/2e250eb81a3b0685083c07b8/latest/${code}`,
    );

    const json = await request.json();
    displayLatestExchangeRate(json);
  } catch (error) {
    console.error(error);
  }
}

function displayLatestExchangeRate(data) {
  const rates = data.conversion_rates;
  const lastUpdate = new Date(data.time_last_update_utc);
  const month = monthes[lastUpdate.getMonth()];
  const dayNum = lastUpdate.getDate();
  const year = lastUpdate.getFullYear();

  // * display conversion
  conversionFrom.firstElementChild.innerText = currencyAmountInput.value;
  conversionFrom.lastElementChild.innerText = data.base_code;
  conversionTo.firstElementChild.innerText = (
    currencyAmountInput.value * data.conversion_rates[currencyToInput.value]
  ).toLocaleString();
  conversionTo.lastElementChild.innerText = currencyToInput.value;

  // * display exchange rate info
  exchangeRateInfo.firstElementChild.innerText = `1 ${data.base_code} = ${rates.EGP} EGP`;
  exchangeRateInfo.lastElementChild.innerText = `Last updated: ${month} ${dayNum}, ${year}`;

  // * display populat currencies exchange rate
  for (const currency of popularCurrencies.children) {
    currency.lastElementChild.innerText =
      rates[currency.children[1].firstElementChild.innerText];
  }
}

export async function getAvailableCurrencies() {
  try {
    loadingOverlay.classList.remove("hidden");
    const request = await fetch(
      `https://v6.exchangerate-api.com/v6/2e250eb81a3b0685083c07b8/codes`,
    );

    const json = await request.json();
    if (json.result === "success") {
      displayAvailableCurrencies(json.supported_codes);
    }
    getLatestExchangeRate("USD");
  } catch (error) {
    console.log(error);
  } finally {
    loadingOverlay.classList.add("hidden");
  }
}

function displayAvailableCurrencies(data) {
  let contentFrom = ``;
  for (const currency of data) {
    if (currency[0] === "USD") {
      contentFrom += `<option value="${currency[0]}" selected>${currency[0]} - ${currency[1]}</option>`;
    } else {
      contentFrom += `<option value="${currency[0]}">${currency[0]} - ${currency[1]}</option>`;
    }
  }

  currencyFromInput.innerHTML = contentFrom;

  let contentTo = ``;
  for (const currency of data) {
    if (currency[0] === "EGP") {
      contentTo += `<option value="${currency[0]}" selected>${currency[0]} - ${currency[1]}</option>`;
    } else {
      contentTo += `<option value="${currency[0]}">${currency[0]} - ${currency[1]}</option>`;
    }
  }

  currencyToInput.innerHTML = contentTo;
}

export async function convertCurrencies(from, to, amount) {
  try {
    loadingOverlay.classList.remove("hidden");
    const request = await fetch(
      `https://v6.exchangerate-api.com/v6/2e250eb81a3b0685083c07b8/pair/${from}/${to}/${amount}`,
    );
    const json = await request.json();
    displayConversionData(json)
  } catch (error) {
    console.log(error);
  } finally {
    loadingOverlay.classList.add("hidden");
  }
}

function displayConversionData(data) {
  const lastUpdate = new Date(data.time_last_update_utc);
  const month = monthes[lastUpdate.getMonth()];
  const dayNum = lastUpdate.getDate();
  const year = lastUpdate.getFullYear();

  // * display conversion
  conversionFrom.firstElementChild.innerText = currencyAmountInput.value;
  conversionFrom.lastElementChild.innerText = data.base_code;
  conversionTo.firstElementChild.innerText = (data.conversion_result).toLocaleString();
  conversionTo.lastElementChild.innerText = data.target_code;

  // * display exchange rate info
  exchangeRateInfo.firstElementChild.innerText = `1 ${data.base_code} = ${data.conversion_rate} ${data.target_code}`;
  exchangeRateInfo.lastElementChild.innerText = `Last updated: ${month} ${dayNum}, ${year}`;
}
