'use strict';

!(function(exports) {
  function changeFavicon(href) {
    var link = document.querySelector('link[rel~="icon"]');
    if(!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = href;
  }

  exports.changeFavicon = changeFavicon;
})(window);
