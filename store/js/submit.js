'use strict';

import { getUsername, submitWebapp } from "../../js/firebase";

(function() {
  var submitDialog = document.getElementById('submit');
  var submitName = submitDialog.querySelector('[data-input="name"]');
  var submitDescription = submitDialog.querySelector('[data-input="name"]');
  var submitIcon = submitDialog.querySelector('[data-input="icon"]');
  var submitGitRepo = submitDialog.querySelector('[data-input="git-repo"]');
  var submitDownload = submitDialog.querySelector('[data-input="download"]');
  var submitRole = submitDialog.querySelector('[data-input="role"]');
  var submitLicense = submitDialog.querySelector('[data-input="license"]');
  var submitHasAds = submitDialog.querySelector('[data-input="has-ads"]');
  var submitHasTracking = submitDialog.querySelector('[data-input="has-tracking"]');
  var submitTags = submitDialog.querySelector('[data-input="tags"]');
  var submitCategory = submitDialog.querySelector('[data-input="category"]');
  var submitSlug = submitDialog.querySelector('[data-input="slug"]');
  var submitScreenshots = submitDialog.querySelector('[data-input="screenshots"]');
  var submitButton = submitDialog.querySelector('[data-action="jsonify"]');

  var submitMessage = document.getElementById('submit-message');  

  submitButton.onclick = function() {
    console.log('Creating app named ' + submitName.value + ' in the database.');
    getUsername(function(username) {
      submitWebapp({
        'name': submitName.value,
        'description': submitDescription.value,
        'icon': submitIcon.file[0],
        'git_repo': submitGitRepo.value,
        'download': {
          'url': submitDownload.file[0],
          'manifest': submitManifest.file[0]
        },
        'type': submitRole.value,
        'license': submitLicense.value,
        'author': username,
        'maintainer': username,
        'has_ads': submitHasAds.checked,
        'has_tracking': submitHasTracking.checked,
        'meta': {
          'tags': submitTags.value,
          'categories': submitCategory.value
        },
        'slug': submitSlug.value,
        'screenshots': JSON.stringify(submitScreenshots)
      });
    });
    submitDialog.classList.remove('visible');
    submitMessage.style.display = 'block';
    setTimeout(function() {
      submitMessage.style.display = 'none';
    }, 3000);
  };
})();
