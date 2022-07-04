'use strict';

import { getUsername, getProfilePicture, isUserLoggedIn } from '/js/firebase.js';

var downloads = JSON.parse(localStorage.getItem('store_downloads')) || [];

(function() {
  var loginButton = document.getElementById('login-button');
  var avatar = document.getElementById('profile-picture');
  getUsername(function(data) {
    avatar.title = data;
  });
  getProfilePicture(function(data) {
    avatar.style.backgroundImage = 'url(' + data + ')';
  });

  if (isUserLoggedIn) {
    loginButton.style.display = 'none';
  }

  var rootSection = document.querySelector('[role="region"] > section');

  var menuButton = document.getElementById('menu-button');
  var submitButton = document.getElementById('submit-button');
  var menu = document.getElementById('menu');
  var submitDialog = document.getElementById('submit');

  menuButton.onclick = function() {
    setTimeout(function() {
      menu.classList.toggle('visible');
    });
  };
  submitButton.onclick = function() {
    setTimeout(function() {
      submitDialog.classList.toggle('visible');
    });
  };
  submitDialog.querySelector('[data-action="cancel"]').onclick = function() {
    setTimeout(function() {
      submitDialog.classList.remove('visible');
    });
  };

  rootSection.addEventListener('click', function() {
    menu.classList.remove('visible');
    submitDialog.classList.remove('visible');
  });

  var loadingScreen = document.getElementById('loading-screen');
  loadingScreen.classList.add('visible');

  var homeButton = document.getElementById('home-button');
  var featuredButton = document.getElementById('featured-button');
  var personalButton = document.getElementById('personal-button');
  var optionsButton = document.getElementById('options-button');
  var homeSection = document.getElementById('home');
  var featuredSection = document.getElementById('featured');
  var personalSection = document.getElementById('personal');
  var optionsSection = document.getElementById('options');

  var sections = document.querySelectorAll('[role="region"] > section .page');

  homeButton.onclick = function() {
    var selectedButton = document.querySelector('a[aria-selected="true"]');
    selectedButton.setAttribute('aria-selected', false);
    homeButton.setAttribute('aria-selected', true);

    sections.forEach(function(section, index) {
      if (section == homeSection) {
        _slideAnimation(section, index);
      }
    });
  };
  featuredButton.onclick = function() {
    var selectedButton = document.querySelector('a[aria-selected="true"]');
    selectedButton.setAttribute('aria-selected', false);
    featuredButton.setAttribute('aria-selected', true);

    sections.forEach(function(section, index) {
      if (section == featuredSection) {
        _slideAnimation(section, index);
      }
    });
  };
  personalButton.onclick = function() {
    var selectedButton = document.querySelector('a[aria-selected="true"]');
    selectedButton.setAttribute('aria-selected', false);
    personalButton.setAttribute('aria-selected', true);

    sections.forEach(function(section, index) {
      if (section == personalSection) {
        _slideAnimation(section, index);
      }
    });
  };
  optionsButton.onclick = function() {
    var selectedButton = document.querySelector('a[aria-selected="true"]');
    selectedButton.setAttribute('aria-selected', false);
    optionsButton.setAttribute('aria-selected', true);

    sections.forEach(function(section, index) {
      if (section == optionsSection) {
        _slideAnimation(section, index);
      }
    });
  };

  function _slideAnimation(section, index) {
    var selectedSection = document.querySelector('.page[aria-selected="true"]');
    sections.forEach(function(e, i) {
      if (e == selectedSection) {
        if ((i <= index && i !== index && document.dir == 'ltr') ||
            (i >= index && i !== index && document.dir == 'rtl')) {
          e.classList.add('app-go-deeper-out');
          setTimeout(function() {
            e.classList.remove('app-go-deeper-out');
            e.setAttribute('aria-selected', false);
          }, 500);
          section.classList.add('app-go-deeper-in');
          setTimeout(function() {
            section.classList.remove('app-go-deeper-in');
            section.setAttribute('aria-selected', true);
          }, 500);
        } else if ((i >= index && i !== index && document.dir == 'ltr') ||
                   (i <= index && i !== index && document.dir == 'rtl')) {
          e.classList.add('app-go-deeper-back-out');
          setTimeout(function() {
            e.classList.remove('app-go-deeper-back-out');
            e.setAttribute('aria-selected', false);
          }, 500);
          section.classList.add('app-go-deeper-back-in');
          setTimeout(function() {
            section.classList.remove('app-go-deeper-back-in');
            section.setAttribute('aria-selected', true);
          }, 500);
        } else if (e == section) {
          e.setAttribute('aria-selected', false);
          section.setAttribute('aria-selected', true);
        }
      }
    });

    var downloadsPage = document.getElementById('downloads');
    var downloadsButton = document.getElementById('options-downloads');
    var downloadsList = downloadsPage.querySelector('.downloads-container');

    downloadsPage.classList.add('visible');
    downloadsButton.onclick = function() {
      var selected = document.querySelector('.content.visible');
      if (selected !== downloadsPage) {
        selected.classList.remove('visible');
      }
      downloadsPage.classList.add('visible');
    };

    downloadsList.innerHTML = '';
    downloads.forEach(function(download) {
      var list = document.createElement('li');
      var icon = document.createElement('img');
      var holder = document.createElement('div');
      var title = document.createElement('p');
      var state = document.createElement('p');

      list.onclick = function() {
        location.href = '?webapp=' + download.slug;
      };

      icon.src = download.icon;
      icon.onerror = function() {
        icon.src = 'style/images/default.png';
      };
      list.appendChild(icon);

      list.appendChild(holder);
      title.innerText = download.name;
      holder.appendChild(title);
      state.setAttribute('data-l10n-id', 'store-installed');
      holder.appendChild(state);

      downloadsList.appendChild(list);
    });

    downloadsButton.onclick = function() {
      downloadsPage.classList.toggle('visible');
    };
  }
})();
