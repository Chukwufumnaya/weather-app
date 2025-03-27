import { apiKey, googleApikey, googleSearchEngineId } from "./api-key.js";

let input = document.querySelector('#city-name');
let submit = document.querySelector('.submit');
let box = document.querySelector('.box');
let container = document.querySelector('.container');
let fiveDayForecast = document.querySelector('.forecast');

submit.addEventListener('click', () => {
  backgroundImageFunction(currentWeatherFunction);
})

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    backgroundImageFunction(currentWeatherFunction);
  }
})

function currentWeatherFunction() { 
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json()
    })
    .then((data) => {
      const { main, weather, sys } = data;
      let icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`

      let pageHTML = ``;

      pageHTML += `
      <h2 class="country-name">${input.value} <sup class="country-code">${sys.country}</sup></h2>
        <h2 class="temperature">${Math.round(main.temp)}<sup>&deg;C</sup></h2>
        <p class="real-feel">Feels like: ${Math.round(main.feels_like)}<sup>&deg;C</sup></p>
        <figure>
         <img src="${icon}" alt="Weather icon showing ${weather[0].description}" class="weather-icon">
        <figcaption class="weather-description">${weather[0].description}</figcaption>
        </figure>
      `
      box.innerHTML = pageHTML;

      if (input.value.includes(',')) {
        document.querySelector('.country-code').style.display = 'none';
      }
    })
    .catch((error) => {
      box.innerHTML = `Error displaying weather info. Please try again.`;
    })

  fiveDayForecastFunction();
}

function backgroundImageFunction(callback) {
  let URL = `https://www.googleapis.com/customsearch/v1?key=${googleApikey}&cx=${googleSearchEngineId}&q=${input.value}%20city%20aerial%20view+sunset&searchType=image&imgType=photo&fileType=jpg`;

  fetch(URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      let pic = data.items[0].link;

      // Create a new Image object to preload the image
      let img = new Image();
      img.onload = () => {
        container.style.backgroundImage = `url(${pic})`;
        // Call the callback function after the image is loaded
        if (callback) callback();
      };
      img.onerror = () => {
        console.log(`Error loading image. Please try again.`);
        // Optionally call the callback even if the image fails to load
        if (callback) callback();
      };
      img.src = pic;
    })
    .catch((error) => {
      console.log(`Error displaying picture. Please try again.`);
      // Optionally call the callback even if the fetch fails
      if (callback) callback();
    });
}

function fiveDayForecastFunction() {
  let link = `https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&appid=${apiKey}&units=metric`;

  fetch(link)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      let fiveDayForecastHTML = '';
      //filters the data.list array to show only those arrays that have the time 12:00:00//
      const dailyForecasts = data.list.filter((date) => {
        return date.dt_txt.includes('12:00:00')
      });

      dailyForecasts.forEach((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).toDateString();

        let icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`

        fiveDayForecastHTML += `
          <div class="forecasts">
            <h2>${forecastDate}</h2>
            <h2 class="forecast-temperature">${Math.round(forecast.main.temp)}<sup>&deg;C</sup></h2>
            <figure>
              <img src="${icon}" alt="Forecast icon showing ${forecast.weather[0].description}" class="forecast-weather-icon">
              <figcaption class="forecast-weather-description">${forecast.weather[0].description}</figcaption>
            </figure>
          </div>
        `
      })
      fiveDayForecast.innerHTML = fiveDayForecastHTML;
    })
    .catch((error) => {
      fiveDayForecast.innerHTML = 'Error displaying forecast info.';
    })
}



