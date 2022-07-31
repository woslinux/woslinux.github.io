'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var content = document.getElementById('content');
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  document.ontouchstart = function(e) {
    e = e || window.event;
    e.preventDefault();
    // get the touch cursor position at startup:
    pos3 = e.touches[0].clientX;
    pos4 = e.touches[0].clientY;

    document.ontouchend = function() {
      // stop moving when touch button is released:
      document.ontouchend = null;
      document.ontouchmove = null;

      var x = content.getBoundingClientRect().left;
      var rtl = document.dir == 'rtl';

      content.style.transition = '0.3s cubic-bezier(0.2, 0.9, 0.1, 1.0)';
      content.style.left = null;
      if ((!rtl && x <= (window.innerWidth / 2)) || (rtl && x >= (-window.innerWidth / 2))) {
        content.classList.add('visible');
      } else {
        content.classList.remove('visible');
      }

      // Thanks very much. Firefox
      setTimeout(function() {
        content.style.transition = null;
      }, 300);
    };

    // call a function whenever the cursor moves:
    document.ontouchmove = function(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.touches[0].clientX;
      pos2 = pos4 - e.touches[0].clientY;
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
      // set the element's new position:
      content.style.left = (content.offsetLeft - pos1) + 'px';

      var x = content.getBoundingClientRect().left;
      var rtl = document.dir == 'rtl';
      if (!content.classList.contains('visible')) {
        if (!rtl && x <= 0) {
          content.style.left = '-100%';
        } else if (rtl && x >= 0) {
          content.style.left = '100%';
        }
      } else {
        if (!rtl && x <= 0) {
          content.style.left = 0;
        } else if (rtl && x >= 0) {
          content.style.left = 0;
        }
      }
    }
  };
});
