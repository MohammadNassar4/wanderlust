import { loadingOverlay, globalCity } from "./dashboard.js";
import { monthes, } from "./publicHolidays.js";

export const weatherBtn = document.querySelector("[data-view=weather]");
export const weatherContent = document.querySelector("#weather-content");

export const days = [
  "Sunday",
  "Monday",
  "Tuseday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "depositing rime fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  71: "Slight Snow fall",
  73: "Moderate Snow fall",
  75: "Heavy Snow fall",
  80: "Slight Rain showers",
  81: "Moderate Rain showers",
  82: "Violent Rain showers",
  95: "Slight Thunderstorm",
  96: "Moderate Thunderstorm",
  99: "Thunderstorm with hail",
};

export async function getWeather(lat, lng) {
  try {
    loadingOverlay.classList.remove("hidden");
    const request = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`,
    );

    const json = await request.json();
    displayWeather(json);
  } catch (error) {
    console.log(error);
    weatherContent.innerHTML = `
      <div class="country-info-placeholder">
        <div class="placeholder-icon error">
          <i data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
        </div>
        <p>Failed to load capital's weather. Please try again in a few seconds.</p>
      </div>
    `;
  } finally {
    loadingOverlay.classList.add("hidden");
  }
}

function displayWeather(data) {
  const date = new Date(data.current.time);
  const dayNum = date.getDate();
  const nameOfDay = days[date.getDay()];
  const nameOfMonth = monthes[date.getMonth()];
  const year = date.getFullYear();
  const code = data.current.weather_code;
  const todayIndex = getTodayIndex(data.hourly.time);
  const todayHours = data.hourly.time.slice(todayIndex, todayIndex + 24);
  const todayTemps = data.hourly.temperature_2m.slice(
    todayIndex,
    todayIndex + 24,
  );
  const todayCodes = data.hourly.weather_code.slice(
    todayIndex,
    todayIndex + 24,
  );

  weatherContent.innerHTML = `
              <!-- Current Weather Hero -->
            <div class="weather-hero-card weather-${code <= 1 ? "sunny" : code <= 3 ? "cloudy" : code <= 48 ? "foggy" : code <= 65 ? "rainy" : code <= 75 ? "snowy" : code <= 82 ? "rainy" : code <= 99 ? "stormy" : "default"}">
              <div class="weather-location">
                <i class="fa-solid fa-location-dot"></i>
                <span>${globalCity.value}</span>
                <span class="weather-time">${nameOfDay}, ${nameOfMonth} ${dayNum}, ${year}</span>
              </div>
              <div class="weather-hero-main">
                <div class="weather-hero-left">
                  <div class="weather-hero-icon"><i class="fa-solid fa-${code <= 1 ? "sun" : code === 2 ? "cloud-sun" : code <= 3 ? "cloud" : code <= 48 ? "smog" : code <= 55 ? "droplet" : code <= 65 ? "cloud-rain" : code <= 75 ? "snowflake" : code <= 82 ? "cloud-showers-heavy" : "cloud-bolt"}"></i></div>
                  <div class="weather-hero-temp">
                    <span class="temp-value">${Math.round(data.current.temperature_2m)}</span>
                    <span class="temp-unit">${data.current_units.temperature_2m}</span>
                  </div>
                </div>
                <div class="weather-hero-right">
                  <div class="weather-condition">${weatherCodes[String(data.current.weather_code)]}</div>
                  <div class="weather-feels">Feels like ${Math.round(data.current.apparent_temperature)}${data.current_units.apparent_temperature}</div>
                  <div class="weather-high-low">
                    <span class="high"><i class="fa-solid fa-arrow-up"></i> ${Math.round(data.daily.temperature_2m_max.reduce((avg, curr) => avg + curr, 0) / data.daily.temperature_2m_max.length)}°</span>
                    <span class="low"><i class="fa-solid fa-arrow-down"></i> ${Math.round(data.daily.temperature_2m_min.reduce((avg, curr) => avg + curr, 0) / data.daily.temperature_2m_min.length)}°</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Weather Details Grid -->
            <div class="weather-details-grid">
              <div class="weather-detail-card">
                <div class="detail-icon humidity"><i class="fa-solid fa-droplet"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Humidity</span>
                  <span class="detail-value">${data.current.relative_humidity_2m}${data.current_units.relative_humidity_2m}</span>
                </div>
                <div class="detail-bar">
                  <div class="detail-bar-fill" style="width: ${data.current.relative_humidity_2m}%"></div>
                </div>
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon wind"><i class="fa-solid fa-wind"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Wind</span>
                  <span class="detail-value">${Math.round(data.current.wind_speed_10m)} ${data.current_units.wind_speed_10m}</span>
                </div>
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon uv"><i class="fa-solid fa-sun"></i></div>
                <div class="detail-info">
                  <span class="detail-label">UV Index</span>
                  <span class="detail-value">${Math.round(data.daily.uv_index_max[0])}</span>
                </div>
                ${Math.round(data.daily.uv_index_max[0]) > 6 ? `<div class="detail-extra uv-level very-high">Very High</div>` : Math.round(data.daily.uv_index_max[0]) > 4 ? `<div class="detail-extra uv-level high">High</div>` : ""}
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon precip"><i class="fa-solid fa-cloud-rain"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Precipitation</span>
                  <span class="detail-value">${data.daily.precipitation_probability_max[0]}%</span>
                </div>
              </div>
            </div>
            
            <!-- Hourly Forecast -->
            <div class="weather-section">
              <h3 class="weather-section-title"><i class="fa-solid fa-clock"></i> Hourly Forecast</h3>
              <div class="hourly-scroll">
                
                <div class="hourly-item now">
                  <span class="hourly-time">Now</span>
                  <div class="hourly-icon"><i class="fa-solid fa-${todayCodes[0] <= 1 ? "sun" : todayCodes[0] === 2 ? "cloud-sun" : todayCodes[0] <= 3 ? "cloud" : todayCodes[0] <= 48 ? "smog" : todayCodes[0] <= 55 ? "droplet" : todayCodes[0] <= 65 ? "cloud-rain" : todayCodes[0] <= 75 ? "snowflake" : todayCodes[0] <= 82 ? "cloud-showers-heavy" : "cloud-bolt"}"></i></div>
                  <span class="hourly-temp">${Math.round(todayTemps[0])}°</span>
                </div>
                ${todayHours
                  .map((x, i) => {
                    if (i !== 0) {
                      const hours = new Date(x).getHours();
                      let timeStr =
                        hours === 0
                          ? "12 AM"
                          : hours > 12
                            ? hours - 12 + " PM"
                            : hours + " AM";
                      return `<div class="hourly-item">
                    <span class="hourly-time">${timeStr}</span>
                    <div class="hourly-icon"><i class="fa-solid fa-${todayCodes[i] <= 1 ? "sun" : todayCodes[i] === 2 ? "cloud-sun" : todayCodes[i] <= 3 ? "cloud" : todayCodes[i] <= 48 ? "smog" : todayCodes[i] <= 55 ? "droplet" : todayCodes[i] <= 65 ? "cloud-rain" : todayCodes[i] <= 75 ? "snowflake" : todayCodes[i] <= 82 ? "cloud-showers-heavy" : "cloud-bolt"}"></i></div>
                    <span class="hourly-temp">${Math.round(todayTemps[i])}°</span>
                  </div>`;
                    }
                  })
                  .join("")}
              </div>
            </div>
            
            <!-- 7-Day Forecast -->
            <div class="weather-section">
              <h3 class="weather-section-title"><i class="fa-solid fa-calendar-week"></i> 7-Day Forecast</h3>
              <div class="forecast-list">
              
                <div class="forecast-day today">
                  <div class="forecast-day-name"><span class="day-label">Today</span><span class="day-date">${new Date(data.daily.time[0]).getDate()} ${monthes[new Date(data.daily.time[0]).getMonth()]}</span></div>
                  <div class="forecast-icon"><i class="fa-solid fa-${data.daily.weather_code[0] <= 1 ? "sun" : data.daily.weather_code[0] === 2 ? "cloud-sun" : data.daily.weather_code[0] <= 3 ? "cloud" : data.daily.weather_code[0] <= 48 ? "smog" : data.daily.weather_code[0] <= 55 ? "droplet" : data.daily.weather_code[0] <= 65 ? "cloud-rain" : data.daily.weather_code[0] <= 75 ? "snowflake" : data.daily.weather_code[0] <= 82 ? "cloud-showers-heavy" : "cloud-bolt"}"></i></div>
                  <div class="forecast-temps"><span class="temp-max">${Math.round(data.daily.temperature_2m_max[0])}°</span><span class="temp-min">${Math.round(data.daily.temperature_2m_min[0])}°</span></div>
                  <div class="forecast-precip">${data.daily.precipitation_probability_max[0]}%</div>
                </div>
                
                ${data.daily.time
                  .map((x, i) => {
                    if (i !== 0) {
                      let date = new Date(x);
                      let dayName = days[date.getDay()]
                        .slice(0, 3)
                        .toUpperCase();
                      let dayNum = date.getDate();
                      let monthName = monthes[date.getMonth()].slice(0, 3);
                      let dayCode = data.daily.weather_code[i];
                      let maxTemp = Math.round(
                        data.daily.temperature_2m_max[i],
                      );
                      let minTemp = Math.round(
                        data.daily.temperature_2m_min[i],
                      );
                      let precipitation =
                        data.daily.precipitation_probability_max[i];
                      return `
                            <div class="forecast-day">
                              <div class="forecast-day-name"><span class="day-label">${dayName}</span><span class="day-date">${dayNum} ${monthName}</span></div>
                              <div class="forecast-icon"><i class="fa-solid fa-${dayCode <= 1 ? "sun" : dayCode === 2 ? "cloud-sun" : dayCode <= 3 ? "cloud" : dayCode <= 48 ? "smog" : dayCode <= 55 ? "droplet" : dayCode <= 65 ? "cloud-rain" : dayCode <= 75 ? "snowflake" : dayCode <= 82 ? "cloud-showers-heavy" : "cloud-bolt"}"></i></div>
                              <div class="forecast-temps"><span class="temp-max">${maxTemp}°</span><span class="temp-min">${minTemp}°</span></div>
                              <div class="forecast-precip">${precipitation}%</div>
                            </div>
                      `;
                    }
                  })
                  .join("")}


              </div>
            </div>
  `;
}

function getTodayIndex(times) {
  const today = new Date();
  for (let i = 0; i < times.length; i++) {
    if (
      today.getHours() === new Date(times[i]).getHours() &&
      today.getDay() === new Date(times[i]).getDay()
    ) {
      return i;
    }
  }
}

