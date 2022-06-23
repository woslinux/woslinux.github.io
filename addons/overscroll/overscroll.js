'use strict';

(function() {
  var elements = document.querySelectorAll('[role="region"]');
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var timingFunction = 'ease';
  var duration = 300;
  var durationBacking = 600;
  var timePadding = 0;
  var power = 2.25;
  var isBouncing = false;

  elements.forEach(function(element) {
    element.ontouchstart = function(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.ontouchend = function() {
        // stop moving when mouse button is released:
        document.ontouchup = null;
        document.ontouchmove = null;
        element.style.transition = 'all 0.3s cubic-bezier(0.2, 0.9, 0.1, 1.0)';
      };
      // call a function whenever the cursor moves:
      document.ontouchmove = function(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.transition = '';
        // set the element's new position:
        if (element.scrollHeight >= element.getBoundingClientRect().height) {
          element.style.transform = 'translateX(' + (element.getBoundingClientRect().left - pos1) + 'px)';
        } else if (element.scrollWidth >= element.getBoundingClientRect().width) {
          element.style.transform = 'translateY(' + (element.getBoundingClientRect().top - pos2) + 'px)';
        } else {
          element.style.transform = 'translate(' + (element.getBoundingClientRect().left - pos1) + 'px, ' + (element.getBoundingClientRect().top - pos2) + 'px)';
        }
      };
    };

    element.addEventListener('wheel', function(evt) {
      document.querySelectorAll('section > *').forEach(function(inlineElement, index) {
        if (!isBouncing) {
          if ((element.getBoundingClientRect().width <= element.scrollWidth) ||
              ((element.getBoundingClientRect().width <= window.innerWidth))) {
            if (((element.scrollLeft <= 1) && evt.deltaX <= 0) &&
                ((document.scrollingElement.scrollLeft <= 0) && evt.deltaX <= 0)) {
              inlineElement.style.transition = 'all ' + duration + 'ms ' + timingFunction;
              inlineElement.style.transform = 'translateX(' + (evt.deltaX * power) + 'px)';
              setTimeout(function() {
                inlineElement.style.transition = 'all ' + durationBacking + 'ms ' + timingFunction + ' ' + (index * timePadding) + 'ms';
                inlineElement.style.transform = '';
                setTimeout(function() {
                  inlineElement.style.transition = '';
                }, durationBacking);
              }, duration);
            } else if (((element.scrollLeft >= (element.scrollWidth - 1)) && evt.deltaX >= 0) ||
                       (((document.scrollingElement.scrollLeft + window.innerHeight) >= (element.scrollWidth - 1)) && evt.deltaX >= 0)) {
              inlineElement.style.transition = 'all ' + duration + 'ms ' + timingFunction + ' ' + (index * timePadding) + 'ms';
              inlineElement.style.transform = 'translateX(' + (evt.deltaX * power) + 'px)';
              setTimeout(function() {
                inlineElement.style.transition = 'all ' + durationBacking + 'ms ' + timingFunction + ' ' + (index * timePadding) + 'ms';
                inlineElement.style.transform = '';
                setTimeout(function() {
                  inlineElement.style.transition = '';
                }, durationBacking);
              }, duration);
            }
          }
          if ((element.getBoundingClientRect().height <= element.scrollHeight) ||
              (element.getBoundingClientRect().height <= window.innerHeight)) {
            if (((element.scrollTop <= 1) && evt.deltaY <= 0) &&
                ((document.scrollingElement.scrollTop <= 1) && evt.deltaY <= 0)) {
              inlineElement.style.transition = 'all ' + duration + 'ms ' + timingFunction;
              inlineElement.style.transform = 'translateY(' + ((evt.deltaY * -1) * power) + 'px)';
              setTimeout(function() {
                inlineElement.style.transition = 'all ' + durationBacking + 'ms ' + timingFunction + ' ' + (index * timePadding) + 'ms';
                inlineElement.style.transform = '';
                setTimeout(function() {
                  inlineElement.style.transition = '';
                }, durationBacking);
              }, duration);
            } else if (((element.scrollTop >= (element.scrollHeight - 1)) && evt.deltaY >= 0) ||
                       (((document.scrollingElement.scrollTop + window.innerHeight) >= (element.scrollHeight - 1)) && evt.deltaY >= 0)) {
              inlineElement.style.transition = 'all ' + duration + 'ms ' + timingFunction;
              inlineElement.style.transform = 'translateY(' + ((evt.deltaY * -1) * power) + 'px)';
              if (inlineElement.parentElement.lastElementChild == inlineElement) {
                inlineElement.style.marginBottom = ((evt.deltaY) * power) + 'px';
              }
              setTimeout(function() {
                inlineElement.style.transition = 'all ' + durationBacking + 'ms ' + timingFunction + ' ' + (index * timePadding) + 'ms';
                inlineElement.style.transform = '';
                if (inlineElement.parentElement.lastElementChild == inlineElement) {
                  inlineElement.style.marginBottom = '';
                }
                setTimeout(function() {
                  inlineElement.style.transition = '';
                }, durationBacking);
              }, duration);
            }
          }
        }
      });
    });

    element.addEventListener('onmouseup', function() {
      isBouncing = false;
    });
  });
})();
