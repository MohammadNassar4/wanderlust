import { loadingOverlay, countrySelectTrigger } from "./dashboard.js";
import { savePlan, plans } from "./myPlans.js";

export const longWeekendBtn = document.querySelector(
  "a[data-view=long-weekends]",
);
const lwContent = document.querySelector("#lw-content");

export async function getLongWeekends(code, year) {
  try {
    loadingOverlay.classList.remove("hidden");
    let request = await fetch(
      `https://date.nager.at/api/v3/LongWeekend/${year}/${code}`,
    );
    let json = await request.json();
    displayWeekends(json);
  } catch (error) {
    console.error(error);
    lwContent.innerHTML = `
    <div class="country-info-placeholder">
        <div class="placeholder-icon error">
          <i data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
        </div>
        <p>Failed to load country weekends. Please try again.</p>
      </div>
    `;
  } finally {
    loadingOverlay.classList.add("hidden");
  }
}

function formatRange(startStr, endStr) {
  const parseLocal = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const start = parseLocal(startStr);
  const end = parseLocal(endStr);

  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });

  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

function getDayCards(weekend) {
  const parseLocal = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const start = parseLocal(weekend.startDate);
  const end = parseLocal(weekend.endDate);

  const days = [];
  const current = new Date(start);

  while (current <= end) {
    const dayNum = current.getDate();
    const dayName = current
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    const isoDate = current.toISOString().split("T")[0]; // for comparing against bridgeDays
    const dayOfWeek = current.getDay(); // 0 = Sun, 6 = Sat

    days.push({
      dayName, // "THU"
      dayNum, // 1
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isBridgeDay: weekend.bridgeDays.includes(isoDate),
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
}

function displayWeekends(data) {
  let content = ``;
  let count = 1;
  for (const weekend of data) {
    let c = false;
    let startDate = new Date(weekend.startDate);
    let endDate = new Date(weekend.startDate);
    let days = getDayCards(weekend);

    for (const plan of plans) {
      if (
        +plan.dayCount === +weekend.dayCount &&
        plan.dateRange === formatRange(weekend.startDate, weekend.endDate) &&
        plan.bridgeDay === weekend.needBridgeDay.toString() &&
        plan.number === count
      ) {
        c = true;
      }
    }

    content += `
    <div class="lw-card">
  <div class="lw-card-header">
    <span class="lw-badge">
      <i data-fa-i2svg=""><svg class="svg-inline--fa fa-calendar-days" aria-hidden="true"
          focusable="false" data-prefix="fas" data-icon="calendar-days" role="img" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512" data-fa-i2svg="">
          <path fill="currentColor"
            d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z">
          </path>
        </svg></i> ${weekend.dayCount} Days</span>
    <button class="holiday-action-btn ${c ? "saved" : ""}" 
    data-dayCount="${weekend.dayCount}" 
    data-dateRange="${formatRange(weekend.startDate, weekend.endDate)}" 
    data-bridgeDay="${weekend.needBridgeDay}"
    data-number="${count}"
    data-planType="Long Weekend"
    ><i data-fa-i2svg="">
      <svg class="svg-inline--fa fa-heart" aria-hidden="true"
          focusable="false" data-prefix="far" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512" data-fa-i2svg="">
          <path fill="currentColor"
            d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z">
          </path>
        </svg></i></button>
  </div>
  <h3>Long Weekend #${count}</h3>
  <div class="lw-dates"><i data-fa-i2svg="">
    <svg class="svg-inline--fa fa-calendar" aria-hidden="true" focusable="false"
        data-prefix="far" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
        data-fa-i2svg="">
        <path fill="currentColor"
          d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z">
        </path>
      </svg></i> ${formatRange(weekend.startDate, weekend.endDate)}</div>
  ${
    weekend.needBridgeDay
      ? `<div class="lw-info-box warning">
          <i data-fa-i2svg=""><svg class="svg-inline--fa fa-circle-info" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-info" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg></i>
          Requires taking a bridge day off
        </div>`
      : `<div class="lw-info-box success"><i data-fa-i2svg="">
    <svg class="svg-inline--fa fa-circle-check" aria-hidden="true"
        focusable="false" data-prefix="fas" data-icon="circle-check" role="img" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512" data-fa-i2svg="">
        <path fill="currentColor"
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z">
        </path>
      </svg></i> No extra days off needed!</div>`
  }
  <div class="lw-days-visual">
  ${days
    .map((day) => {
      if (day.isWeekend) {
        return `<div class="lw-day weekend"><span class="name">${day.dayName}</span><span class="num"> ${day.dayNum}</span></div>`;
      } else {
        return `<div class="lw-day"><span class="name">${day.dayName}</span><span class="num"> ${day.dayNum}</span></div>`;
      }
    })
    .join("")}
  </div>
</div>
    `;
    count++;
  }
  lwContent.innerHTML = content;
  lwContent.querySelectorAll(".holiday-action-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      savePlan(btn);
      btn.classList.add("saved");
    });
  });
}
