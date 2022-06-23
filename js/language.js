'use strict';

document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('load', function() {
    setTimeout(function() {
      navigator.mozL10n.language.code =
        (localStorage.getItem('language') !== undefined ?
            localStorage.getItem('language') : (navigator.language || 'en-US'));
      if (languageSelector) {
        languageSelector.value =
          (localStorage.getItem('language') !== undefined ?
              localStorage.getItem('language') : (navigator.language || 'en-US'));
      }
    });
  });

  var languageSelector = document.getElementById('languages');
  if (languageSelector) {
    languageSelector.addEventListener('change', function() {
      navigator.mozL10n.language.code = languageSelector.value;
      localStorage.setItem('language', languageSelector.value);
    });
  }
});
