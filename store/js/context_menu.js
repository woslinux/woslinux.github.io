'use strict';

(function() {
  var contextMenu = document.getElementById('context-menu');
  document.addEventListener('click', function() {
    setTimeout(function() {
      contextMenu.classList.remove('visible');
    }, 100);
  });

  window.openContextMenu = function(x, y, items) {
    contextMenu.classList.add('visible');
    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
    contextMenu.innerHTML = '';
    items.forEach(function(item) {
      var button = document.createElement('button');
      button.innerText = item.text;
      button.dataset.l10n = item.l10n;
      button.onclick = item.onclick;
      contextMenu.appendChild(button);
    });
  };
})();
