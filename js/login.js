'use strict';
import { inputUserData } from '/js/firebase.js';

document.addEventListener('DOMContentLoaded', function() {
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var submitButton = document.getElementById('submit-button');
  var cancelButton = document.getElementById('cancel-button');
  var error = document.getElementById('error');
  error.classList.add('hidden');

  submitButton.onclick = function(evt) {
    evt.preventDefault();
    try {
      inputUserData(email.value, password.value);
    } catch(e) {
      error.classList.remove('hidden');
    }
  };
  cancelButton.onclick = function(evt) {
    evt.preventDefault();
    location.href = '/';
  };
});
