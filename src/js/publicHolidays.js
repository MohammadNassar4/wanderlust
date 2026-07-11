import { countrySelect, navigateTo, yearSelect } from "./main.js";
import { loadingOverlay, countrySelectTrigger, city } from "./dashboard.js";
import { savePlan, plans } from "./myPlans.js";

const toDashboard = document.querySelectorAll(".to-dashboard");
const holidaysContent = document.querySelector("#holidays-content");
const baseURL = "https://date.nager.at/api/v3/PublicHolidays/";
const currentSelectionBadges = document.querySelectorAll(
  ".current-selection-badge",
);


export const monthes = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function getPublicHolidays(code, year) {
  try {
    loadingOverlay.classList.remove("hidden");
    let request = await fetch(`${baseURL}${year}/${code}`);
    let json = await request.json();
    displayHolidays(json);

  } catch (error) {
    console.error(error);
    holidaysContent.innerHTML = `
    <div class="country-info-placeholder">
        <div class="placeholder-icon error">
          <i data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
        </div>
        <p>Failed to load country information. Please try again.</p>
      </div>
    `;
  } finally {
    loadingOverlay.classList.add("hidden");
  }
}

toDashboard.forEach((btn) => {
  btn.addEventListener("click", () => {
    navigateTo("dashboard");
  });
});

function displayHolidays(data) {
  let content = "";
  let date;
  for (const day of data) {
    let c = false;
    date = new Date(day.date);
    const dayNum = +day.date.slice(8);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const year = date.getFullYear();
    const month = monthes[date.getMonth()].slice(0, 3);

    for (const plan of plans) {
      if (
        plan.name === day.localName &&
        plan.englishName === day.name &&
        plan.date === `${month} ${dayNum}, ${year}`
      ) {
        c = true;
      }
    }

    content += `
    <div class="holiday-card">
      <div class="holiday-card-header">
        <div class="holiday-date-box"><span class="day">${dayNum}</span><span class="month">${month}</span></div>
        <button class="holiday-action-btn ${c ? "saved" : ""}" data-planType="HOLIDAY" data-month="${month}" data-holidayLocalName="${day.localName}" data-holidayName="${day.name}" data-year="${year}" data-dayNum="${dayNum}"><i class="fa-regular fa-heart"></i></button>
      </div>
      <h3>${day.localName}</h3>
      <p class="holiday-name">${day.name}</p>
      <div class="holiday-card-footer">
        <span class="holiday-day-badge"><i class="fa-regular fa-calendar"></i>${dayName}</span>
        <span class="holiday-type-badge">${day.types[0]}</span>
      </div>
    </div>
    `;
  }
  holidaysContent.innerHTML = content;
  holidaysContent.querySelectorAll(".holiday-action-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      savePlan(btn);
      btn.classList.add("saved");
    });
  });
}

export function updateCurrentBadge(x) {
  if (countrySelect.value === "" || countrySelect.value === "Select Country") {
    currentSelectionBadges.forEach((badge) => {
      badge.closest(".view-header-selection").classList.add("hidden");
    })
  } else {
    currentSelectionBadges.forEach((badge) => {
      badge.closest(".view-header-selection").classList.remove("hidden");
      badge.children[0].src =
        countrySelectTrigger.children[0].children[0].src || "";
      badge.children[1].innerText = countrySelectTrigger.children[1].innerText;
      badge.children[2].innerText = x === undefined ? yearSelect.value : x;
    });
  }
}
