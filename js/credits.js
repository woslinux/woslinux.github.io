'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var controls = [];
  var music = new Audio('resources/music/credits.wav');
  var credits = document.querySelector('div.credits');
  var seekingIcon = document.getElementById('seeking');

  music.play();
  music.onend = function() {
    location.href = '/';
  };

  setInterval(function() {
    if(controls[32] && controls[17]) {
      credits.style.transform = 'translateY(' + (credits.getBoundingClientRect().top - 2) + 'px)';
      music.playbackRate = 8;
      seekingIcon.style.opacity = '1';
    } else if(controls[32] || controls[17]) {
      credits.style.transform = 'translateY(' + (credits.getBoundingClientRect().top - 1) + 'px)';
      music.playbackRate = 4;
      seekingIcon.style.opacity = '1';
    } else {
      credits.style.transform = 'translateY(' + (credits.getBoundingClientRect().top - 0.25) + 'px)';
      music.playbackRate = 1;
      seekingIcon.style.opacity = '0';
    }
    if(credits.getBoundingClientRect().top <= ((credits.getBoundingClientRect().height - window.innerHeight) * -1)) {
      window.close();
    }
  }, 10);

  document.addEventListener('keydown', function(evt) {
    controls[evt.keyCode] = true;
  });

  document.addEventListener('keyup', function(evt) {
    controls[evt.keyCode] = false;
  });
});
