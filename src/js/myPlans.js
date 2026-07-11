import { showToast, navigateTo } from "./main.js";

export let plans = [];
let holidays = [];
let events = [];
let longWeekends = [];
let ids = [1];

const plansContent = document.querySelector("#plans-content");
export const myPlansBtn = document.querySelector("[data-view=my-plans]");
const plansCount = document.querySelector("#plans-count");
const clearAllPlansBtn = document.querySelector("#clear-all-plans-btn");
const filterAllCount = document.querySelector("#filter-all-count");
const filterHolidayCount = document.querySelector("#filter-holiday-count");
const filterEventCount = document.querySelector("#filter-event-count");
const filterLWCount = document.querySelector("#filter-lw-count");
const plansFilters = document.querySelector(".plans-filter-bar");
const statSaved = document.querySelector("#stat-saved");

if (localStorage.getItem("plans")) {
  plans = JSON.parse(localStorage.getItem("plans"));
  updateCategories();
  if (plans.length !== 0) {
    plansCount.classList.remove("hidden");
    plansCount.innerText = plans.length;
  }
}

if (localStorage.getItem("plansId")) {
  ids = JSON.parse(localStorage.getItem("plansId"));
}

export function savePlan(element) {
  let plan;
  if (element.getAttribute("data-planType") === "HOLIDAY") {
    for (const plan of plans) {
      let elementDate = `${element.getAttribute("data-month")[0] + element.getAttribute("data-month").slice(1).toLowerCase()} ${element.getAttribute("data-dayNum")}, ${element.getAttribute("data-year")}`;
      if (
        plan.type === element.getAttribute("data-planType") &&
        plan.name === element.getAttribute("data-holidayLocalName") &&
        plan.englishName === element.getAttribute("data-holidayName") &&
        plan.date === elementDate
      ) {
        showToast("info", "Already saved!");
        return;
      }
    }

    plan = {
      type: element.getAttribute("data-planType"),
      date: `${element.getAttribute("data-month")[0] + element.getAttribute("data-month").slice(1).toLowerCase()} ${element.getAttribute("data-dayNum")}, ${element.getAttribute("data-year")}`,
      name: element.getAttribute("data-holidayLocalName"),
      englishName: element.getAttribute("data-holidayName"),
      id: generateID(),
    };
  } else if (element.getAttribute("data-planType") === "Long Weekend") {
    for (const plan of plans) {
      if (
        plan.type === element.getAttribute("data-planType") &&
        plan.dayCount === element.getAttribute("data-dayCount") &&
        plan.dateRange === element.getAttribute("data-dateRange") &&
        plan.number === +element.getAttribute("data-number") &&
        plan.bridgeDay === element.getAttribute("data-bridgeDay")
      ) {
        showToast("info", "Already saved!");
        return;
      }
    }

    plan = {
      type: element.getAttribute("data-planType"),
      dateRange: element.getAttribute("data-dateRange"),
      dayCount: element.getAttribute("data-dayCount"),
      bridgeDay: element.getAttribute("data-bridgeDay"),
      number: +element.getAttribute("data-number"),
      id: generateID(),
    };
  } else if (element.getAttribute("data-planType") === "EVENT") {
    for (const plan of plans) {
      if (
        plan.type === element.getAttribute("data-planType") &&
        plan.name === element.getAttribute("data-name") &&
        plan.date === element.getAttribute("data-date") &&
        plan.location === element.getAttribute("data-location")
      ) {
        showToast("info", "Already saved!");
        return;
      }
    }

    plan = {
      type: element.getAttribute("data-planType"),
      name: element.getAttribute("data-name"),
      date: element.getAttribute("data-date"),
      location: element.getAttribute("data-location"),
      id: generateID(),
    };
  }

  plans.push(plan);
  localStorage.setItem("plans", JSON.stringify(plans));

  plansCount.classList.remove("hidden");
  plansCount.innerText = plans.length;

  updateCategories();
  showToast("success", "Saved to My Plans!");
}

