'use strict';

(function() {
  var isChrome = navigator.userAgent.includes('Chrom');

  var elements = document.querySelectorAll('[role="region"] > section');
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var timingFunction = 'cubic-bezier(0, 0, 0, 1)';
  var duration = 300;
  var durationBacking = 600;
  var timePadding = 0;
  var power = 2.25;
  if(isChrome) {
    power = power / 6;
  }
  var isBouncing = false;
  var verticalScrollbars = true;
  var horizontalScrollbars = false;

  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    wos-scroll-area {
      display: block;
    }
  `;
  document.body.appendChild(style);

  function initScrollbars(element) {
    window.addEventListener('load', function() {
      if (horizontalScrollbars && ((element.getBoundingClientRect().width <= element.scrollWidth) ||
              ((element.getBoundingClientRect().width <= window.innerWidth)))) {
        var scrollTrackX = document.createElement('wos-scrollbar-track');
        var scrollThumbX = document.createElement('wos-scrollbar-thumb');

        scrollTrackX.classList.add('horizontal');
        element.style.setProperty('scrollbar-width', 'none');

        var y = (element.scrollLeft / element.scrollWidth) * 100;
        var y2 = (element.getBoundingClientRect().height / element.scrollWidth) * 100;
        var sx = 0;
        var sy = 0;

        scrollTrackX.style.left = element.scrollLeft + 'px';
        scrollTrackX.style.top = ((element.offsetHeight - 16) + element.scrollTop) + 'px';
        setInterval(function() {
          y = (element.scrollLeft / element.scrollWidth) * 100;
          y2 = (element.getBoundingClientRect().height / element.scrollWidth) * 100;
          scrollThumbX.style.left = y + '%';
          scrollThumbX.style.width = y2 + '%';
        }, 100);
        element.addEventListener('scroll', function() {
          y = (element.scrollLeft / element.scrollWidth) * 100;
          y2 = (element.getBoundingClientRect().height / element.scrollWidth) * 100;

          scrollTrackX.style.left = element.scrollLeft + 'px';
          scrollTrackX.style.top = ((element.offsetHeight - 16) + element.scrollTop) + 'px';
          scrollThumbX.style.left = y + '%';
          scrollThumbX.style.width = y2 + '%';

          scrollThumbX.style.opacity = 1;

          setTimeout(function() {
            if (sx == element.scrollLeft && sy == element.scrollTop) {
              scrollThumbX.style.opacity = 0;
            }
          }, 3000);
          sx = element.scrollLeft;
          sy = element.scrollLeft;
        });

        var mx = 0;
        var my = 0;
        element.addEventListener('mousemove', function(evt) {
          scrollThumbX.style.opacity = 1;

          setTimeout(function() {
            if (mx == evt.clientX && my == evt.clientY) {
              scrollThumbX.style.opacity = 0;
            }
          }, 3000);
          mx = evt.clientX;
          my = evt.clientY;
        });

        scrollThumbX.onpointerdown = function(e) {
          e = e || window.event;
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onpointerup = function() {
            // stop moving when mouse button is released:
            document.onpointerup = null;
            document.onpointermove = null;
          };
          // call a function whenever the cursor moves:
          document.onpointermove = function(e) {
            e = e || window.event;
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            element.scrollLeft = (element.scrollLeft - pos1) * (element.scrollWidth / element.offsetWidth);
          };
        };

        element.addEventListener('wheel', function(evt) {
          scrollTrackY.style.left = element.scrollLeft + 'px';

          scrollThumbX.style.transform = 'translateY(' + (evt.deltaY * power) + 'px)';
          scrollThumbX.style.transition = 'transform ' + duration + 'ms ' + timingFunction;
          setTimeout(function() {
            scrollThumbX.style.transition = 'transform ' + durationBacking + 'ms ' + timingFunction + ' ' + (timePadding) + 'ms';
            scrollThumbX.style.transform = '';
            setTimeout(function() {
              scrollThumbX.style.transition = null;
            }, durationBacking);
          }, duration);
          scrollThumbX.style.opacity = 1;

          sx = element.scrollLeft;
          sy = element.scrollTop;
        });

        element.appendChild(scrollTrackX);
        scrollTrackX.appendChild(scrollThumbX);
      }
      if (verticalScrollbars && ((element.getBoundingClientRect().height <= element.scrollHeight) ||
                    (element.getBoundingClientRect().height <= window.innerHeight))) {
        var scrollTrackY = document.createElement('wos-scrollbar-track');
        var scrollThumbY = document.createElement('wos-scrollbar-thumb');

        scrollTrackY.classList.add('vertical');
        element.style.setProperty('scrollbar-width', 'none');

        var y = (element.scrollTop / element.scrollHeight) * 100;
        var y2 = (element.getBoundingClientRect().height / element.scrollHeight) * 100;
        var sx = 0;
        var sy = 0;

        scrollTrackY.style.top = element.scrollTop + 'px';
        scrollThumbY.style.top = y + '%';
        setInterval(function() {
          y = (element.scrollTop / element.scrollHeight) * 100;
          y2 = (element.getBoundingClientRect().height / element.scrollHeight) * 100;
          scrollThumbY.style.top = y + '%';
          scrollThumbY.style.height = y2 + '%';
        }, 100);
        element.addEventListener('scroll', function() {
          y = (element.scrollTop / element.scrollHeight) * 100;
          y2 = (element.getBoundingClientRect().height / element.scrollHeight) * 100;

          scrollTrackY.style.top = element.scrollTop + 'px';

          scrollThumbY.style.top = y + '%';
          scrollThumbY.style.height = y2 + '%';
          scrollThumbY.style.opacity = 1;

          setTimeout(function() {
            if (sx == element.scrollLeft && sy == element.scrollTop) {
              scrollThumbY.style.opacity = 0;
            }
          }, 3000);
          sx = element.scrollLeft;
          sy = element.scrollTop;
        });

        var mx = 0;
        var my = 0;
        element.addEventListener('mousemove', function(evt) {
          scrollThumbY.style.opacity = 1;

          setTimeout(function() {
            if (mx == evt.clientX && my == evt.clientY) {
              scrollThumbY.style.opacity = 0;
            }
          }, 3000);
          mx = evt.clientX;
          my = evt.clientY;
        });

        var lastY = 0;
        scrollThumbY.onpointerdown = function(e) {
          e = e || window.event;
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onpointerup = function() {
            // stop moving when mouse button is released:
            document.onpointerup = null;
            document.onpointermove = null;
          };
          // call a function whenever the cursor moves:
          document.onpointermove = function(e) {
            e = e || window.event;
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            lastY = lastY - pos2;
            element.scrollTop = lastY * (element.scrollHeight / element.offsetHeight);
          };
        };

        element.addEventListener('wheel', function(evt) {
          scrollThumbY.style.transform = 'translateY(' + (evt.deltaY * power) + 'px)';
          scrollThumbY.style.transition = 'transform ' + duration + 'ms ' + timingFunction;
          setTimeout(function() {
            scrollThumbY.style.transition = 'transform ' + durationBacking + 'ms ' + timingFunction + ' ' + (timePadding) + 'ms';
            scrollThumbY.style.transform = '';
            setTimeout(function() {
              scrollThumbY.style.transition = '';
            }, durationBacking);
          }, duration);
          scrollThumbY.style.opacity = 1;

          sx = element.scrollLeft;
          sy = element.scrollTop;
        });

        element.appendChild(scrollTrackY);
        scrollTrackY.appendChild(scrollThumbY);
      }
    });
  }

  elements.forEach(function(element) {
    // element.ontouchstart = function(e) {
    //   e = e || window.event;
    //   // get the mouse cursor position at startup:
    //   pos3 = e.clientX;
    //   pos4 = e.clientY;
    //   document.ontouchend = function() {
    //     // stop moving when mouse button is released:
    //     document.ontouchend = null;
    //     document.ontouchmove = null;
    //     element.querySelectorAll('wos-scroll-area').forEach(function(inlineElement) {
    //       inlineElement.style.transition = 'all ' + duration + ' ' + timingFunction;
    //       inlineElement.style.pointerEvents = '';
    //     });
    //   };
    //   // call a function whenever the cursor moves:
    //   document.ontouchmove = function(e) {
    //     e = e || window.event;
    //     // calculate the new cursor position:
    //     pos1 = pos3 - e.clientX;
    //     pos2 = pos4 - e.clientY;
    //     pos3 = e.clientX;
    //     pos4 = e.clientY;
    //     element.querySelectorAll('wos-scroll-area').forEach(function(inlineElement) {
    //       inlineElement.style.transition = '';
    //       inlineElement.style.pointerEvents = 'none';
    //       // set the element's new position:
    //       if (horizontalScrollbars && (inlineElement.scrollWidth >= inlineElement.getBoundingClientRect().width)) {
    //         inlineElement.style.transform = 'translateX(' + (inlineElement.offsetLeft - pos1) + 'px)';
    //       } else if (verticalScrollbars && (inlineElement.scrollHeight >= inlineElement.getBoundingClientRect().height)) {
    //         inlineElement.style.transform = 'translateY(' + (inlineElement.offsetTop - pos2) + 'px)';
    //       } else {
    //         inlineElement.style.transform = 'translate(' + (inlineElement.offsetLeft - pos1) + 'px, ' + (inlineElement.offsetTop - pos2) + 'px)';
    //       }
    //     });
    //   };
    // };

    element.innerHTML = '<wos-scroll-area>' + element.innerHTML + '</wos-scroll-area>';
    initScrollbars(element);

    element.addEventListener('wheel', function(evt) {
      element.querySelectorAll('wos-scroll-area').forEach(function(inlineElement, index) {
        if (!isBouncing) {
          if (element.getBoundingClientRect().width <= element.scrollWidth) {
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
            } else if (((element.scrollLeft >= (element.scrollWidth - element.offsetWidth)) && evt.deltaX >= 0) ||
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
          if (element.getBoundingClientRect().height <= (element.scrollHeight - 1)) {
            if ((element.scrollTop <= 1) && evt.deltaY <= 0) {
              inlineElement.style.transition = 'all ' + duration + 'ms ' + timingFunction;
              inlineElement.style.transform = 'translateY(' + ((evt.deltaY * -1) * power) + 'px)';
              setTimeout(function() {
                inlineElement.style.transition = 'all ' + durationBacking + 'ms ' + timingFunction + ' ' + (index * timePadding) + 'ms';
                inlineElement.style.transform = '';
                setTimeout(function() {
                  inlineElement.style.transition = '';
                }, durationBacking);
              }, duration);
            } else if ((element.scrollTop >= (element.scrollHeight - element.offsetHeight)) && evt.deltaY >= 0) {
              inlineElement.style.transition = 'all ' + duration + 'ms ' + timingFunction;
              inlineElement.style.transform = 'translateY(' + ((evt.deltaY * -1) * power) + 'px)';
              setTimeout(function() {
                inlineElement.style.transition = 'all ' + durationBacking + 'ms ' + timingFunction + ' ' + (index * timePadding) + 'ms';
                inlineElement.style.transform = '';
                setTimeout(function() {
                  inlineElement.style.transition = '';
                }, durationBacking);
              }, duration);
            }
          }
        }
      });
      
      if (isChrome && (element.scrollTop + element.offsetHeight) == element.scrollHeight) {
        element.scrollTop = element.scrollHeight - element.offsetHeight;
      }
    });

    element.addEventListener('onmouseup', function() {
      isBouncing = false;
    });
  });
})();
