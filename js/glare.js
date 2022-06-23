'use strict';

(function() {
  var glareElement = document.querySelectorAll('[data-glare]');
  setInterval(function() {
    glareElement.forEach(function(element) {
      element.addEventListener('mousemove', function(event) {
        event.preventDefault();
        let rect = event.target.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        element.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.125), transparent)`;
      });

      element.addEventListener('mouseleave', function(event) {
        event.preventDefault();
        element.style.backgroundImage = 'none';
      });
    });
  }, 1000);
})();