export function displayPlans(plans) {
  let id = 0;
  let content = ``;

  if (plans.length === 0) {
    plansContent.innerHTML = `
    <div class="empty-state">
        <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-heart-crack" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart-crack" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M119.4 44.1c23.3-3.9 46.8-1.9 68.6 5.3l49.8 77.5-75.4 75.4c-1.5 1.5-2.4 3.6-2.3 5.8s1 4.2 2.6 5.7l112 104c2.9 2.7 7.4 2.9 10.5 .3s3.8-7 1.7-10.4l-60.4-98.1 90.7-75.6c2.6-2.1 3.5-5.7 2.4-8.8L296.8 61.8c28.5-16.7 62.4-23.2 95.7-17.6C461.5 55.6 512 115.2 512 185.1v5.8c0 41.5-17.2 81.2-47.6 109.5L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9L47.6 300.4C17.2 272.1 0 232.4 0 190.9v-5.8c0-69.9 50.5-129.5 119.4-141z"></path></svg></i></div>
        <h3>No Saved Plans Yet</h3>
        <p>Start exploring and save holidays, events, or long weekends you like!</p>
        <button class="btn-primary p-to-dashboard">
          <i data-fa-i2svg=""><svg class="svg-inline--fa fa-compass" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="compass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
          Start Exploring
        </button>
      </div>
    `;

    document.querySelector(".p-to-dashboard").addEventListener("click", () => {
      navigateTo("dashboard");
    });
    return;
  }

  for (const plan of plans) {
    if (plan.type === "HOLIDAY") {
      content += `
      <div class="plan-card">
        <span class="plan-card-type holiday">Holiday</span>
        <div class="plan-card-content">
          
        <h4>${plan.name}</h4>
        <div class="plan-card-details">
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"></path></svg></i>${plan.date}</div>
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-circle-info" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-info" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></i>${plan.englishName}</div>
        </div>
      
          <div class="plan-card-actions">
            <button class="btn-plan-remove" onclick="removePlan(${plan.id})">
              <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></i> Remove
            </button>
          </div>
        </div>
      </div>
      `;
    } else if (plan.type === "Long Weekend") {
      content += `
      <div class="plan-card">
        <span class="plan-card-type longweekend">Long Weekend</span>
        <div class="plan-card-content">
          
        <h4>${plan.dayCount} Days Long Weekend</h4>
        <div class="plan-card-details">
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"></path></svg></i>${plan.dateRange}</div>
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-circle-info" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-info" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></i>${plan.bridgeDay ? "Bridge day needed" : "No extra days needed"}</div>
        </div>
      
          <div class="plan-card-actions">
            <button class="btn-plan-remove" onclick="removePlan(${plan.id})">
              <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></i> Remove
            </button>
          </div>
        </div>
      </div>
      `;
    } else if (plan.type === "EVENT") {
      content += `
      <div class="plan-card">
        <span class="plan-card-type event">Event</span>
        <div class="plan-card-content">
          
        <h4>${plan.name}</h4>
        <div class="plan-card-details">
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"></path></svg></i>${plan.date}</div>
          <div><i data-fa-i2svg=""><svg class="svg-inline--fa fa-location-dot" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg></i>${plan.location}</div>
        </div>
      
          <div class="plan-card-actions">
            <button class="btn-plan-remove" onclick="removePlan(${plan.id})">
              <i data-fa-i2svg=""><svg class="svg-inline--fa fa-trash" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></i> Remove
            </button>
          </div>
        </div>
      </div>
      `;
    }
  }
  plansContent.innerHTML = content;
}

window.removePlan = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#EF4444",
    cancelButtonColor: "#5A687D",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      for (let i = 0; i < plans.length; i++) {
        if (plans[i].id === id) {
          plans.splice(i, 1);
          localStorage.setItem("plans", JSON.stringify(plans));
          displayPlans(plans);
        }
      }
      for (let i = 0; i < ids.length; i++) {
        if (id === ids[i]) {
          ids.splice(i, 1);
          localStorage.setItem("plansId", JSON.stringify(ids));
        }
      }
      plans.length === 0
        ? plansCount.classList.add("hidden")
        : (plansCount.innerText = plans.length);
      updateCategories();
      Swal.fire({
        title: "Removed!",
        text: "The plan has been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: !1,
      });
    }
  });
};

function getRandomNumber() {
  return Math.round(Math.random() * 100000000);
}

function generateID() {
  let randomNumber;
  let c = true;
  while (c) {
    randomNumber = getRandomNumber();
    for (const item of ids) {
      if (item === randomNumber) {
        c = true;
      } else {
        c = false;
        ids.push(randomNumber);
        localStorage.setItem("plansId", JSON.stringify(ids));
        return randomNumber;
      }
    }
  }
}

clearAllPlansBtn.addEventListener("click", () => {
  if (plans.length === 0) {
    Swal.fire({
      title: "No Plans",
      text: "There are no saved plans to clear.",
      icon: "info",
      confirmButtonColor: "#3b82f6",
    });
    return;
  }
  Swal.fire({
    title: "Clear All Plans?",
    text: "This will permanently delete all your saved plans. This action cannot be undone!",
    icon: "warning",
    showCancelButton: !0,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, clear all!",
    cancelButtonText: "Cancel",
  }).then((e) => {
    if (e.isConfirmed) {
      plans = [];
      ids = [1];
      localStorage.setItem("plans", JSON.stringify(plans));
      localStorage.setItem("plansId", JSON.stringify(ids));
      plansCount.classList.add("hidden");
      plansCount.innerText = 0;
      displayPlans(plans);
      Swal.fire({
        title: "Cleared!",
        text: "All your plans have been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: !1,
      });
    }
    updateCategories();
  });
});

function updateCategories() {
  filterAllCount.innerText = plans.length;
  statSaved.innerText = plans.length;
  holidays = [];
  events = [];
  longWeekends = [];
  filterHolidayCount.innerText = holidays.length;
  filterLWCount.innerText = longWeekends.length;
  filterEventCount.innerText = events.length;
  if (plans.length) {
    for (const plan of plans) {
      if (plan.type === "HOLIDAY") {
        holidays.push(plan);
        filterHolidayCount.innerText = holidays.length;
      } else if (plan.type === "Long Weekend") {
        longWeekends.push(plan);
        filterLWCount.innerText = longWeekends.length;
      } else if (plan.type === "EVENT") {
        events.push(plan);
        filterEventCount.innerText = events.length;
      }
    }
  } else {
    filterHolidayCount.innerText = holidays.length;
    filterLWCount.innerText = longWeekends.length;
    filterEventCount.innerText = events.length;
  }
}

plansFilters.addEventListener("click", (e) => {
  let target = e.target.closest("button.plan-filter");

  try {
    if (target.getAttribute("data-filter") === "all") {
      displayPlans(plans);
    } else if (target.getAttribute("data-filter") === "holiday") {
      displayPlans(holidays);
    } else if (target.getAttribute("data-filter") === "event") {
      displayPlans(events);
    } else if (target.getAttribute("data-filter") === "longweekend") {
      displayPlans(longWeekends);
    }

    for (const filter of plansFilters.children) {
      if (target === filter) {
        filter.classList.add("active");
      } else {
        filter.classList.remove("active");
      }
    }
  } catch (error) {
    // do nothing
  }
});
