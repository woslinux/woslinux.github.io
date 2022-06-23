'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var data = {};
  var header = document.getElementById('header');
  var searchBox = document.getElementById('header-searchbox');
  var news = document.getElementById('news');

  searchBox.addEventListener('keydown', function(evt) {
    if (evt.keyCode == 13) {
      var newsList = news.querySelectorAll('li');
      newsList.forEach(function(item) {
        if (searchBox.value !==  '') {
          if (item.innerText.includes(searchBox.value)) {
            item.innerHTML.replaceAll('<mark>', '');
            item.innerHTML.replaceAll('</mark>', '');
            item.innerHTML.replaceAll(searchBox.value, '<mark>' + searchBox.value + '</mark>');
            item.style.display = '';
          } else {
            item.innerHTML.replaceAll('<mark>', '');
            item.innerHTML.replaceAll('</mark>', '');
            item.style.display = 'none';
          }
        } else {
          item.style.display = '';
        }
      });
    }
  });

  var date = new Date();
  var lastMonth = date.getFullYear() + '-' + date.getMonth() + '-' + date.getUTCDate();
  console.log('Last month was at ' + lastMonth);

  var client = new XMLHttpRequest();
  client.open('GET', 'https://newsapi.org/v2/everything?q=news&from=' + lastMonth + '&language=' + navigator.language + '&sortBy=publishedAt&apiKey=4930e7035f9e4bcca838a594141153f9');
  client.onreadystatechange = function() {
    data = JSON.parse(client.responseText);
    init();
  }
  client.send();

  function init() {
    news.innerHTML = '';

    data.articles.forEach(function(article, index) {
      var element = document.createElement('li');
      var image = document.createElement('img');
      var textHolder = document.createElement('div');
      var title = document.createElement('p');
      var author = document.createElement('p');
      var content = document.createElement('p');
      var source = document.createElement('p');

      element.onclick = function() {
        location.href = article.url;
      };
      element.style.animationDelay = (index * 50) + 'ms';
      image.src = article.urlToImage;
      element.appendChild(image);

      textHolder.classList.add('vbox');
      title.innerText = article.title;
      title.style.fontWeight = 'bold';
      title.style.textTransform = 'uppercase';
      textHolder.appendChild(title);
      author.innerText = article.author;
      textHolder.appendChild(author);
      content.innerText = article.content.replaceAll('\r\n', ', ');
      content.style.fontWeight = 'bold';
      textHolder.appendChild(content);
      source.innerText = article.source.name;
      source.classList.add('source');
      textHolder.appendChild(source);
      element.appendChild(textHolder);

      news.appendChild(element);
    });
  }
});
