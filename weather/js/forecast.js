'use strict';

!(function() {
  var data = null;
  let lat;
  let lon;
  var currentTime = new Date().getTime();

  navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    var databaseURL = 'https://api.openweathermap.org/data/2.5/onecall?lang' + navigator.language + '&lat=' + (localStorage.getItem('lat') == null ? lat.toFixed(2) : localStorage.getItem('lat')) + '&lon=' + (localStorage.getItem('lon') == null ? lon.toFixed(2) : localStorage.getItem('lon')) + '&exclude=current,minutely&appid=41afd1424d58cb17007e745f8e0c798b';
    var client = new XMLHttpRequest();
    client.open('GET', databaseURL);
    client.onreadystatechange = function() {
      data = JSON.parse(client.responseText);
      if (data !== null) {
        localStorage.setItem('weather_dataCache_forecast', JSON.stringify(data));
      }
      if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
      } else {
        window.addEventListener("DOMContentLoaded", () => {
          init();
        });
      }
    }
    client.send();
  });

  if (data == null) {
    data = JSON.parse(localStorage.getItem('weather_dataCache_forecast'));
    if (document.readyState === "complete" || document.readyState === "interactive") {
      init();
    } else {
      window.addEventListener("DOMContentLoaded", () => {
        init();
      });
    }
  }

  function init() {
    var forecastHourly = document.getElementById('weather-forecast-hourly');
    var forecastDaily = document.getElementById('weather-forecast-daily');

    data.hourly.forEach(function(item) {
      var info = document.createElement('div');
      var infoIcon = document.createElement('div');
      var infoTemperature = document.createElement('span');

      info.setAttribute('title', `\
Date: ${new Date(currentTime + item.dt)}
Pressure: ${item.pressure}
Humidity: ${item.humidity}
DewPoint: ${item.dew_point}
UVI: ${item.uvi}
Clouds: ${item.clouds}%
Wind Speed: ${item.wind_speed}km/h
Wind Degree: ${item.wind_deg}deg
Wind Gust: ${item.wind_gust}\
      `);

      infoIcon.classList.add('icon');
      switch(item.weather['0'].icon) {
        case '01d':
          infoIcon.dataset.state = 'sunny';
          break;
        case '01n':
          infoIcon.dataset.state = 'night';
          break;
        case '02d':
          infoIcon.dataset.state = 'sunny-cloudy';
          break;
        case '02n':
          infoIcon.dataset.state = 'night-cloudy';
          break;
        case '03d':
        case '03n':
          infoIcon.dataset.state = 'cloudy';
          break;
        case '04d':
        case '04n':
          infoIcon.dataset.state = 'cloudy-broken';
          break;
        case '9d':
        case '9n':
          infoIcon.dataset.state = 'shower-rain';
          break;
        case '10d':
        case '10n':
          infoIcon.dataset.state = 'raining';
          break;
        case '11d':
        case '11n':
          infoIcon.dataset.state = 'thunderstorm';
          break;
        case '50d':
        case '50n':
          infoIcon.dataset.state = 'mist';
          break;
      }

      infoTemperature.innerText = parseInt(item.temp - 273.15).toLocaleString() + '°C';

      info.appendChild(infoIcon);
      info.appendChild(infoTemperature);
      forecastHourly.appendChild(info);
    });

    data.daily.forEach(function(item) {
      var info = document.createElement('div');
      var infoIcon = document.createElement('div');
      var infoTemperatureDay = document.createElement('span');
      var infoTemperatureNight = document.createElement('span');

      info.setAttribute('title', `\
Date: ${new Date(currentTime + item.dt)}
Pressure: ${item.pressure}
Humidity: ${item.humidity}
DewPoint: ${item.dew_point}
UVI: ${item.uvi}
Clouds: ${item.clouds}%
Wind Speed: ${item.wind_speed}km/h
Wind Degree: ${item.wind_deg}deg
Wind Gust: ${item.wind_gust}\
      `);

      infoIcon.classList.add('icon');
      switch(item.weather['0'].icon) {
        case '01d':
          infoIcon.dataset.state = 'sunny';
          break;
        case '01n':
          infoIcon.dataset.state = 'night';
          break;
        case '02d':
          infoIcon.dataset.state = 'sunny-cloudy';
          break;
        case '02n':
          infoIcon.dataset.state = 'night-cloudy';
          break;
        case '03d':
        case '03n':
          infoIcon.dataset.state = 'cloudy';
          break;
        case '04d':
        case '04n':
          infoIcon.dataset.state = 'cloudy-broken';
          break;
        case '9d':
        case '9n':
          infoIcon.dataset.state = 'shower-rain';
          break;
        case '10d':
        case '10n':
          infoIcon.dataset.state = 'raining';
          break;
        case '11d':
        case '11n':
          infoIcon.dataset.state = 'thunderstorm';
          break;
        case '50d':
        case '50n':
          infoIcon.dataset.state = 'mist';
          break;
      }

      infoTemperatureDay.innerText = 'D: ' + parseInt(item.temp.day - 273.15).toLocaleString() + '°C';
      infoTemperatureNight.innerText = 'N: ' + parseInt(item.temp.night - 273.15).toLocaleString() + '°C';

      info.appendChild(infoIcon);
      info.appendChild(infoTemperatureDay);
      info.appendChild(infoTemperatureNight);
      forecastDaily.appendChild(info);
    });
  }
})();
