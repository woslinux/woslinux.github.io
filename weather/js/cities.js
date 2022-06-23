'use strict';

!(function() {
  var cityDropdown = document.getElementById('city');
  var cityInput = document.getElementById('city-selector');
  var cities = {};

  fetch('countries.json')
      .then((response) => response.json())
      .catch((e) => {
        console.error(e);
        alert("Can't download database\nPlease reload the page.");
      })
      .then((response) => {
        cities = response;
        if (document.readyState === "complete" || document.readyState === "interactive") {
          init();
        } else {
          window.addEventListener("DOMContentLoaded", () => {
            init();
          });
        }
      });

  function init() {
    cities.forEach(function(item) {
      item.states.forEach(function(item1) {
        var option = document.createElement('button');

        option.innerText = item1.name;

        var normalizedName = item1.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if(option.innerText !== normalizedName) {
          option.dataset.value = normalizedName;
        }
        option.onclick = function(e) {
          e.preventDefault();
          cityInput.value = normalizedName;
        };

        cityInput.addEventListener('keydown', function() {
          if(normalizedName.toLowerCase().includes(cityInput.value.toLowerCase())) {
            option.style.display = null;
          } else {
            option.style.display = 'none';
          }
        });

        cityDropdown.appendChild(option);
      });
    });
  }
})();
