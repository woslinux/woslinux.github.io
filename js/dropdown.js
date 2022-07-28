'use strict';

function dropdown(element, callback) {
  var dropdown = document.createElement('div');
  dropdown.classList.add('dropdown');
  callback(dropdown);
  document.body.appendChild(dropdown);

  element.addEventListener('click', function() {
    dropdown.classList.toggle('visible');

    var x = element.getBoundingClientRect().left;
    var y = element.getBoundingClientRect().top + element.getBoundingClientRect().height;

    if (x > (window.innerWidth - 256)) {
      dropdown.style.left = (x - 256) + 'px';
    } else {
      dropdown.style.left = x + 'px';
    }

    if (y > (window.innerHeight - dropdown.getBoundingClientRect().height)) {
      dropdown.style.top = (y - dropdown.getBoundingClientRect().height) + 'py';
    } else {
      dropdown.style.top = y + 'px';
    }
  });
}
