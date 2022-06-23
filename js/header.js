'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var prevScrollPixel = 0;
  var header = document.querySelector('#root > header:first-child');
  var footer = document.querySelector('#root > section > footer:first-of-type');
  header.classList.add('visible');

  document.addEventListener('scroll', function() {
    if (prevScrollPixel <= window.scrollY && window.scrollY >= 100) {
      header.classList.remove('visible');
    } else if (prevScrollPixel >= window.scrollY && window.scrollY >= 100) {
      header.classList.add('visible');
    }

    prevScrollPixel = window.scrollY;
  });
});
