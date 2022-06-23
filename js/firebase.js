// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-analytics.js";
import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
import { Firestore, doc } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";
import { ref as sRef } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3yIHNzt1psa2IXoz6sIy_TzzoWilQ7AA",
  authDomain: "wos-services.firebaseapp.com",
  projectId: "wos-services",
  storageBucket: "wos-services.appspot.com",
  messagingSenderId: "737034653059",
  appId: "1:737034653059:web:e001e8bdbe010bbe5ffab6",
  measurementId: "G-X801B0LEF9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();
const db = new Firestore(app);

window.addEventListener('load', function() {
  var loginButton = document.getElementById('login-button');
  var profilePicture = document.getElementById('profile-picture');
  if (profilePicture) {
    profilePicture.style.display = 'none';
  }

  if (localStorage.getItem('wos_login')) {
    var user = {};

    var userId = localStorage.getItem('wos_login');
    if (loginButton) {
      loginButton.style.display = 'none';
    }
    if (profilePicture) {
      profilePicture.style.display = 'block';
    }

    console.log('Fetching values from servers...');
    var username = ref(database, 'users/' + userId + '/username');
    var profile_picture = ref(database, 'users/' + userId + '/profile_picture');
    var description = ref(database, 'users/' + userId + '/description');
    var phone_number = ref(database, 'users/' + userId + '/phone_number');
    var date_created = ref(database, 'users/' + userId + '/date_created');

    onValue(username, function(snapshot) {
      const data = snapshot.val();
      if (profilePicture) {
        profilePicture.title = data;
      }
      user = Object.assign(user, { username: data });
    });
    onValue(profile_picture, function(snapshot) {
      const data = snapshot.val();
      if (profilePicture) {
        profilePicture.style.backgroundImage = 'url(' + data + ')';
      }
      user = Object.assign(user, { profile_picture: data });
    });
    onValue(description, function(snapshot) {
      const data = snapshot.val();
      user = Object.assign(user, { description: data });
    });
    onValue(phone_number, function(snapshot) {
      const data = snapshot.val();
      user = Object.assign(user, { phone_number: data });
    });
    onValue(date_created, function(snapshot) {
      const data = snapshot.val();
      user = Object.assign(user, { date_created: data });
    });
  }

  // Custom attributes.
  var usernames = document.querySelectorAll('[data-user-name]');
  var profilePictures = document.querySelectorAll('[data-user-avatar]');
  var descriptions = document.querySelectorAll('[data-user-desc]');
  var phoneNumbers = document.querySelectorAll('[data-user-tel]');
  var dateCreated = document.querySelectorAll('[data-user-date]');

  setInterval(function() {
    usernames.forEach(function(node) {
      if (node.nodeName == 'INPUT') {
        node.value = user.username;
        node.nextElementSibling.style.display = 'none';
        node.addEventListener('keydown', function(evt) {
          setTimeout(function() {
            if (node.value == user.username) {
              node.nextElementSibling.style.display = 'block';
            } else {
              node.nextElementSibling.style.display = 'none';
            }
          });
        });
      } else {
        node.innerText = user.username;
      }
    });
    profilePictures.forEach(function(node) {
      switch(node.nodeName) {
        case 'IMG':
          node.src = user.profile_picture;
          break;
        default:
          node.style.backgroundImage = 'url(' + user.profile_picture + ')';
          break;
      }
      node.onclick = function() {
        var filePicker = document.createElement('input');
        filePicker.type = 'file';
        filePicker.click();
        filePicker.addEventListener('change', function() {
          function getBase64(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
              window.WOS_LOGIN.changeAvatar(reader.result);
            };
            reader.onerror = function (error) {
              console.log('Error: ', error);
            };
          }

          var file = filePicker.files[0];
          getBase64(file);
        });
      };
    });
    descriptions.forEach(function(node) {
      switch(node.nodeName) {
        case 'INPUT':
          node.value = user.description;
          node.addEventListener('keydown', function(evt) {
            switch(evt.keyCode) {
              case 13:
                // ...
                break;
            }
          });
          break;
        default:
          node.innerText = user.description;
          break;
      }
    });
    phoneNumbers.forEach(function(node) {
      switch(node.nodeName) {
        case 'INPUT':
          node.value = user.phone_number;
          node.addEventListener('keydown', function(evt) {
            switch(evt.keyCode) {
              case 13:
                // ...
                break;
            }
          });
          break;
        default:
          node.innerText = user.phone_number;
          break;
      }
    });
    dateCreated.forEach(function(node) {
      switch(node.nodeName) {
        case 'INPUT':
          node.value = user.date_created;
          break;
        default:
          node.innerText = new Date(user.date_created || 0);
          break;
      }
    });
  }, 1000);
});

window.WOS_LOGIN = {};

window.WOS_LOGIN.writeUserData = function(name, email, password, imageUrl) {
  var userId = parseInt(Math.random() * 2147483647);
  var dateCreated = Date.now();
  set(ref(database, 'users/' + userId), {
    username: name,
    email: email,
    password: password,
    profile_picture: imageUrl,
    preferences: {},
    description: '',
    phone_number: '',
    date_created: dateCreated,
    devices: []
  });
  window.WOS_LOGIN.inputUserDataWithId(userId);
  location.href = '/';
}

window.WOS_LOGIN.inputUserDataWithId = function(userId) {
  localStorage.setItem('wos_login', userId);
  console.log('Logging in as ' + userId);
};

window.WOS_LOGIN.inputUserData = function(username, password) {
  var users = ref(database, 'users');
  console.log('Fetching logins from servers...');

  onValue(users, function(snapshot) {
    const data = snapshot.val();
    var entries = Object.entries(data);
    entries.forEach(function(entry) {
      if (entry[1].username == username || entry[1].email == username) {
        if (entry[1].password == password) {
          localStorage.setItem('wos_login', entry[0]);
          console.log('Logging in as ' + entry[1].email + ' with password ' + entry[1].password);
        } else {
          console.log('Invalid login password.');
        }
      } else {
        console.error('Invalid login username.');
      }
    });
  });
};

window.WOS_LOGIN.changeAvatar = function(href) {
  set(ref(database, 'users/' + localStorage.getItem('wos_login') + '/profile_picture'), href);
}
window.WOS_LOGIN.changeUsername = function(text) {
  set(ref(database, 'users/' + localStorage.getItem('wos_login') + '/username'), text);
}
window.WOS_LOGIN.changeAttribute = function(attr, value) {
  set(ref(database, 'users/' + localStorage.getItem('wos_login') + '/' + attr), value);
}
