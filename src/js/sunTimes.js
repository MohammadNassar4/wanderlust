import { loadingOverlay, globalCity } from "./dashboard.js";
import { monthes } from "./publicHolidays.js";
import { days } from "./weather.js";
const sunTimesContent = document.querySelector("#sun-times-content");
export const sunTimesBtn = document.querySelector("[data-view=sun-times]");

export async function getSunTimes(lat, lng) {
  try {
    loadingOverlay.classList.remove("hidden");
    const request = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`,
    );
    const json = await request.json();
    displaySunTimes(json.results);
  } catch (error) {
    console.log(error);
    sunTimesContent.innerHTML = `
      <div class="country-info-placeholder">
        <div class="placeholder-icon error">
          <i data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
        </div>
        <p>Failed to load sun times. Please try again in a few seconds.</p>
      </div>
    `;
  } finally {
    loadingOverlay.classList.add("hidden");
  }
}

function displaySunTimes(data) {
  const sunriseDate = new Date(data.sunrise);
  const sunsetDate = new Date(data.sunset);
  const solarNoonDate = new Date(data.solar_noon);
  const dayLength = data.day_length;
  const dayHours = Math.floor(dayLength / 3600);
  const dayMinutes = Math.floor((dayLength % 3600) / 60);
  const dawnDate = new Date(data.civil_twilight_begin);
  const duskDate = new Date(data.civil_twilight_end);
  const monthName = monthes[sunriseDate.getMonth()];
  const dayNum = sunriseDate.getDate();
  const dayName = days[sunriseDate.getDay()];
  const year = sunriseDate.getFullYear();

  const dawnTime = (sunTimesContent.innerHTML = `
  <div class="sun-main-card">
    <div class="sun-main-header">
      <div class="sun-location">
        <h2><i data-fa-i2svg=""><svg class="svg-inline--fa fa-location-dot" aria-hidden="true" focusable="false"
              data-prefix="fas" data-icon="location-dot" role="img" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512" data-fa-i2svg="">
              <path fill="currentColor"
                d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z">
              </path>
            </svg></i> ${globalCity.value}</h2>
        <p>Sun times for your selected location</p>
      </div>
      <div class="sun-date-display">
        <div class="date">${monthName} ${dayNum}, ${year}</div>
        <div class="day">${dayName}</div>
      </div>
    </div>

    <div class="sun-times-grid">
      <div class="sun-time-card dawn">
        <div class="icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-moon" aria-hidden="true" focusable="false"
              data-prefix="fas" data-icon="moon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
              data-fa-i2svg="">
              <path fill="currentColor"
                d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z">
              </path>
            </svg></i></div>
        <div class="label">Dawn</div>
        <div class="time">${getFormatedTime(dawnDate)}</div>
        <div class="sub-label">Civil Twilight</div>
      </div>
      <div class="sun-time-card sunrise">
        <div class="icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-sun" aria-hidden="true" focusable="false"
              data-prefix="fas" data-icon="sun" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              data-fa-i2svg="">
              <path fill="currentColor"
                d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z">
              </path>
            </svg></i></div>
        <div class="label">Sunrise</div>
        <div class="time">${getFormatedTime(sunriseDate)}</div>
        <div class="sub-label">Golden Hour Start</div>
      </div>
      <div class="sun-time-card noon">
        <div class="icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-sun" aria-hidden="true" focusable="false"
              data-prefix="fas" data-icon="sun" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              data-fa-i2svg="">
              <path fill="currentColor"
                d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z">
              </path>
            </svg></i></div>
        <div class="label">Solar Noon</div>
        <div class="time">${getFormatedTime(solarNoonDate)}</div>
        <div class="sub-label">Sun at Highest</div>
      </div>
      <div class="sun-time-card sunset">
        <div class="icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-sun" aria-hidden="true" focusable="false"
              data-prefix="fas" data-icon="sun" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              data-fa-i2svg="">
              <path fill="currentColor"
                d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z">
              </path>
            </svg></i></div>
        <div class="label">Sunset</div>
        <div class="time">${getFormatedTime(sunsetDate)}</div>
        <div class="sub-label">Golden Hour End</div>
      </div>
      <div class="sun-time-card dusk">
        <div class="icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-moon" aria-hidden="true" focusable="false"
              data-prefix="fas" data-icon="moon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
              data-fa-i2svg="">
              <path fill="currentColor"
                d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z">
              </path>
            </svg></i></div>
        <div class="label">Dusk</div>
        <div class="time">${getFormatedTime(duskDate)}</div>
        <div class="sub-label">Civil Twilight</div>
      </div>
      <div class="sun-time-card daylight">
        <div class="icon"><i data-fa-i2svg=""><svg class="svg-inline--fa fa-hourglass-half" aria-hidden="true"
              focusable="false" data-prefix="fas" data-icon="hourglass-half" role="img" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512" data-fa-i2svg="">
              <path fill="currentColor"
                d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64V75c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437v11c-17.7 0-32 14.3-32 32s14.3 32 32 32H64 320h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V437c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320 64 32zM96 75V64H288V75c0 19-5.6 37.4-16 53H112c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9H112z">
              </path>
            </svg></i></div>
        <div class="label">Day Length</div>
        <div class="time">${dayHours}h ${dayMinutes}m</div>
        <div class="sub-label">Total Daylight</div>
      </div>
    </div>
  </div>
  <div class="day-length-card">
    <h3><i data-fa-i2svg=""><svg class="svg-inline--fa fa-chart-pie" aria-hidden="true" focusable="false"
          data-prefix="fas" data-icon="chart-pie" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
          data-fa-i2svg="">
          <path fill="currentColor"
            d="M304 240V16.6c0-9 7-16.6 16-16.6C443.7 0 544 100.3 544 224c0 9-7.6 16-16.6 16H304zM32 272C32 150.7 122.1 50.3 239 34.3c9.2-1.3 17 6.1 17 15.4V288L412.5 444.5c6.7 6.7 6.2 17.7-1.5 23.1C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zm526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288H558.4z">
          </path>
        </svg></i> Daylight Distribution</h3>
    <div class="day-progress">
      <div class="day-progress-bar">
        <div class="day-progress-fill" style="width: ${(((dayLength / 3600) * 100) / 24).toFixed(1)}%"></div>
      </div>
    </div>
    <div class="day-length-stats">
      <div class="day-stat">
        <div class="value">${dayHours}h ${dayMinutes}m</div>
        <div class="label">Daylight</div>
      </div>
      <div class="day-stat">
        <div class="value">${(((dayLength / 3600) * 100) / 24).toFixed(1)}%</div>
        <div class="label">of 24 Hours</div>
      </div>
      <div class="day-stat">
        <div class="value">${24 - dayHours}h ${60 - dayMinutes}m</div>
        <div class="label">Darkness</div>
      </div>
    </div>
  </div>
  `);
}

function getFormatedTime(date) {
  const timeString = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return timeString;
}
