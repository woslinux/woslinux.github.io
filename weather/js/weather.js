'use strict';

!(function() {
  if(location.hash == '') {
    location.hash = '#weather';
  }

  var data = null;
  let lat;
  let lon;
  var statusSound = new Audio('../shared/resources/media/notifications/notifier_wos.wav');
  var dialogWarningSound = new Audio('../shared/resources/media/exclamation.wav');

  navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    var databaseURL;
    if(localStorage.getItem('city') == 'null' || localStorage.getItem('city') == null) {
      databaseURL = 'https://api.openweathermap.org/data/2.5/weather?lang=' + navigator.language + '&lat=' + (localStorage.getItem('lat') == null ? lat.toFixed(2) : localStorage.getItem('lat')) + '&lon=' + (localStorage.getItem('lon') == null ? lon.toFixed(2) : localStorage.getItem('lon')) + '&appid=41afd1424d58cb17007e745f8e0c798b';
    } else {
      databaseURL = 'https://api.openweathermap.org/data/2.5/weather?lang=' + navigator.language + '&q=' + localStorage.getItem('city') + '&appid=41afd1424d58cb17007e745f8e0c798b';
    }
    var client = new XMLHttpRequest();
    client.open('GET', databaseURL);
    client.onreadystatechange = function() {
      data = JSON.parse(client.responseText);
      if (data !== null) {
        localStorage.setItem('weather_dataCache', JSON.stringify(data));
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
    data = JSON.parse(localStorage.getItem('weather_dataCache'));
    if (document.readyState === "complete" || document.readyState === "interactive") {
      init();
    } else {
      window.addEventListener("DOMContentLoaded", () => {
        init();
      });
    }
  }

  function init() {
    var weatherIcon = document.getElementById('weather-icon');
    var weatherHeatDegree = document.getElementById('weather-heat-degree');

    setTimeout(function() {
      if(data.weather['0'].icon.includes('n')) {
        document.body.classList.add('night');
      } else {
        document.body.classList.remove('night');
      }
    }, 100);

    switch(data.weather['0'].icon) {
      case '01d':
        weatherIcon.dataset.state = 'sunny';
        changeFavicon('style/images/weather-not-cloudy.svg');
        break;
      case '01n':
        weatherIcon.dataset.state = 'night';
        changeFavicon('style/images/weather-night.svg');
        break;
      case '02d':
        weatherIcon.dataset.state = 'sunny-cloudy';
        changeFavicon('style/images/weather-partly-cloudy.svg');
        break;
      case '02n':
        weatherIcon.dataset.state = 'night-cloudy';
        changeFavicon('style/images/weather-partly-cloudy-night.svg');
        break;
      case '03d':
      case '03n':
        weatherIcon.dataset.state = 'cloudy';
        changeFavicon('style/images/weather-cloudy.svg');
        break;
      case '04d':
      case '04n':
        weatherIcon.dataset.state = 'cloudy-broken';
        changeFavicon('style/images/weather-cloudy-broken.svg');
        break;
      case '9d':
      case '9n':
        weatherIcon.dataset.state = 'shower-rain';
        changeFavicon('style/images/weather-shower-rain.svg');
        break;
      case '10d':
      case '10n':
        weatherIcon.dataset.state = 'raining';
        changeFavicon('style/images/weather-raining.svg');
        break;
      case '11d':
      case '11n':
        weatherIcon.dataset.state = 'thunderstorm';
        changeFavicon('style/images/weather-thunderstorm.svg');
        break;
      case '50d':
      case '50n':
        weatherIcon.dataset.state = 'mist';
        changeFavicon('style/images/weather-mist.svg');
        break;
    }

    var weatherCity = document.getElementById('weather-city');
    var weatherTime = document.getElementById('weather-time');
    var weatherDesc = document.getElementById('weather-description');
    var weatherClouds = document.getElementById('weather-clouds');
    var weatherHumidity = document.getElementById('weather-humidity');
    var weatherWindSpeed = document.getElementById('weather-wind-speed');
    var weatherWindDegree = document.getElementById('weather-wind-degree');
    var weatherFeelsLike = document.getElementById('weather-feels-like');
    var weatherTempMin = document.getElementById('weather-temp-min');
    var weatherTempMax = document.getElementById('weather-temp-max');
    var weatherPressure = document.getElementById('weather-pressure');

    weatherHeatDegree.innerText = parseInt(data.main.temp - 273.15).toLocaleString() + '°C';
    weatherCity.innerText = data.name + ', ' + data.sys.country;

    var date = new Date();
    var weekday = date.toLocaleString("default", { weekday: "long" });

    var weekday = weekday;
    var hours = (date.getHours() >= 12) ? date.getHours() - 12 : date.getHours();
    hours = hours == 0 ? 12 : hours;
    var minutes = (date.getMinutes() <= 9) ? (0).toLocaleString() + date.getMinutes().toLocaleString() : date.getMinutes().toLocaleString();
    var ampm = '';
    if(navigator.language == 'ar') {
      ampm = (hours <= 12) ? 'م' : 'ص';
    } else {
      ampm = (hours <= 12) ? 'PM' : 'AM';
    }
    weatherTime.innerText = weekday + ', ' + hours.toLocaleString() + ':' + minutes + ' ' + ampm;

    weatherDesc.innerText = data.weather['0'].description;
    weatherClouds.innerText = data.clouds.all.toLocaleString() + '%';
    weatherHumidity.innerText = data.main.humidity.toLocaleString() + '%';
    weatherWindSpeed.dataset.l10nArgs = '{"n":"' + data.wind.speed.toLocaleString() + '"}';
    weatherWindDegree.dataset.l10nArgs = '{"n":"' + data.wind.deg.toLocaleString() + '"}';

    weatherFeelsLike.innerText = parseInt(data.main.feels_like - 273.15).toLocaleString() + '°C';
    weatherTempMin.innerText = parseInt(data.main.temp_min - 273.15).toLocaleString() + '°C';
    weatherTempMax.innerText = parseInt(data.main.temp_max - 273.15).toLocaleString() + '°C';
    weatherPressure.innerText = data.main.pressure.toLocaleString();

    var dayCycle = document.getElementById('weather-day-cycle');
    dayCycle.children[0].style.transform = 'rotate(-' + (date.getHours() * 7.5) + 'deg)';

    var latitudeInput = document.getElementById('latitude');
    var longitudeInput = document.getElementById('longitude');
    var cityInput = document.getElementById('city-selector');
    var weatherReset = document.getElementById('weather-reset');

    latitudeInput.placeholder = lat;
    latitudeInput.addEventListener('keydown', function(e) {
      if(e.keyCode == 13) {
        localStorage.setItem('lat', latitudeInput.value);
        if(localStorage.getItem('lat') == '') {
          localStorage.setItem('lat', null)
        }
        location.href = '';
      }
    });

    longitudeInput.placeholder = lon;
    longitudeInput.addEventListener('keydown', function(e) {
      if(e.keyCode == 13) {
        localStorage.setItem('lon', longitudeInput.value);
        if(localStorage.getItem('lon') == '') {
          localStorage.setItem('lon', null)
        }
        location.href = '';
      }
    });

    cityInput.addEventListener('keydown', function(e) {
      if(e.keyCode == 13) {
        localStorage.setItem('city', cityInput.value);
        if(localStorage.getItem('city') == '') {
          localStorage.setItem('city', null)
        }
        location.href = '';
      }
    });

    weatherReset.addEventListener('click', function() {
      var cc_dialog = document.getElementById('reset-confirmation');
      var cc_status = document.getElementById('reset-status');
      cc_dialog.classList.add('shown');

      cc_dialog.children[cc_dialog.children.length - 1].children[0].onclick = function(e) {
        e.preventDefault();
        cc_dialog.classList.remove('shown');
      };
      cc_dialog.children[cc_dialog.children.length - 1].children[1].onclick = function(e) {
        e.preventDefault();
        localStorage.clear();

        latitudeInput.value = '';
        longitudeInput.value = '';
        cc_dialog.classList.remove('shown');

        cc_status.style.display = 'block';
        setTimeout(function() {
          cc_status.style.display = 'none';
        }, 3000);

        statusSound.play();
      };

      dialogWarningSound.play();
    });

    setInterval(function() {
      document.title = data.name + ', ' + data.sys.country + ' - ' + parseInt(data.main.temp - 273.15).toLocaleString() + '°C';
      document.querySelector('html > head > title').setAttribute('data-l10n-id', '');
      setTimeout(function() {
        document.title = 'Weather';
        document.querySelector('html > head > title').setAttribute('data-l10n-id', 'weather');
      }, 2000);
    }, 4000);
  }
})();
