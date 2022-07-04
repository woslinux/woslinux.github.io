'use strict';

(function() {
  var _index = 0;
  var intervalDuration = 3000;

  var posters = document.getElementById('posters');
  var posterContainer = posters.querySelector('.container');
  var posterDots = posters.querySelector('.dots');

  var posterBack = posters.querySelector('.back');
  var posterForward = posters.querySelector('.forward');

  posterBack.onclick = function() {
    var currentPoster = posters.querySelector('.current');
    var previousPoster = currentPoster.previousElementSibling || posters.querySelector('.previous');
    var nextPoster = currentPoster.nextElementSibling || posters.querySelector('.next');
    var currentDot = posterDots.querySelector('.current');

    currentPoster.classList.remove('current');
    currentPoster.classList.add('next');
    nextPoster.classList.remove('next');
    nextPoster.classList.add('previous');
    previousPoster.classList.remove('previous');
    previousPoster.classList.add('current');

    var imageUrl = previousPoster.querySelector('img').src;
    posters.style.setProperty('--color-primary', colorPicker(imageUrl, {colors: 2, brightness: 1.75})[0]);
    posters.style.setProperty('--color-secondary', colorPicker(imageUrl, {colors: 2, brightness: 0.25})[1]);
    posters.style.setProperty('--color-overlay', colorPicker(imageUrl)[0]);

    currentDot.classList.remove('current');
    if (currentDot.previousElementSibling) {
      currentDot.previousElementSibling.classList.add('current');
    } else {
      posterDots.children[posterDots.children.length - 1].classList.add('current');
    }
  }; 

  posterForward.onclick = function() {
    var currentPoster = posters.querySelector('.current');
    var previousPoster = currentPoster.previousElementSibling || posters.querySelector('.previous');
    var nextPoster = currentPoster.nextElementSibling || posters.querySelector('.next');
    var currentDot = posterDots.querySelector('.current');

    currentPoster.classList.remove('current');
    currentPoster.classList.add('previous');
    nextPoster.classList.remove('next');
    nextPoster.classList.add('current');

    var imageUrl = nextPoster.querySelector('img').src;
    posters.style.setProperty('--color-primary', colorPicker(imageUrl, {colors: 2, brightness: 1.5})[0]);
    posters.style.setProperty('--color-secondary', colorPicker(imageUrl, {colors: 2, brightness: 0.25})[1]);
    posters.style.setProperty('--color-overlay', colorPicker(imageUrl)[0]);

    previousPoster.classList.remove('previous');
    previousPoster.classList.add('next');

    currentDot.classList.remove('current');
    if (currentDot.nextElementSibling) {
      currentDot.nextElementSibling.classList.add('current');
    } else {
      posterDots.children[0].classList.add('current');
    }
  }; 

  setInterval(function() {
    var currentPoster = posters.querySelector('.current');
    var previousPoster = currentPoster.previousElementSibling || posters.querySelector('.previous');
    var nextPoster = currentPoster.nextElementSibling || posters.querySelector('.next');
    var currentDot = posterDots.querySelector('.current');

    currentPoster.classList.remove('current');
    currentPoster.classList.add('previous');
    nextPoster.classList.remove('next');
    nextPoster.classList.add('current');

    var imageUrl = nextPoster.querySelector('img').src;
    posters.style.setProperty('--color-primary', colorPicker(imageUrl, {colors: 2, brightness: 1.5})[0]);
    posters.style.setProperty('--color-secondary', colorPicker(imageUrl, {colors: 2, brightness: 0.25})[1]);
    posters.style.setProperty('--color-overlay', colorPicker(imageUrl, {brightness: 0.5})[0]);

    previousPoster.classList.remove('previous');
    previousPoster.classList.add('next');

    currentDot.classList.remove('current');
    if (currentDot.nextElementSibling) {
      currentDot.nextElementSibling.classList.add('current');
    } else {
      posterDots.children[0].classList.add('current');
    }
  }, intervalDuration);
})();
