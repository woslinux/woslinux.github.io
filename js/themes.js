'use strict';

document.addEventListener('DOMContentLoaded', function() {
  document.body.className = localStorage.getItem('theme') || '';
  document.body.style.setProperty('--accent-color', localStorage.getItem('accent-color') || '');
  var frame = document.getElementById('frame');
  var previousTheme = '';

  var themeSelector = document.getElementById('theme');
  if (themeSelector) {
    themeSelector.value = localStorage.getItem('theme');
    themeSelector.addEventListener('change', function() {
      previousTheme = localStorage.getItem('theme');

      localStorage.setItem('theme', themeSelector.value);
      document.body.classList.add(themeSelector.value);
      document.body.classList.remove(previousTheme);
      document.body.classList.add('transitioning');
      setTimeout(function() {
        document.body.classList.remove('transitioning');
      }, 500);
      frame.contentDocument.body.className = themeSelector.value;
      frame.contentDocument.body.classList.add('transitioning');
      setTimeout(function() {
        frame.contentDocument.body.classList.remove('transitioning');
      }, 500);
    });
  }

  var darkModeEnabled = localStorage.getItem('dark-mode') == 'true';
  if (darkModeEnabled) {
    document.body.classList.add('dark-mode-enabled');
  }

  var darkModeSwitch = document.getElementById('dark-mode');
  if (darkModeSwitch) {
    darkModeSwitch.checked = darkModeEnabled;
    darkModeSwitch.addEventListener('change', function() {
      localStorage.setItem('dark-mode', (darkModeSwitch.checked == 'on' || darkModeSwitch.checked == true) ? true : false);
      document.body.classList.toggle('dark-mode-enabled');
      document.body.classList.add('transitioning');
      setTimeout(function() {
        document.body.classList.remove('transitioning');
      }, 500);
    });
  }

  var accentColorSelector = document.getElementById('accent-color');
  if (accentColorSelector) {
    accentColorSelector.value = localStorage.getItem('accent-color') || 'var(--accent-color)';
    accentColorSelector.addEventListener('change', function() {
      localStorage.setItem('accent-color', accentColorSelector.value);
      document.body.style.setProperty('--accent-color', accentColorSelector.value);
      document.body.classList.add('transitioning');
      setTimeout(function() {
        document.body.classList.remove('transitioning');
      }, 500);
      frame.contentDocument.body.style.setProperty('--accent-color', accentColorSelector.value);
      frame.contentDocument.body.classList.add('transitioning');
      setTimeout(function() {
        frame.contentDocument.body.classList.remove('transitioning');
      }, 500);
    });
  }
});
