// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-analytics.js";
import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";
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
export var isUserLoggedIn = localStorage.getItem('wos_login') !== null ? true : false;
export var userHref = '/';

export function getUsername(callback) {
  var username = ref(database, 'users/' + loginId + '/username');
  onValue(username, function(snapshot) {
    const data = snapshot.val();
    callback(data);
  });
}

export function getProfilePicture(callback) {
  var profile_picture = ref(database, 'users/' + loginId + '/profile_picture');
  onValue(profile_picture, function(snapshot) {
    const data = snapshot.val();
    callback(data);
  });
}

export function getModVerification(callback) {
  var moderator = ref(database, 'users/' + loginId + '/moderator');
  onValue(moderator, function(snapshot) {
    const data = snapshot.val();
    callback(data);
  });
}

export function getAttribute(name, callback) {
  var attribute = ref(database, 'users/' + loginId + '/' + name);
  onValue(attribute, function(snapshot) {
    const data = snapshot.val();
    callback(data);
  });
}

export function writeUserData(name, email, password, imageUrl) {
  var userId = parseInt(Math.random() * 2147483647);
  var dateCreated = Date.now();
  
  function check() {
    var idCheck = ref(database, 'users/' + userId);
    onValue(idCheck, function(snapshot) {
      const data = snapshot.val();
      var usedId = (data == userId);
      if (usedId) {
        userId = parseInt(Math.random() * 2147483647);
        check();
      } else {
        create();
      }
    });
  }

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
      is_moderator: false
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

export function changeAvatar(href) {
  set(ref(database, 'users/' + localStorage.getItem('wos_login') + '/profile_picture'), href);
}
export function changeUsername(text) {
  set(ref(database, 'users/' + localStorage.getItem('wos_login') + '/username'), text);
}
export function changeAttribute(attr, value) {
  set(ref(database, 'users/' + localStorage.getItem('wos_login') + '/' + attr), value);
}

// Store
export function getStoreWebapp(name, callback) {
  var webapp = ref(database, 'webapps/' + name);
  onValue(webapp, function(snapshot) {
    const data = snapshot.val();
    callback(data[name]);
  });
}
export function getStoreWebapps(callback) {
  var webapps = ref(database, 'webapps');
  onValue(webapps, function(snapshot) {
    const data = snapshot.val();
    var entries = Object.entries(data);
    callback(entries);
  });
}

export function getStoreCategories(callback) {
  var categories = ref(database, 'categories');
  onValue(categories, function(snapshot) {
    const data = snapshot.val();
    var entries = Object.entries(data);
    callback(entries);
  });
}

export function submitWebapp(manifest) {
  var dateCreated = Date.now();
  function create() {
    set(ref(database, 'users/' + manifest.slug), {
      'name': manifest.name,
      'description': manifest.description,
      'icon': manifest.icon,
      'git_repo': manifest.git_repo,
      'download': {
        'url': manifest.download,
        'manifest': manifest.manifest
      },
      'type': manifest.role,
      'license': manifest.license,
      'author': manifest.developer,
      'maintainer': manifest.developer,
      'has_ads': false,
      'has_tracking': false,
      'meta': {
        'tags': manifest.tags,
        'categories': manifest.categories
      },
      'slug': manifest.name.toLowerCase().replaceAll(' ', '-'),
      'screenshots': manifest.screenshots,
      'date_created': dateCreated
    });
  }
}
