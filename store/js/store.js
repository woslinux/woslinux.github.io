'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var loadingScreen = document.getElementById('loading-screen');
  var searchbox = document.querySelector('#root .searchbox');
  var rootToolbar = document.querySelector('#root menu[type="toolbar"]');
  var webappToolbar = document.querySelector('#webapp menu[type="toolbar"]');
  var loginButton = document.getElementById('login-button');
  var profilePicture = document.getElementById('profile-picture');
  loadingScreen.classList.add('visible');

  var webappBackButton = document.getElementById('webapp-back');
  webappBackButton.onclick = function() {
    var page = document.getElementById('webapp');
    
    page.classList.remove('visible');
    window.history.pushState({}, "", '/store/');
    rootToolbar.appendChild(loginButton);
    rootToolbar.appendChild(profilePicture);
  };

  var verifiedCreators = [
    "MortCodesWeb",
    "WOS Studios",
    "Google",
    "Google LLC",
    "Microsoft",
    "Apple Inc.",
    "Huawei",
    "Huawei Inc.",
    "Huawei Technologies Inc.",
    "Xiaomi Inc.",
    "Mozilla",
    "Mozilla Apps",
    "The Gaia Team",
    "KaiOS Technologies",
    "Facebook",
    "Meta",
    "Twitter",
    "Twitter Inc.",
    "Discord"
  ]

  var data, data_old, data_ratings, data_downloads;
  var database = "/store/database/database.json";

  fetch(database)
    .then((response) => response.json())
    .catch((e) => {
      console.log(e);
      alert("Failed to download database\nPlease reload the page.");
    })
    .then((response) => {
      data = response;
      if (document.readyState === "complete" || document.readyState === "interactive") {
        initCategories();
        init();
        loadingScreen.classList.remove('visible');
      } else {
        window.addEventListener("DOMContentLoaded", function() {
          initCategories();
          init();
          loadingScreen.classList.remove('visible');
        });
      }
    });

  function initCategories() {
    var webappsContainer = document.getElementById('webapps');
    var entries = Object.entries(data.categories);
    for(var i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var value = entries[i][1];
      if (webappsContainer) {
        webappsContainer.innerHTML += `
          <div id="${key}" class="category">
            <ul></ul>
            <header data-l10n-id="storeCategory-${key}">${value.name}</header>
            <p data-l10n-id="storeCategory-${key}-desc">${value.description}</p>
          </div>`;
      }
    }
    if (webappsContainer) {
      webappsContainer.innerHTML += `
          <div id="misc" class="category">
            <ul></ul>
            <header data-l10n-id="storeCategory-misc">Miscellaneous</header>
            <p data-l10n-id="storeCategory-misc-desc">Miscellaneous apps that needs to get a life.</p>
          </div>`;
    }
  }

  function init() {
    var webappsContainer = document.getElementById('webapps');
    data.apps.forEach(function(app, index) {
      var webapp = document.createElement('li');
      var webappLink = document.createElement('a');
      var webappIcon = document.createElement('img');
      var webappDiv = document.createElement('div');
      var webappTitle = document.createElement('p');
      var webappCategory = document.createElement('p');
      var webappAuthor = document.createElement('p');
      var webappNumber = document.createElement('span');
      var webappCanvas = document.createElement('canvas');

      var delay = (index * 10);
      if (delay > 500) {
        delay = 500;
      }
      webapp.style.animationDelay = delay + 'ms';
      if (app.not_a_wos_app) {
        webapp.setAttribute('data-l10n-id', 'notWosApp');
      }
      webapp.addEventListener('contextmenu', function(evt) {
        evt.preventDefault();
        window.openContextMenu(evt.clientX, evt.clientY, [
          { text: 'Install', l10n: 'storeApp-install', onclick: () => {
            webapp.classList.add('installing');
            downloadApp(webappCanvas, app.download.url, webappNumber, function() {
              webapp.classList.remove('installing');
            });
          } }
        ]);
      });

      webappLink.href = '?webapp=' + app.slug;
      webappLink.onclick = function(evt) {
        evt.preventDefault();
        window.history.pushState({}, "", '?webapp=' + app.slug);
        webappPage(app.slug);
      };
      webapp.appendChild(webappLink);

      webappIcon.src = app.icon;
      webappIcon.onerror = function() {
        webappIcon.src = 'style/images/default.png';
      };
      webappLink.appendChild(webappIcon);

      webappDiv.style.flex = 1;
      webappLink.appendChild(webappDiv);

      webappTitle.innerText = app.name;
      webappTitle.classList.add('title');
      webappDiv.appendChild(webappTitle);
      webappCategory.innerText = app.meta.categories.toString().replace(',', ', ');
      webappCategory.setAttribute('data-l10n-id', 'storeCategory-' + app.meta.categories.toString().replaceAll(',', ', '));
      webappDiv.appendChild(webappCategory);
      verifiedCreators.forEach(function(verifiedCreator) {
        if (verifiedCreator == app.author[0]) {
          webappAuthor.innerHTML = app.author.toString().replaceAll(',', ', ') + '<span data-icon="tick-circle"></span>';
        } else {
          webappAuthor.innerText = app.author.toString().replaceAll(',', ', ');
        }
      });
      webappDiv.appendChild(webappAuthor);

      webappNumber.classList.add('percentage');
      webappDiv.appendChild(webappNumber);
      webappCanvas.classList.add('progress');
      webappDiv.appendChild(webappCanvas);

      var categoryContainer = document.querySelector('#' + app.meta.categories[0].toLowerCase() + ' > ul');
      var categoryMiscContainer = document.querySelector('#misc > ul');
      if (categoryContainer) {
        categoryContainer.appendChild(webapp);
      } else {
        categoryMiscContainer.appendChild(webapp);
      }
    });

    if (location.search !== '') {
      var pramaters = location.search.split('?')[1];
      let params_arr = pramaters.split('&');
      for (let i = 0; i < params_arr.length; i++) {
        let pair = params_arr[i].split('=');
        if (pair[0] == 'q') {
          if (pair[1] !== '') {
            var posters = document.getElementById('posters');
            var searchTitle = document.getElementById('search-title');
            var categories = document.querySelectorAll('.webapps .category');
            var apps = document.querySelectorAll('.webapps .category ul > li');

            posters.style.display = 'none';
            categories.forEach(function(app) {
              if (app.innerText.toLowerCase().includes(pair[1].toLowerCase())) {
                app.style.display = '';
              } else {
                app.style.display = 'none';
              }
            });
            apps.forEach(function(app) {
              if (app.innerText.toLowerCase().includes(pair[1].toLowerCase())) {
                app.style.display = 'block';
              } else {
                app.style.display = 'none';
              }
            });
            searchTitle.style.display = 'block';
            searchTitle.dataset.l10nArgs = '{"q":"' + pair[1] + '"}';
            searchbox.value = pair[1];
          }
        } else if (pair[0] == 'webapp') {
          webappPage(pair[1]);
        }
      }
    }

    function webappPage(webapp) {
      webappToolbar.appendChild(loginButton);
      webappToolbar.appendChild(profilePicture);
      data.apps.forEach(function(app) {
        if (app.slug == webapp) {
          var page = document.getElementById('webapp');
          var pageSection = page.querySelector('section');
          var pageIcon = page.querySelector('.webapp-icon');
          var pageTitle = page.querySelector('.webapp-title');
          var pageCategory = page.querySelector('.webapp-category');
          var pageAuthor = page.querySelector('.webapp-author');
          var pageDetail = page.querySelector('.webapp-detail');
          var pageInstall = page.querySelector('.webapp-install');
          var pageInstallButton = page.querySelector('.webapp-install button:first-of-type');
          var pageInstallOpenButton = page.querySelector('.webapp-install button:nth-child(2)');
          var pageInstallUpdateButton = page.querySelector('.webapp-install button:nth-child(3)');
          var pageInstallProgressContainer = page.querySelector('.webapp-install div');
          var pageInstallProgress = page.querySelector('.webapp-install div canvas');
          var pageScreenshots = page.querySelector('.webapp-screenshots');
          var pageKeyart = page.querySelector('.webapp-keyart');
          var pageReadMore = page.querySelector('.webapp-readmore');
          var pageReadLess = page.querySelector('.webapp-readless');
          var pageTags = page.querySelector('.webapp-tags');
          var pageGitRepo = page.querySelector('.webapp-gitrepo');
          var pageType = page.querySelector('.webapp-type');
          var pageLicense = page.querySelector('.webapp-license');
          var pageAds = page.querySelector('.webapp-ads');
          var pageTracking = page.querySelector('.webapp-tracking');
          var pageDownloads = page.querySelector('.webapp-downloads');
          var pageWarning = page.querySelector('.webapp-warning');
          var pageRating = page.querySelector('.webapp-ratings');
          var pageRatingCount = page.querySelector('.webapp-ratingcount');
          var pageComments = page.querySelector('.webapp-comments');
          var pageSize = page.querySelector('.webapp-size');

          page.classList.add('visible');
          pageIcon.src = app.icon;
          if (!app.not_a_wos_app) {
            pageKeyart.style.setProperty('--color1', colorPicker(app.icon, {colors: 2})[0]);
            pageKeyart.style.setProperty('--color2', colorPicker(app.icon, {colors: 2})[1]);
            pageIcon.onload = function() {
              pageKeyart.style.setProperty('--color1', colorPicker(app.icon, {colors: 2})[0]);
              pageKeyart.style.setProperty('--color2', colorPicker(app.icon, {colors: 2})[1]);
            };
          }
          pageIcon.onerror = function() {
            pageIcon.src = 'style/images/default.png';
          };

          pageTitle.innerText = app.name;
          pageCategory.innerText = app.meta.categories.toString().replaceAll(',', ', ');
          pageCategory.setAttribute('data-l10n-id', 'storeCategory-' + app.meta.categories.toString().replaceAll(',', ', '));
          verifiedCreators.forEach(function(verifiedCreator) {
            if (verifiedCreator == app.author[0]) {
              pageAuthor.innerHTML = app.author.toString().replaceAll(',', ', ') + '<span data-icon="tick-circle"></span>';
            } else {
              pageAuthor.innerText = app.author.toString().replaceAll(',', ', ');
            }
          });
          pageDetail.innerText = app.description;
          pageDetail.style.height = pageDetail.getBoundingClientRect().height + 'px';
          pageDetail.classList.add('read-less');
          pageReadMore.style.display = 'block';
          pageReadLess.style.display = 'none';

          pageReadMore.onclick = function() {
            pageDetail.classList.remove('read-less');
            pageReadMore.style.display = 'none';
            pageReadLess.style.display = 'block';
          };
          pageReadLess.onclick = function() {
            pageDetail.classList.add('read-less');
            pageReadMore.style.display = 'block';
            pageReadLess.style.display = 'none';
          };

          pageInstallProgressContainer.style.display = 'none';
          pageInstallButton.style.display = 'block';
          pageInstallOpenButton.style.display = 'none';
          pageInstallUpdateButton.style.display = 'none';
          downloads.forEach(function(download) {
            if (app.slug == download.slug) {
              pageInstallButton.style.display = 'none';
              pageInstallOpenButton.style.display = 'block';
              pageInstallUpdateButton.style.display = 'block';
            }
          });

          pageInstallButton.onclick = function(evt) {
            downloads[downloads.length] = {
              name: app.name,
              slug: app.slug,
              icon: app.icon 
            };
            localStorage.setItem('store_downloads', JSON.stringify(downloads));
            install();
          };
          pageInstallUpdateButton.onclick = install;

          function install() {
            pageInstallButton.style.display = 'none';
            pageInstallProgressContainer.style.display = 'block';
            pageInstallOpenButton.style.display = 'none';
            pageInstallUpdateButton.style.display = 'none';

            downloadApp(pageInstallProgress, app.download.url, pageInstallProgressContainer.children[0], function() {
              pageInstallProgressContainer.style.display = 'none';
              pageInstallOpenButton.style.display = 'block';
              pageInstallUpdateButton.style.display = 'block';
            });
          };

          pageScreenshots.innerHTML = '';
          app.screenshots.forEach(function(screenshot, index) {
            var image = document.createElement('img');
            image.src = screenshot;
            image.onclick = function() {
              ImageViewer(app.screenshots, index,
                image.getBoundingClientRect().x, image.getBoundingClientRect().y,
                image.getBoundingClientRect().width, image.getBoundingClientRect().height);
            };
            pageScreenshots.appendChild(image);
          });

          pageTags.innerHTML = '';
          app.meta.tags.split('; ').forEach(function(tag) {
            var tagHolder = document.createElement('span');
            tagHolder.innerText = tag.replaceAll(';', '');
            pageTags.appendChild(tagHolder);
          });

          if (app.git_repo !== '') {
            pageGitRepo.innerHTML = '<a href="' + app.git_repo + '">' + app.git_repo + '</a>';
            pageGitRepo.setAttribute('data-l10n-id', '');
          } else {
            pageGitRepo.innerHTML = '';
            pageGitRepo.setAttribute('data-l10n-id', 'none');
          }

          pageType.setAttribute('data-l10n-id', 'storeType-' + app.type);
          pageLicense.innerText = app.license;
          pageAds.setAttribute('data-l10n-id', app.has_ads ? 'yes' : 'no');
          pageTracking.setAttribute('data-l10n-id', app.has_tracking ? 'yes' : 'no');
          if (app.not_a_wos_app) {
            pageDownloads.innerText = data_downloads[app.slug].toLocaleString();
            pageDownloads.setAttribute('data-l10n-id', '');
          } else {
            pageDownloads.setAttribute('data-l10n-id', 'unknown');
          }

          if (!app.not_a_wos_app) {
            pageWarning.style.display = 'none';
          } else {
            pageWarning.style.display = '';
          }

          if (app.not_a_wos_app) {
            pageRating.dataset.rating = data_ratings[app.slug].average_rating;
            pageRating.style.setProperty('--width', (data_ratings[app.slug].average_rating / 5) * 100 + '%');
            pageRatingCount.dataset.l10nArgs = '{"n":"' + data_ratings[app.slug].rating_count + '"}';
          } else {
            pageRating.dataset.rating = 0;
            pageRating.style.setProperty('--width', '100%');
            pageRating.style.setProperty('--width', '0%');
            pageRatingCount.dataset.l10nArgs = '{"n":"0"}';
          }

          function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            var sizes;
            if (navigator.language == 'ar') {
              sizes = ['بايت', 'ك/ب', 'م/ب', 'ج/ب', 'ت/ب', 'ب/ب', 'أي/ب', 'ز/ب', 'ي/ب'];
            } else {
              sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            }
            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)).toLocaleString() + ' ' + sizes[i];
          }

          var fileSize = '';
          var http = new XMLHttpRequest();
          http.open('HEAD', app.download.url, false); // false = Synchronous
          http.send(null); // it will stop here until this http request is complete

          // when we are here, we already have a response, b/c we used Synchronous XHR
          if (http.status === 200) {
            fileSize = formatBytes(http.getResponseHeader('content-length'));
            console.log(http);
            pageSize.innerText = fileSize;
          }

          if (pageComments.querySelector('.utterances')) {
            pageComments.querySelector('.utterances').remove();
          }
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'https://utteranc.es/client.js';
          script.crossOrigin = 'anonymous';
          script.async = true;
          script.setAttribute('repo', 'woslinux/blog');
          script.setAttribute('issue-term', 'title');
          if (localStorage.getItem('dark-mode') == 'true') {
            script.setAttribute('theme', 'github-dark');
          } else {
            script.setAttribute('theme', 'github-light');
          }
          pageComments.appendChild(script);
        }
      });
    }
  }
});
