// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-analytics.js";
import { getDatabase, ref, set, get, child, onValue, remove } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
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
    set(ref(database, 'users/' + userId), {
      username: name,
      email: email,
      password: password,
      profile_picture: imageUrl || 'https://ui-avatars.com/api/?name=' + name.replaceAll(' ', '+') + '&background=random',
      preferences: {},
      description: '',
      phone_number: '',
      date_created: dateCreated,
      devices: [],
      is_moderator: false,
      is_verified: false
    });
    inputUserDataWithId(userId);
    location.href = '/';
  }
}

export function inputUserDataWithId(userId) {
  localStorage.setItem('wos_login', userId);
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

export function openLoginPrompt(type = 'login') {
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
      width: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      background: #fff;
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

    .wosui-login menu {
      width: 100%;
      height: 70px;
      padding: 15px 0;
      margin: 0;
      display: flex;
      justify-content: flex-end;
      box-sizing: border-box;
    }

    .wosui-login menu button {
      height: 40px;
      line-height: 40px;
      background: #e7e9ec;
      border-radius: 4px;
      border: none;
      padding: 0 20px;
      margin: 0 0 0 10px;
      font-size: 16px;
      color: #333;
    }
    .wosui-login menu button {
      margin: 0 10px 0 0;
    }

    .wosui-login menu button.recommend {
      background: #0061e0;
      color: #fff;
    }

    .wosui-login menu button:hover {
      filter: brightness(0.95);
    }

    .wosui-login menu button:active {
      filter: brightness(0.9);
    }

    @supports (backdrop-filter: blur(32px)) {
      .wosui-login {
        backdrop-filter: blur(32px);
      }
    }

    @media screen and (min-width: 600px) {
      .wosui-login {
        align-items: center;
      }

      .wosui-login > section {
        border-radius: 12px;
        width: 400px;
        box-shadow: 0 5px 10px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3);
      }
    }
  `;

  var container = document.createElement('div');
  container.classList.add('wosui-login');
  document.body.appendChild(container);
  document.body.style.overflow = 'hidden';

  var dialog = document.createElement('section');
  container.appendChild(dialog);

  if (type == 'login') {
    dialog.innerHTML = `
      <section>
        <h1 data-l10n-id="login">Login</h1>
        <label>
          <span data-l10n-id="login-email">Email</span>
          <input data-l10n-id="login-email-input" type="text" class="email-input">
        </label>
        <label>
          <span data-l10n-id="login-password">Password</span>
          <input data-l10n-id="login-password-input" type="text" class="password-input">
        </label>
      </section>
      <menu>
        <button class="cancel-button">Cancel</button>
        <button class="login-button recommend" data-l10n-id="login">Login</button>
      </menu>
    `;
    var email = dialog.querySelector('.email-input');
    var password = dialog.querySelector('.password-input');
    var submitButton = dialog.querySelector('.login-button');
    var cancelButton = dialog.querySelector('.cancel-button');

    submitButton.onclick = function(evt) {
      try {
        inputUserData(email.value, password.value);
      } catch(e) {
        alert('Something went wrong whilst trying to login...');
      }
      style.remove();
      container.remove();
    };
    cancelButton.onclick = function(evt) {
      style.remove();
      container.remove();
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
          <input data-l10n-id="signUp-email-input" type="text" class="email-input">
        </label>
        <label>
          <span data-l10n-id="signUp-password">Password</span>
          <input data-l10n-id="signUp-password-input" type="text" class="password-input">
        </label>
        <label>
          <span data-l10n-id="signUp-passwordConfirm">Confirm Password</span>
          <input data-l10n-id="signUp-passwordConfirm-input" type="text" class="passwordconfirm-input">
        </label>
      </section>
      <menu>
        <button class="cancel-button">Cancel</button>
        <button class="signUp-button recommend" data-l10n-id="signUp">Login</button>
      </menu>
    `;
    var username = dialog.querySelector('.username-input');
    var email = dialog.querySelector('.email-input');
    var password = dialog.querySelector('.password-input');
    var passwordConfirm = dialog.querySelector('.passwordconfirm-input');
    var submitButton = dialog.querySelector('.login-button');
    var cancelButton = dialog.querySelector('.cancel-button');

    submitButton.onclick = function(evt) {
      try {
        writeUserData(username.value, email.value, password.value, passwordConfirm.value);
      } catch(e) {
        alert('Something went wrong whilst trying to sign up...');
      }
      style.remove();
      container.remove();
    };
    cancelButton.onclick = function(evt) {
      style.remove();
      container.remove();
    };
  }
}
