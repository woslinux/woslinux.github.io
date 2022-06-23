'use strict';

window.onlogin = function(data) {};

document.addEventListener('DOMContentLoaded', function() {
  var frame = document.getElementById('frame');
  function parseMCWEmbed(file) {
    file = file !== '' ? file : 'pages/index.html';
    var client = new XMLHttpRequest();
    client.open('GET', file);
    client.onreadystatechange = function() {
      frame.innerHTML = '<!-- MCW Embed: ' + file + ' -->' +
          client.responseText.replaceAll('script ', 'script async="true" ');
    }
    client.send();
  }

  if (location.search !== '') {
    var pramaters = location.search.split('?')[1];
    let params_arr = pramaters.split('&');
    for (let i = 0; i < params_arr.length; i++) {
      let pair = params_arr[i].split('=');
      if (pair[0] == 'p') {
        if (pair[1]) {
          parseMCWEmbed('pages/' + pair[1] + '.html');
        }
      } else if (pair[0] == 'blog') {
        if (pair[1]) {
          var iframe = document.createElement('iframe');
          iframe.src = 'https://woslinux.github.io/blog/' + pair[1];
          frame.appendChild(iframe);
        }
      }
    }
  } else {
    parseMCWEmbed('pages/index.html');
    frame.classList.remove('markdown');
  }

  var links = document.querySelectorAll('a[href]');
  links.forEach(function(node) {
    if (node.href.startsWith('?p=')) {
      var content = node.href.replaceAll('?p=', '');
      node.href = '#';
      node.onclick = function(evt) {
        parseMCWEmbed('pages/' + content + '.html');
      };
    }
  });
});