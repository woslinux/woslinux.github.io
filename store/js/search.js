'use strict';

(function() {
  var searchbox = document.querySelector('header .searchbox');
  var searchResults = document.getElementById('search-results');
  var searchHistory = JSON.parse(localStorage.getItem('store_searchHistory')) || [];

  searchbox.onfocus = function() {
    searchResults.classList.add('visible')
  };

  searchbox.onblur = function() {
    setTimeout(function() {
      searchResults.classList.remove('visible');
    }, 100);
  };

  searchbox.addEventListener('keydown', function(evt) {
    var results = document.querySelectorAll('#search-results li');
    results.forEach(function(result) {
      setTimeout(function() {
        if (searchbox.value !== '') {
          if (result.innerText.toLowerCase().includes(searchbox.value.toLowerCase())) {
            result.style.display = '';
          } else {
            result.style.display = 'none';
          }
        } else {
          result.style.display = '';
        }
      });
    });

    if (evt.keyCode == 13) {
      if (searchbox.value !== '' && searchbox.value !== searchHistory[searchHistory.length - 1]) {
        searchHistory[searchHistory.length] = searchbox.value;
        localStorage.setItem('store_searchHistory', JSON.stringify(searchHistory));
        searchResults.innerHTML = '';

        searchHistory.forEach(function(item, index) {
          if (index >= searchHistory.length - 8) {
            var list = document.createElement('li');
            list.setAttribute('data-icon', 'history');
            list.innerText = item;
            list.onclick = function() {
              searchbox.value = item;
              searchbox.focus();
            };
            setTimeout(function() {
              searchResults.appendChild(list);
            }, searchHistory.length - index);
          }
        });
      }

      location.href = '?q=' + searchbox.value;
      searchbox.blur();
    }
  });

  searchHistory.forEach(function(item, index) {
    if (index >= searchHistory.length - 8) {
      var list = document.createElement('li');
      list.setAttribute('data-icon', 'history');
      list.innerText = item;
      list.onclick = function() {
        searchbox.value = item;
        searchbox.focus();
      };
      setTimeout(function() {
        searchResults.appendChild(list);
      }, searchHistory.length - index);
    }
  });
})();
