'use strict';

window.addEventListener('load', function() {
  var header = document.getElementById('header');
  var searchScreen = document.getElementById('search-screen');
  var searchboxContainer = document.getElementById('searchbox-container');
  var searchBox = document.getElementById('header-searchbox');
  var searchResults = document.getElementById('___gcse_0');

  searchBox.addEventListener('keydown', function(evt) {
    if (evt.keyCode == 13) {
      location.search = '?q=' + searchBox.value;
    }
  });

  searchBox.addEventListener('focus', function() {
    var searchSuggestions = document.querySelector('.gstl_50.gssb_c');
    searchSuggestions.style.left = searchBox.getBoundingClientRect().left + 'px';
    searchSuggestions.style.top = (searchBox.getBoundingClientRect().top + searchBox.getBoundingClientRect().height) + 'px';
    searchSuggestions.style.width = searchBox.getBoundingClientRect().width + 'px';
    searchSuggestions.style.display = 'block';
  });

  searchBox.addEventListener('blur', function() {
    var searchSuggestions = document.querySelector('.gstl_50.gssb_c');
    searchSuggestions.style.display = 'none';
  });

  if (location.search !== '') {
    header.style.display = 'block';
    searchScreen.style.display = 'none';
    searchResults.style.display = 'block';

    var pramaters = location.search.split('?')[1];
    let params_arr = pramaters.split('&');
    for (let i = 0; i < params_arr.length; i++) {
      let pair = params_arr[i].split('=');
      if (pair[0] == 'q') {
        var searchQuery = pair[1];
        searchBox.value = searchQuery;
      }
      if (pair[0] == 'type') {
        var tab = document.querySelectorAll('.gsc-tabHeader');
        switch (pair[1]) {
          case 'web':
            tab[0].click();
            break;
          case 'images':
            tab[1].click();
            break;
          default:
            break;
        }
      }
    }
  } else if (location.search == '') {
    header.style.display = 'none';
    searchScreen.style.display = 'flex';
    searchResults.style.display = 'none';
    searchboxContainer.appendChild(searchBox);
  }
});
