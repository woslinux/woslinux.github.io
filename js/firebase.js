// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
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

window.addEventListener('load', function() {
  setDBItem('users/' + loginId + '/is_online', true);
});
window.addEventListener('beforeunload', function() {
  setDBItem('users/' + loginId + '/is_online', false);
});

var identifier = (navigator.appCodeName + navigator.appName + navigator.deviceMemory + window.outerWidth + window.outerHeight + navigator.platform).replaceAll(' ', '').toLowerCase();
try {
  navigator.getBattery().then(function(battery) {
    updateInfo(battery);
  });
} catch(e) {
  updateInfo({level: 0.75});
};

function updateInfo(battery) {
  setInterval(function() {
    getDBItem('users/' + loginId + '/username', function(data) {
      var shortName = data.split(/(?=[A-Z])/);
      if (shortName.includes(' ')) {
        shortName = shortName[0].split(' ', '');
      }
      shortName = shortName[0].toString();

      setDBItem('users/' + loginId + '/devices/' + identifier + '/name', shortName);
      setDBItem('users/' + loginId + '/devices/' + identifier + '/model', navigator.platform);
      setDBItem('users/' + loginId + '/devices/' + identifier + '/userAgent', navigator.userAgent);
      setDBItem('users/' + loginId + '/devices/' + identifier + '/battery', battery.level);
    });
    setDBItem('users/' + loginId + '/last_active', Date.now());
  }, 3000);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase();

export var loginId = localStorage.getItem('wos_login');
export var isUserLoggedIn = loginId !== null ? true : false;
export var userHref = '/';

// User data
export function getDBItem(path, callback) {
  var username = ref(database, path);
  onValue(username, function(snapshot) {
    const data = snapshot.val();
    callback(data);
  });
}
export function setDBItem(path, text) {
  set(ref(database, path), text);
}

// Outer user calls
export function writeUserData(name, email, password, imageUrl = undefined) {
  var userId = parseInt(Math.random() * 2147483647);
  var dateCreated = Date.now();
  
  function check() {
    var idCheck = ref(database, 'users/' + userId);
    onValue(idCheck, function(snapshot) {
      const data = snapshot.val();
      var entries = Object.entries(data);
      var usedId = (entries[0] == userId);
      if (usedId) {
        userId = parseInt(Math.random() * 2147483647);
        check();
      } else {
        create();
      }
    });
  }
  check();

  function create() {
    setDBItem('users/' + userId, {
      username: name,
      email: email,
      password: password,
      profile_picture: imageUrl || 'https://ui-avatars.com/api/?name=' + name.replaceAll(' ', '+') + '&background=random',
      preferences: {},
      description: '',
      phone_number: '',
      date_created: dateCreated,
      devices: {},
      is_moderator: false,
      is_verified: false,
      notifications: {},
      clipboard: {},
      shopping_list: {},
      is_developer: false,
      is_supporter: false,
      last_active: dateCreated
    });
    inputUserDataWithId(userId);
    location.href = '/';
  }
}

export function inputUserDataWithId(userId) {
  localStorage.setItem('wos_login', userId);
  loginId = userId;
  console.log('Logging in as ' + userId);
};

export function inputUserData(username, password) {
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

export function openLoginPrompt(type = 'login', callback) {
  var style = document.createElement('style');
  style.type = 'text/css';
  document.body.appendChild(style);
  style.innerHTML = `
    .wosui-login {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: end;
      background: rgba(0,0,0,0.5);
      z-index: 100;
      font-size: 16px;
    }

    .wosui-login > section {
      width: calc(100% - 20px);
      padding: 0 15px;
      box-sizing: border-box;
      background: #fff;
      box-shadow: 0 1rem 2rem rgba(0,0,0,0.2), 0 0.3rem 0.6rem rgba(0,0,0,0.3), 0 0.1rem 0.2rem rgba(0,0,0,0.2);
      margin: 10px;
      max-height: calc(100% - 55px);
      border-radius: 12px;
    }

    .wosui-login > section.opening {
      animation: wosui-dialogOpen 0.3s cubic-bezier(0.2, 0.9, 0.1, 1.25) forwards;
    }

    .wosui-login > section.closing {
      animation: wosui-dialogClose 0.3s cubic-bezier(0.2, 0.9, 0.1, 1.0) forwards;
    }

    @keyframes wosui-dialogOpen {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1.0);
        opacity: 1;
      }
    }

    @keyframes wosui-dialogClose {
      from {
        transform: scale(1.0);
        opacity: 1;
      }
      to {
        transform: scale(0.9);
        opacity: 0;
      }
    }

    .wosui-login > section h1 {
      font-weight: bold;
      font-size: 16px;
      padding: 0 15px;
      box-sizing: border-box;
      margin: 0;
      height: 44px;
      line-height: 44px;
      border-bottom: solid 0.1rem rgba(0,0,0,0.125);
      overflow: hidden;
      display: block;
    }

    .wosui-login > section label {
      font-weight: normal;
      font-size: 16px;
      padding: 10px 15px;
      box-sizing: border-box;
      margin: 0;
      line-height: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .wosui-login > section label > input {
      margin: 0;
      height: 40px;
      line-height: 40px;
      background: #e7e9ec;
      border-radius: 4px;
      border: none;
      padding: 0 15px;
      box-sizing: border-box;
      font-size: 16px;
      color: #333;
    }

    .wosui-login > section a {
      display: block;
      padding: 10px 15px;
      color: #0061e0
    }

    .wosui-login menu {
      width: calc(100% + 22px);
      height: 70px;
      padding: 15px 5px 15px 15px;
      margin: 0 -11px 4px;
      display: flex;
      box-sizing: border-box;
      border-radius: 8px;
      background: #e7e7e7;
    }

    .wosui-login menu button {
      height: 40px;
      line-height: 40px;
      background: transparent;
      border-radius: 20px;
      border: none;
      padding: 0 20px;
      margin: 0 0 0 10px;
      font-size: 16px;
      color: #333;
      transition: background-color 0.2s;
      flex: 1
    }
    .wosui-login menu button {
      margin: 0 10px 0 0;
    }

    .wosui-login menu button.recommend {
      background: #0061e0;
      color: #fff;
    }

    .wosui-login menu button.recommend:hover {
      background: #0051d0;
    }

    .wosui-login menu button.recommend:active {
      background: #0041c0;
    }

    .wosui-login menu button:hover {
      background-color: rgba(0,0,0,0.05);
      transition: none;
    }

    .wosui-login menu button:active {
      background-color: rgba(0,0,0,0.1);
      transition: none;
    }

    @media screen and (min-width: 600px) {
      .wosui-login {
        align-items: center;
      }

      .wosui-login > section {
        width: 400px;
      }
    }
  `;

  var container = document.createElement('div');
  container.classList.add('wosui-login');
  document.body.appendChild(container);
  document.body.style.overflow = 'hidden';

  container.addEventListener('keydown', function(evt) {
    switch (evt.keyCode) {
      case 8:
      case 27:
        close();
        break;
    }
  });

  var dialog = document.createElement('section');
  dialog.classList.add('opening');
  dialog.addEventListener('transitionend', function() {
    dialog.classList.remove('opening');
  });
  container.appendChild(dialog);

  function close() {
    dialog.classList.add('closing');
    setTimeout(function() {
      dialog.classList.remove('closing');

      container.remove();
      style.remove();
      document.body.style.overflow = null;
    }, 300);
  }

  if (type == 'login') {
    dialog.innerHTML = `
      <section>
        <h1 data-l10n-id="login">Login</h1>
        <label>
          <span data-l10n-id="login-email">Email</span>
          <input data-l10n-id="login-email-input" type="email" class="email-input">
        </label>
        <label>
          <span data-l10n-id="login-password">Password</span>
          <input data-l10n-id="login-password-input" type="password" class="password-input">
        </label>
        <a href="#" class="signup-instead" data-l10n-id="login-createNew">Create New Account</a>
      </section>
      <menu>
        <button class="cancel-button" data-l10n-id="cancel">Cancel</button>
        <button class="login-button recommend" data-l10n-id="login">Login</button>
      </menu>
    `;
    var email = dialog.querySelector('.email-input');
    var password = dialog.querySelector('.password-input');
    var signUpInstead = dialog.querySelector('.signup-instead');
    var submitButton = dialog.querySelector('.login-button');
    var cancelButton = dialog.querySelector('.cancel-button');

    signUpInstead.onclick = function(evt) {
      close();
      openLoginPrompt('signup');
    };
    submitButton.onclick = function(evt) {
      try {
        inputUserData(email.value, password.value);
      } catch(e) {
        alert('Something went wrong whilst trying to login...');
      }
      close();
      callback();
    };
    cancelButton.onclick = function(evt) {
      close();
    };
  } else if (type == 'signup') {
    dialog.innerHTML = `
      <section>
        <h1 data-l10n-id="signUp">Sign Up</h1>
        <label>
          <span data-l10n-id="signUp-username">Username</span>
          <input data-l10n-id="signUp-username-input" type="text" class="username-input">
        </label>
        <label>
          <span data-l10n-id="signUp-email">Email</span>
          <input data-l10n-id="signUp-email-input" type="email" class="email-input">
        </label>
        <label>
          <span data-l10n-id="signUp-password">Password</span>
          <input data-l10n-id="signUp-password-input" type="password" class="password-input">
        </label>
        <label>
          <span data-l10n-id="signUp-passwordConfirm">Confirm Password</span>
          <input data-l10n-id="signUp-passwordConfirm-input" type="password" class="passwordconfirm-input">
        </label>
        <a href="#" class="login-instead" data-l10n-id="signUp-useExisting">Use Existing Login</a>
      </section>
      <menu>
        <button class="cancel-button" data-l10n-id="cancel">Cancel</button>
        <button class="signup-button recommend" data-l10n-id="signUp">Sign Up</button>
      </menu>
    `;
    var username = dialog.querySelector('.username-input');
    var email = dialog.querySelector('.email-input');
    var password = dialog.querySelector('.password-input');
    var passwordConfirm = dialog.querySelector('.passwordconfirm-input');
    var loginInstead = dialog.querySelector('.login-instead');
    var submitButton = dialog.querySelector('.signup-button');
    var cancelButton = dialog.querySelector('.cancel-button');

    loginInstead.onclick = function(evt) {
      close();
      openLoginPrompt('login');
    };
    submitButton.onclick = function(evt) {
      try {
        writeUserData(username.value, email.value, password.value, passwordConfirm.value);
      } catch(e) {
        alert('Something went wrong whilst trying to sign up...');
      }
      close();
      callback();
    };
    cancelButton.onclick = function(evt) {
      close();
    };
  }
}
