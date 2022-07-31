'use strict';

import { getDBItem, loginId, setDBItem, UUID } from "./firebase.js";

document.addEventListener('DOMContentLoaded', function() {
  var isDarkMode = (localStorage.getItem('dark_mode') === 'true');
  if (isDarkMode) {
    document.body.classList.add('dark-mode-enabled');
  }
  
  var splashScreen = document.getElementById('splash-screen');

  var currentId;
  var currentChannel;
  var friendsButton = document.getElementById('friends-list');
  var joinGroupButton = document.getElementById('join-group');
  var serverGroups = document.getElementById('servers');
  var serverTitle = document.getElementById('server-title');
  var serverList = document.getElementById('server-list');
  var messages = document.getElementById('messages');
  friendsButton.addEventListener('click', function() {
    serverList.innerHTML = '';
    serverTitle.dataset.l10nId = 'personal';
    var header = document.createElement('header');
    header.dataset.l10nId = 'friends';
    serverList.appendChild(header);

    getDBItem('users/' + loginId + '/friends', function(data) {
      var entries = Object.entries(data);
      entries.forEach(function(entry) {
        var friend = document.createElement('li');
        friend.classList.add('user');
        friend.dataset.origin = entry[0];
        getDBItem('users/' + entry[0] + '/profile_picture', function(data1) {
          friend.style.setProperty('--avatar-url', 'url(' + data1 + ')');
        });
        getDBItem('users/' + entry[0] + '/username', function(data1) {
          friend.innerText = data1;
        });
        friend.addEventListener('click', function(evt) {
          loadDirectMessages(entry[0], friend);
          textInput.focus();
        });
        serverList.appendChild(friend);
      });
    });
  });
  friendsButton.click();

  joinGroupButton.addEventListener('click', function() {
    var joinPrompt = prompt('Add a friend by typing their email or number using #\nAnd create a server path using @');
    if (joinPrompt.startsWith('#')) {
      getDBItem('users/', function(data) {
        var entries = Object.entries(data);
        entries.forEach(function(entry) {
          if(joinPrompt.substring(1) == entry[1].email || joinPrompt.substring(1) == entry[1].phone_number) {
            setDBItem('users/' + loginId + '/friends/' + entry[0], {
              'messages': {}
            });
          }
        });
      });
    } else if (joinPrompt.startsWith('@')) {
      var uuid = UUID.generate();
      setDBItem('chat_groups/' + uuid + '/name', joinPrompt.substring(1));
      setDBItem('chat_groups/' + uuid + '/icon', 'https://ui-avatars.com/api/?name=' + joinPrompt.substring(1) + '&background=random');
      setDBItem('chat_groups/' + uuid + '/channels', {
        '0': {
          'name': 'Chatting',
          'type': 'header'
        },
        '1': {
          'name': 'General',
          'type': 'text_chat'
        },
        '2': {
          'name': 'Off Topic',
          'type': 'text_chat'
        }
      });
      setDBItem('chat_groups/' + uuid + '/messages', {});
      setDBItem('users/' + loginId + '/chat_groups/' + uuid, '');
    }
  });

  var content = document.getElementById('content');
  var menuButton = document.getElementById('menu-button');
  var chatTitle = document.getElementById('chat-title');
  menuButton.addEventListener('click', function() {
    content.classList.toggle('visible');
  });

  var chatForm = document.getElementById('chat-footer-form');
  var textInput = document.getElementById('text-input');
  var attachmentsButton = document.getElementById('attachments-button');
  chatForm.addEventListener('submit', function(evt) {
    evt.preventDefault();
    textInput.focus();
    if (textInput.value !== '') {
      sendMessage(textInput.value);
      textInput.value = '';
    }
  });
  textInput.addEventListener('keydown', function() {
    if (textInput.value !== '') {
      setDBItem('users/' + loginId + '/is_typing', true);
      setTimeout(function() {
        setDBItem('users/' + loginId + '/is_typing', false);
      }, 3000);
    } else {
      setDBItem('users/' + loginId + '/is_typing', false);
    }
  });

  getDBItem('users/' + loginId + '/chat_groups', function(data) {
    splashScreen.classList.add('hidden');
    var entries = Object.entries(data);

    serverGroups.innerHTML = '';
    entries.forEach(function(entry) {
      getDBItem('chat_groups/' + entry[0], function(data) {
        if (data !== null) {
          var serverExists = serverGroups.querySelector('[data-origin="' + entry[0] + '"]');
          if (!serverExists) {
            var server = document.createElement('li');
            server.dataset.origin = entry[0];
            if (data.icon) {
              server.style.backgroundImage = 'url(' + data.icon + ')';
            }
            server.title = data.name;
            server.addEventListener('click', function() {
              loadGroup(entry[0]);
            });
            serverGroups.appendChild(server);
          }
        }
      });
    });
  });

  function loadDirectMessages(id, item) {
    var backupItem = document.querySelector('[data-origin="' + id + '"]');
    currentId = id;
    currentChannel = id;
    window.history.pushState({}, "", '?directmessage=' + id);

    var selected = serverList.querySelector('.selected');
    if (selected) {
      selected.classList.remove('selected');
    }
    content.classList.add('visible');

    getDBItem('users/' + id + '/username', function(data) {
      chatTitle.innerText = data;
      document.title = data;

      if (item) {
        item.classList.add('selected');
      } else if (backupItem) {
        backupItem.classList.add('selected');
      }
    });
    getDBItem('chat_groups/' + currentId + '/messages/' + currentChannel, function(data) {
      messages.innerHTML = '';
      if (data) {
        var messageEntries = Object.entries(data);

        messageEntries.forEach(function(messageEntry) {
          var date = new Date(messageEntry[1].dateSent);
          var formatted = date.getUTCFullYear().toLocaleString(navigator.language == 'ar' ? 'ar-SA' : undefined) + '/' + (date.getMonth() + 1).toLocaleString(navigator.language == 'ar' ? 'ar-SA' : undefined) + '/' + date.getUTCDate().toLocaleString(navigator.language == 'ar' ? 'ar-SA' : undefined) + ' - ' + date.getUTCHours().toLocaleString(navigator.language == 'ar' ? 'ar-SA' : undefined) + ':' + date.getMinutes().toLocaleString(navigator.language == 'ar' ? 'ar-SA' : undefined);
          drawMessage({
            dateSent: formatted,
            message: messageEntry[1].message,
            senderId: messageEntry[1].senderId
          }, (messageEntry[1].senderId == loginId));
        });
      }
    });
  }

  function loadGroup(id, channel = '') {
    currentId = id;
    if (currentId == id) {
      getDBItem('chat_groups/' + id + '/name', function(data1) {
        serverTitle.innerText = data1;
        serverTitle.dataset.l10nId = null;
      });

      getDBItem('users/' + loginId + '/chat_groups/' + id + '/selected_channel', function(data1) {
        if (data1) {
          currentChannel = data1;
        } else {
          currentChannel = '';
        }
      });

      getDBItem('chat_groups/' + id + '/channels', function(data1) {
        serverList.innerHTML = '';

        var entries = Object.entries(data1);
        entries.forEach(function(entry) {
          switch(entry[1].type) {
            case 'header':
              var header = document.createElement('header');
              header.innerText = entry[1].name;
              serverList.appendChild(header);
              break;

            case 'text_chat':
              var textChat = document.createElement('li');
              textChat.innerText = entry[1].name;
              textChat.addEventListener('click', function() {
                select();
                setDBItem('users/' + loginId + '/chat_groups/' + id + '/selected_channel', currentChannel);
              });
              serverList.appendChild(textChat);
              textInput.focus();

              if (currentId == id) {
                getDBItem('users/' + loginId + '/chat_groups/' + id + '/selected_channel', function(data) {
                  if (channel == entry[1].name.toLowerCase().replace(' ', '_')) {
                    select();
                  } else if (data == entry[1].name.toLowerCase().replace(' ', '_')) {
                    select();
                  }
                });
              }

              function select() {
                currentChannel = entry[1].name.toLowerCase().replace(' ', '_');
                window.history.pushState({}, "", '?group=' + id + '&channel=' + currentChannel);

                var selected = serverList.querySelector('.selected');
                if (selected) {
                  selected.classList.remove('selected');
                }
                textChat.classList.add('selected');

                content.classList.add('visible');
                chatTitle.innerText = entry[1].name;
                document.title = entry[1].name;
                getDBItem('chat_groups/' + currentId + '/messages/' + currentChannel, function(data2) {
                  messages.innerHTML = '';
                  if (data2) {
                    var messageEntries = Object.entries(data2);

                    messageEntries.forEach(function(messageEntry) {
                      var date = new Date(messageEntry[1].dateSent);
                      var formatted = date.getUTCFullYear().toLocaleString(navigator.language == 'ar' ? 'ar-SA' : undefined) + '/' + (date.getMonth() + 1).toLocaleString(navigator.language == 'ar' ? 'ar-SA' : undefined) + '/' + date.getUTCDate().toLocaleString(navigator.language == 'ar' ? 'ar-SA' : undefined) + ' - ' + date.getUTCHours().toLocaleString(navigator.language == 'ar' ? 'ar-SA' : undefined) + ':' + date.getMinutes().toLocaleString(navigator.language == 'ar' ? 'ar-SA' : undefined);
                      drawMessage({
                        dateSent: formatted,
                        message: messageEntry[1].message,
                        senderId: messageEntry[1].senderId
                      }, (messageEntry[1].senderId == loginId));
                    });
                  }
                });
                messages.scrollTop = (messages.scrollHeight - messages.getBoundingClientRect().height);
                textInput.focus();
              }
              break;
          }
        });
      });
    }
  }

  function drawMessage(data, isYours) {
    var message = document.createElement('div');
    message.classList.add('message');
    if (isYours) {
      message.classList.add('yours');
    }
    messages.appendChild(message);

    var avatar = document.createElement('img');
    avatar.classList.add('avatar');
    getDBItem('users/' + data.senderId + '/profile_picture', function(data_ss) {
      avatar.src = data_ss;
    });
    message.appendChild(avatar);

    var content = document.createElement('div');
    content.classList.add('content');
    message.appendChild(content);

    var info = document.createElement('div');
    info.classList.add('info');
    content.appendChild(info);

    var username = document.createElement('span');
    username.classList.add('username');
    getDBItem('users/' + data.senderId + '/username', function(data_ss) {
      username.innerText = data_ss;
    });
    info.appendChild(username);

    var dateSent = document.createElement('span');
    dateSent.innerText = data.dateSent;
    info.appendChild(dateSent);

    var context = document.createElement('p');
    context.classList.add('context');
    content.appendChild(context);
    messages.scrollTop = (messages.scrollHeight - messages.getBoundingClientRect().height);

    var bold = /\*\*(.*?)\*\*/gm;
    var italic = /\*(.*?)\*/gm;
    var stroke = /\~\~(.*?)\~\~/gm;
    var underline = /\_\_(.*?)\_\_/gm;
    var pscript = /\+\+(.*?)\+\+/gm;
    var mscript = /\-\-(.*?)\-\-/gm;
    var mark = /\!\!(.*?)\!\!/gm;
    var link = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var link2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var html = data.message.replace(bold, '<strong>$1</strong>');
    html = html.replace(italic, '<i>$1</i>');
    html = html.replace(stroke, '<del>$1</del>');
    html = html.replace(underline, '<u>$1</u>');
    html = html.replace(pscript, '<sup>$1</sup>');
    html = html.replace(mscript, '<sub>$1</sub>');
    html = html.replace(mark, '<mark>$1</mark>');
    html = html.replace(link, "<a href='$1'>$1</a>");
    html = html.replace(link2, '$1<a target="_blank" href="http://$2">$2</a>');
    context.innerHTML = html;

    if (data.message.includes('youtube.com')) {}
  }

  function sendMessage(text) {
    var dateSent = Date.now();
    setDBItem('chat_groups/' + currentId + '/messages/' + currentChannel + '/' + dateSent, {
      senderId: loginId,
      message: text,
      dateSent: dateSent
    });
    messages.scrollTop = (messages.scrollHeight - messages.getBoundingClientRect().height);
  }

  if (location.search !== '') {
    var pramaters = location.search.split('?')[1];
    let params_arr = pramaters.split('&');
    for (let i = 0; i < params_arr.length; i++) {
      let pair = params_arr[i].split('=');
      if (pair[0] == 'group') {
        if (pair[1]) {
          loadGroup(pair[1]);
        }
      } else if (pair[0] == 'directmessage') {
        if (pair[1]) {
          loadDirectMessages(pair[1]);
        }
      }
    }
  }
});
