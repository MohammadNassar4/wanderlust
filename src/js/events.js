import { loadingOverlay } from "./dashboard.js";
import { monthes } from "./publicHolidays.js";
import { savePlan, plans } from "./myPlans.js";

export const eventsBtn = document.querySelector("[data-view=events]");
const eventsContent = document.querySelector("#events-content");

export async function getEvents(city) {
  try {
    loadingOverlay.classList.remove("hidden");
    const request = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y&city=${city}&size=20`,
    );

    let json = await request.json();

    if (json._embedded === undefined) {
      throw new Error("empty");
    }

    displayEvents(json._embedded.events);
  } catch (error) {
    if (error.message === "empty") {
      eventsContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-ticket" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ticket" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"></path></svg></i></div>
        <h3>No Events Found</h3>
        <p>No events found for this location</p>
      </div>
      `;
    } else {
      eventsContent.innerHTML = `
            <div class="country-info-placeholder">
              <div class="placeholder-icon error">
                <i data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
              </div>
              <p>Failed to load events. Please try again in a few seconds.</p>
            </div>
      `;
    }
  } finally {
    loadingOverlay.classList.add("hidden");
  }
}

function displayEvents(events) {
  let content = ``;

  for (const event of events) {
    const date = new Date(event.dates.start.localDate);
    const month = monthes[date.getMonth()].slice(0, 3);
    const dayNum = date.getDate();
    const year = date.getFullYear();
    const time = event.dates.start.localTime?.slice(0, 5) || "Unknown";
    let c = false;

    for (const plan of plans) {
      let a = plan.name === event.name;
      let b = plan.date === `${month} ${dayNum}, ${year}`;
      let d = plan.location === `${event._embedded.venues[0].name === undefined ? "Unknown" : event._embedded.venues[0].name}`;
      if (
        a &&
        b &&
        d
      ) {
        c = true;
      }
    }

    content += `
              <div class="event-card">
                <div class="event-card-image">
                  <img src="${event.images[0].url}" alt="${event.name}">
                  <span class="event-card-category">${event.classifications[0].segment.name}</span>
                  <button class="event-card-save ${c ? "saved" : ""}"
                  data-name="${event.name}"
                  data-date="${month} ${dayNum}, ${year}"
                  data-location="${event._embedded.venues[0].name === undefined ? "Unknown" : event._embedded.venues[0].name}"
                  data-planType="EVENT"
                  ><i class="fa-regular fa-heart"></i></button>
                </div>
                <div class="event-card-body">
                  <h3>${event.name}</h3>
                  <div class="event-card-info">
                    <div><i class="fa-regular fa-calendar"></i>${month} ${dayNum}, ${year} at ${time}</div>
                    <div><i class="fa-solid fa-location-dot"></i>${event._embedded.venues[0].name === undefined ? "Unknown" : event._embedded.venues[0].name}, ${event._embedded.venues[0].city.name}</div>
                  </div>
                  <div class="event-card-footer">
                    <button class="btn-event"
                      data-name="${event.name}"
                      data-date="${month} ${dayNum}, ${year}"
                      data-location="${event._embedded.venues[0].name === undefined ? "Unknown" : event._embedded.venues[0].name}"
                      data-planType="EVENT"
                    ><i class="fa-regular fa-heart"></i> Save</button>
                    <a href="${event.url}" target="_blank" class="btn-buy-ticket"><i class="fa-solid fa-ticket"></i> Buy Tickets</a>
                  </div>
                </div>
              </div>
    `;
  }
  eventsContent.innerHTML = content;
  eventsContent.querySelectorAll(".event-card-save").forEach((btn) => {
    btn.addEventListener("click", () => {
      savePlan(btn);
      btn.classList.add("saved");
      btn.children[0].classList.replace("fa-regular", "fa-solid");
    });
  });
  eventsContent.querySelectorAll(".btn-event").forEach((btn) => {
    btn.addEventListener("click", () => {
      savePlan(btn);
      btn
        .closest("div.event-card")
        .querySelector(".event-card-save")
        .classList.add("saved");
    });
  });
}
