import {
  getAvailableCountries,
  countrySelectDropdown,
  countrySelectTrigger,
  globalCity,
  city,
} from "./dashboard.js";
import {
  getPublicHolidays,
  updateCurrentBadge,
  monthes,
} from "./publicHolidays.js";
import { longWeekendBtn, getLongWeekends } from "./longWeekend.js";
import { weatherBtn, weatherContent, getWeather, days } from "./weather.js";
import { sunTimesBtn, getSunTimes } from "./sunTimes.js";
import { eventsBtn, getEvents } from "./events.js";
import {
  currencyBtn,
  getLatestExchangeRate,
  getAvailableCurrencies,
  convertBtn,
  convertCurrencies,
  currencyAmountInput,
  currencyFromInput,
  currencyToInput,
  swapCurrenciesBtn,
} from "./currency.js";
import { myPlansBtn, displayPlans, plans } from "./myPlans.js";

const sidebar = document.querySelector("#sidebar");
const sidebarOverlay = document.querySelector("#sidebar-overlay");
const sidebarToggler = document.querySelector("#mobile-menu-btn");
const sections = document.querySelector("#main-content");
const nav = document.querySelector(".sidebar-nav");
const navItems = document.querySelectorAll(".nav-item");
export const countrySelect = document.querySelector("#global-country");
export const yearSelect = document.querySelector("#global-year");
const publicHolidaysBtn = document.querySelector("a[data-view=holidays]");
const currentDateTime = document.querySelector("#current-datetime");
const toastContainer = document.querySelector("#toast-container");

function displayCurrentDateTime() {
  const now = new Date();
  currentDateTime.innerText = `${days[now.getDay()].slice(0, 3)}, ${monthes[now.getMonth()].slice(0, 3)} ${now.getDate()}, ${now.getHours() === 0 ? "12" : now.getHours() > 12 ? now.getHours() - 12 : now.getHours()}:${now.getMinutes()} ${now.getHours() > 12 ? "PM" : "AM"}`;
}
displayCurrentDateTime();
setInterval(() => {
  displayCurrentDateTime();
}, 10000);

sidebarToggler.addEventListener("click", () => {
  sidebar.style.transform = "translateX(0)";
  sidebarOverlay.classList.remove("hidden");
  sidebarOverlay.classList.add("active");
});

sidebarOverlay.addEventListener("click", () => {
  sidebar.style.removeProperty("transform");
  sidebarOverlay.classList.add("hidden");
  sidebarOverlay.classList.remove("active");
});

nav.addEventListener("click", (e) => {
  try {
    let target = e.target.closest("a.nav-item");
    if (target === null) {
      throw new Error();
    }

    // * set active tab
    for (const item of navItems) {
      if (item === target) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    }

    // * go to selected section
    for (const section of sections.children) {
      if (section.id.includes(target.getAttribute("data-view"))) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    }
  } catch (error) {
    // do nothing
  }
});

export function navigateTo(sec) {
  for (const item of navItems) {
    if (item.getAttribute("data-view") == sec) {
      item.click();
    }
  }
}

getAvailableCountries();

// * handling the holidays section
publicHolidaysBtn.addEventListener("click", () => {
  if (countrySelect.value !== "") {
    getPublicHolidays(countrySelect.value, yearSelect.value);
  }
  updateCurrentBadge();
});

// * handling the long weekend section
longWeekendBtn.addEventListener("click", () => {
  if (countrySelect.value !== "") {
    getLongWeekends(countrySelect.value, yearSelect.value);
  }
  updateCurrentBadge();
});

document.addEventListener("click", (e) => {
  const target = e.target;
  if (
    target.closest(".custom-select-dropdown") !== countrySelectDropdown &&
    target.closest(".custom-select-trigger") !== countrySelectTrigger
  ) {
    countrySelectDropdown.classList.remove("open");
    countrySelectTrigger.classList.remove("open");
  }
});

weatherBtn.addEventListener("click", () => {
  if (globalCity.value !== "") {
    getWeather(city.latitude, city.longitude);
  }
  updateCurrentBadge(globalCity.value);
});

sunTimesBtn.addEventListener("click", () => {
  if (globalCity.value !== "") {
    getSunTimes(city.latitude, city.longitude);
  }
  updateCurrentBadge(globalCity.value);
});

eventsBtn.addEventListener("click", () => {
  if (globalCity.value !== "" && countrySelect.value !== "") {
    getEvents(globalCity.value);
  }
  updateCurrentBadge(globalCity.value);
});

currencyBtn.addEventListener("click", () => {
  getAvailableCurrencies();
});

convertBtn.addEventListener("click", () => {
  if (currencyAmountInput.value !== "") {
    convertCurrencies(
      currencyFromInput.value,
      currencyToInput.value,
      currencyAmountInput.value,
    );
  }
});

swapCurrenciesBtn.addEventListener("click", () => {
  [currencyFromInput.value, currencyToInput.value] = [
    currencyToInput.value,
    currencyFromInput.value,
  ];
});

myPlansBtn.addEventListener("click", () => {
  displayPlans(plans);
});


export function showToast(type, message) {
  const toast = document.createElement('div');
  toast.classList.add("toast");

  const messageSpan = document.createElement('span');
  messageSpan.innerText = message;

  const icon = document.createElement('i');

  if (type === "success") {
    toast.classList.add("success");
    icon.classList.add('fa-solid', 'fa-circle-check')
  } else if (type === "info") {
    toast.classList.add("info");
    icon.classList.add('fa-solid', 'fa-circle-info')
  } else if (type === "error") {
    toast.classList.add("error");
    icon.classList.add('fa-solid', 'fa-circle-xmark')
  }

  const closeToast = document.createElement('button');
  closeToast.classList.add("toast-close");
  closeToast.innerHTML = "&times;";
  closeToast.addEventListener('click', (e)=> {
    e.target.closest('.toast').remove();
  })

  toast.appendChild(icon)
  toast.appendChild(messageSpan)
  toast.appendChild(closeToast)
  toastContainer.appendChild(toast);
  
  let timerId = setTimeout(() => {
    toast.remove();
  }, 5000);
}