'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var username = document.getElementById('username');
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var passwordConfirm = document.getElementById('password-confirm');
  var error = document.getElementById('error');
  error.classList.add('hidden');

  var submitButton = document.getElementById('submit-button');
  var cancelButton = document.getElementById('cancel-button');

  var profilePicture = 'https://ui-avatars.com/api/?name=' + username.value.replaceAll(' ', '+') + '&background=random';

  submitButton.onclick = function(evt) {
    evt.preventDefault();
    if (password.value == passwordConfirm.value) {
      try {
        window.WOS_LOGIN.writeUserData(username.value, email.value, password.value, profilePicture);
      } catch(e) {
        error.classList.remove('hidden');
      }
    } else {
      error.classList.remove('hidden');
    }
  };
  cancelButton.onclick = function(evt) {
    evt.preventDefault();
    location.href = '/';
  };
});
