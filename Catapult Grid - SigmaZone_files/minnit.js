(function () {
  'use strict'
  function getPhotoFromHTML(thisPhoto) {
    try {
      if (thisPhoto.indexOf('src=') > -1) {
        thisPhoto = thisPhoto.split('src=')[1];
      }
      if (thisPhoto.indexOf('"') > -1) {
        thisPhoto = thisPhoto.split('"')[1];
      }
      if (thisPhoto.indexOf("'") > -1) {
        thisPhoto = thisPhoto.split("'")[1];
      }
      if (thisPhoto.slice(-1) == '\\') {
        thisPhoto = thisPhoto.substring(0, thisPhoto.length - 1);
      }
      return encodeURIComponent(thisPhoto);
    } catch (e) {
      return '';
    }
  }
  function convertIframeToNEC() {
    if (typeof (document.getElementsByTagName("iframe")) !== 'undefined' && document.getElementsByTagName("iframe") !== null && typeof (document.getElementsByTagName("iframe")[0]) !== 'undefined' && document.getElementsByTagName("iframe")[0] !== null) {
      //iterate through all iframes and see if any of them are chats; if so, convert them over...
      document.querySelectorAll('iframe').forEach((IframeTag) => {
        if (typeof (IframeTag) !== 'undefined' && IframeTag && typeof (IframeTag.src) !== 'undefined' && IframeTag.src) {
          //valid source, check if this is a Minnit URL
          if ((IframeTag.src.indexOf('minnit.chat') > -1 || IframeTag.src.indexOf('.minnit.org') > -1) && IframeTag.src.indexOf('nec=') == -1) {
            var thisTagChatName = IframeTag.src
            IframeTag.src = 'about:blank'; //blanks out the iframe until we're done grabbing SSO token and similar checks
            var urlparams = ''
            if (thisTagChatName.indexOf('?') > -1) {
              urlparams = thisTagChatName.split('?')[1].split('nickname').join('')
              thisTagChatName = thisTagChatName.split('?')[0]
            }
            if (thisTagChatName.indexOf('?') > -1) {
              thisTagChatName = thisTagChatName.split('?')[0]
            }
            if (thisTagChatName.length === 0) { thisTagChatName = 'Demo' }
            var minnitNickname = '';
            if (typeof (minnitChatOptions.minnitwpusername) !== 'undefined') {
              minnitNickname = minnitChatOptions.minnitwpusername
            }
            var newEmbedKey = Math.floor(Math.random() * 10000000) + 1;
            var minnitPhoto = '';
            if (typeof (minnitChatOptions.minnitwpphoto) !== 'undefined' && minnitChatOptions.minnitwpphoto !== null) {
              minnitPhoto = getPhotoFromHTML(minnitChatOptions.minnitwpphoto);
              if (minnitPhoto.indexOf("'") !== -1) {
                minnitPhoto = minnitPhoto.split("'")[0];
              }
              try {
                minnitPhoto = encodeURIComponent(minnitPhoto);
              } catch (e) {
                minnitPhoto = '';
              }
            }
            try {
              //Attempt to get the user's "actual" photo from navigational bar; this allows us to support buddypress or similar plugins
              if (typeof (minnitChatOptions.minnitwpusername) !== 'undefined' && typeof (document.getElementById('wpadminbar') !== 'undefined' && document.getElementById('wpadminbar'))) {
                var wpAvatars = document.getElementById('wpadminbar').getElementsByClassName('avatar');
                if (typeof (wpAvatars) !== 'undefined' && wpAvatars !== null && wpAvatars.hasOwnProperty('0') && wpAvatars[0] !== null && wpAvatars[0].src !== null) {
                  minnitPhoto = encodeURIComponent(wpAvatars[0].src);
                }
              }
            } catch (e) {
              //Invalid or unknown error as it relates to site's HTML. Safe to ignore, we'll just use what's in the default WordPress account.
            }
            var xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
              if (typeof (this.responseText) !== 'undefined') {
                try {
                  var responseData = JSON.parse(this.responseText);
                  var ssoToken = '';
                  if (typeof (responseData.ssotoken) !== 'undefined' && responseData.ssotoken !== null && responseData.ssotoken.length > 0) {
                    ssoToken = responseData.ssotoken;
                  }
                  IframeTag.src = thisTagChatName + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&ssotoken=' + ssoToken + '&' + urlparams;
                  IframeTag.dataset.nec = newEmbedKey;
                } catch (e) {
                  IframeTag.src = thisTagChatName + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&' + urlparams;
                  IframeTag.dataset.nec = newEmbedKey;
                }
              }
            }
            xhttp.open("GET", minnitChatOptions.wpurl + '/?p=minnit-chat-sso-custom-get-token-v1&photourl=' + decodeURIComponent(minnitPhoto));
            xhttp.send();
          }
        }
      });
    }
  }
  function drawChat() {
    var chatname = minnitChatOptions.minnitchatname
    if (chatname.indexOf('script') > -1) {
      if (chatname.indexOf('data-chatname=') > -1) {
        chatname = chatname.split('data-chatname=')[1];
      }
      if (chatname.indexOf(' ')) {
        chatname = chatname.split(' ')[0];
      }
    }
    if (chatname.indexOf('/') == -1) {
      //user is not providing full URL  -- automatically craft the default minnit.chat setup (for legacy users)
      chatname = 'https://minnit.chat/' + chatname
    }
    var urlparams = ''
    chatname = chatname.split(' ').join('').split('<').join('')
    if (chatname.indexOf('?') > -1) {
      urlparams = chatname.split('?')[1].split('nickname').join('')
      chatname = chatname.split('?')[0]
    }
    if (chatname.length === 0) { chatname = 'Demo' }
    var minnitNickname = ''
    if (typeof (minnitChatOptions.minnitwpusername) !== 'undefined') {
      minnitNickname = minnitChatOptions.minnitwpusername
    }
    var minnitPhoto = '';
    if (typeof (minnitChatOptions.minnitwpphoto) !== 'undefined' && minnitChatOptions.minnitwpphoto !== null) {
      minnitPhoto = getPhotoFromHTML(minnitChatOptions.minnitwpphoto);
      if (minnitPhoto.indexOf("'") !== -1) {
        minnitPhoto = minnitPhoto.split("'")[0];
      }
      try {
        minnitPhoto = encodeURIComponent(minnitPhoto);
      } catch (e) {
        minnitPhoto = '';
      }
    }
    try {
      if (typeof (document.getElementById('wpadminbar') !== 'undefined' && document.getElementById('wpadminbar'))) {
        //Attempt to get the user's "actual" photo from navigational bar; this allows us to support buddypress or similar plugins
        var wpAvatars = document.getElementById('wpadminbar').getElementsByClassName('avatar');
        if (typeof (wpAvatars) !== 'undefined' && wpAvatars !== null && wpAvatars.hasOwnProperty('0') && wpAvatars[0] !== null && wpAvatars[0].src !== null) {
          minnitPhoto = encodeURIComponent(wpAvatars[0].src);
        }
      }
    } catch (e) {
      //Invalid or unknown error as it relates to site's HTML. Safe to ignore, we'll just use what's in the default WordPress account.
    }
    var vendorIframe = document.createElement('iframe')
    vendorIframe.width = '100%'
    vendorIframe.className = 'minnit-chat-iframe'
    var minnitContainer = document.getElementById('minnit-container')
    minnitContainer.setAttribute('data-size', minnitChatOptions.minnitchatsize)
    minnitContainer.innerHTML = ''
    // draw close btn
    var closeChat = document.createElement('minnit-close-chat')
    if (minnitChatOptions.hasOwnProperty('minnitclosechattext') && minnitChatOptions.minnitclosechattext) {
      closeChat.innerText = minnitChatOptions.minnitclosechattext
    } else {
      closeChat.innerText = 'Close Chat'
    }
    closeChat.id = 'minnitCloseChatBtn'
    closeChat.onclick = drawButton
    minnitContainer.appendChild(closeChat)
    var xhttp = new XMLHttpRequest();
    var newEmbedKey = Math.floor(Math.random() * 10000000) + 1;
    xhttp.onload = function () {
      if (typeof (this.responseText) !== 'undefined') {
        try {
          var responseData = JSON.parse(this.responseText);
          var ssoToken = '';
          if (typeof (responseData.ssotoken) !== 'undefined' && responseData.ssotoken !== null && responseData.ssotoken.length > 0) {
            ssoToken = responseData.ssotoken;
          }
          vendorIframe.src = chatname + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&ssotoken=' + ssoToken + '&' + urlparams
        } catch (e) {
          vendorIframe.src = chatname + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&' + urlparams
        }
        vendorIframe.setAttribute('data-nec', newEmbedKey);
        minnitContainer.appendChild(vendorIframe)
      }
    }
    xhttp.open("GET", minnitChatOptions.wpurl + '/?p=minnit-chat-sso-custom-get-token-v1&photourl=' + decodeURIComponent(minnitPhoto));
    xhttp.send();
  }
  function drawButton() {
    convertIframeToNEC();
    setInterval(function () {
      convertIframeToNEC();
    }, 1000);
    if (typeof (document.getElementsByTagName("minnit-chat")) !== 'undefined' && document.getElementsByTagName("minnit-chat") !== null && typeof (document.getElementsByTagName("minnit-chat")[0]) !== 'undefined' && document.getElementsByTagName("minnit-chat")[0] !== null) {
      //an existing tag is present, draw chat here!
      document.querySelectorAll('minnit-chat').forEach((MinnitChatTag) => {
        var thisTagChatName = MinnitChatTag.getAttribute('data-chatname');
        var iframeHeight = '70vh';
        if (typeof (MinnitChatTag.getAttribute('data-height')) !== 'undefined' && MinnitChatTag.getAttribute('data-height') !== null && MinnitChatTag.getAttribute('data-height')) {
          iframeHeight = MinnitChatTag.getAttribute('data-height');
        }
        var iframeWidth = '100%';
        if (typeof (MinnitChatTag.getAttribute('data-width')) !== 'undefined' && MinnitChatTag.getAttribute('data-width') !== null && MinnitChatTag.getAttribute('data-width')) {
          iframeWidth = MinnitChatTag.getAttribute('data-width');
        }
        if (thisTagChatName.indexOf('script') > -1) {
          if (thisTagChatName.indexOf('data-chatname="') > -1) {
            thisTagChatName = thisTagChatName.split('data-chatname="')[1];
          }
          if (thisTagChatName.indexOf('"')) {
            thisTagChatName = thisTagChatName.split('"')[0];
          }
        }
        if (thisTagChatName.indexOf('/') == -1) {
          //user is not providing full URL  -- automatically craft the default minnit.chat setup (for legacy users)
          thisTagChatName = 'https://minnit.chat/' + thisTagChatName
        }
        thisTagChatName = thisTagChatName.split(' ').join('').split('<').join('').split('"').join('').split("'").join('')
        var urlparams = ''
        if (thisTagChatName.indexOf('?') > -1) {
          urlparams = thisTagChatName.split('?')[1].split('nickname').join('')
          thisTagChatName = thisTagChatName.split('?')[0]
        }
        if (thisTagChatName.indexOf('?') > -1) {
          thisTagChatName = thisTagChatName.split('?')[0]
        }
        if (thisTagChatName.length === 0) { thisTagChatName = 'Demo' }
        var minnitNickname = '';
        if (typeof (minnitChatOptions.minnitwpusername) !== 'undefined') {
          minnitNickname = minnitChatOptions.minnitwpusername
        }
        var newEmbedKey = Math.floor(Math.random() * 10000000) + 1;
        var minnitPhoto = '';
        if (typeof (minnitChatOptions.minnitwpphoto) !== 'undefined' && minnitChatOptions.minnitwpphoto !== null) {
          minnitPhoto = getPhotoFromHTML(minnitChatOptions.minnitwpphoto);
          if (minnitPhoto.indexOf("'") !== -1) {
            minnitPhoto = minnitPhoto.split("'")[0];
          }
          try {
            minnitPhoto = encodeURIComponent(minnitPhoto);
          } catch (e) {
            minnitPhoto = '';
          }
        }
        try {
          //Attempt to get the user's "actual" photo from navigational bar; this allows us to support buddypress or similar plugins
          if (1==2 && typeof (minnitChatOptions.minnitwpusername) !== 'undefined' && typeof (document.getElementById('wpadminbar') !== 'undefined' && document.getElementById('wpadminbar'))) {
            var wpAvatars = document.getElementById('wpadminbar').getElementsByClassName('avatar');
            if (typeof (wpAvatars) !== 'undefined' && wpAvatars !== null && wpAvatars.hasOwnProperty('0') && wpAvatars[0] !== null && wpAvatars[0].src !== null) {
              minnitPhoto = encodeURIComponent(wpAvatars[0].src);
            }
          }
        } catch (e) {
          //Invalid or unknown error as it relates to site's HTML. Safe to ignore, we'll just use what's in the default WordPress account.
        }
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
          if (typeof (this.responseText) !== 'undefined') {
            try {
              var responseData = JSON.parse(this.responseText);
              var ssoToken = '';
              if (typeof (responseData.ssotoken) !== 'undefined' && responseData.ssotoken !== null && responseData.ssotoken.length > 0) {
                ssoToken = responseData.ssotoken;
              }
              MinnitChatTag.innerHTML = '<iframe src="' + thisTagChatName + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&ssotoken=' + ssoToken + '&' + urlparams + '" data-width="' + iframeWidth + '" data-height="' + iframeHeight + '" data-nec="' + newEmbedKey + '" style="border:none;width:' + iframeWidth + ';height:' + iframeHeight + '" class="minnit-chat-iframe-gutenberg-block" allowTransparency="true"></iframe>';
            } catch (e) {
              MinnitChatTag.innerHTML = '<iframe src="' + thisTagChatName + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&' + urlparams + '" data-nec="' + newEmbedKey + '" data-width="' + iframeWidth + '" data-height="' + iframeHeight + '" style="margin:auto;border:none;width:' + iframeWidth + ';height:' + iframeHeight + '" class="minnit-chat-iframe-gutenberg-block" allowTransparency="true"></iframe>';
            }
          }
        }
        xhttp.open("GET", minnitChatOptions.wpurl + '/?p=minnit-chat-sso-custom-get-token-v1&photourl=' + decodeURIComponent(minnitPhoto));
        xhttp.send();
      });
      setInterval(function () {
        Array.prototype.forEach.call(document.getElementsByClassName("minnit-chat-iframe-gutenberg-block"), function (thisChatFrame) {
          thisChatFrame.setAttribute("style", "margin:auto;border:none;width:" + thisChatFrame.getAttribute('data-width') + ";height:" + thisChatFrame.getAttribute('data-height')); //this is to prevent some themes, such as Twenty-Twenty, from setting the iframe width to 0 when the page is resized
        });
      }, 1000);
    }
    var buttoncol = '#aaaaaa'
    var buttonstrokecol = '#ffffff'
    if (minnitChatOptions.minnitchatcolor) {
      //    figure out if the outline should be white, or black, for the logo
      buttoncol = minnitChatOptions.minnitchatcolor.substr(1)
      var redCol = parseInt(buttoncol.substr(0, 2), 16)
      var greenCol = parseInt(buttoncol.substr(2, 2), 16)
      var blueCol = parseInt(buttoncol.substr(4), 16)
      if (redCol > 200 || blueCol > 200 || greenCol > 200) {
        buttonstrokecol = '#000000'
      }
      buttoncol = '#' + buttoncol
    }
    var minnitSvg = '<svg xmlns="http://www.w3.org/2000/svg" height="57" width="57" viewBox="0 0 200 200"><style>.a{fill:' + buttonstrokecol + ';stroke-width:2;}</style>      <g>    <circle cx="50%" cy="50%" r="50%" style="fill:' + buttoncol + '"/> <path style="fill:none;stroke:' + buttonstrokecol + ';stroke-width:10;stroke-linecap:round;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none" d="m 62.203387,41.223546 h 82.815163 l 9.29193,5.364699 v 78.922735 l -7.40647,7.40647 v 31.60867 L 90.714413,132.08504 H 58.89078 L 50.082738,123.277 V 49.321029 Z" id="path1069"/>     <circle style="fill:' + buttonstrokecol + ';stroke:' + buttonstrokecol + ';stroke-width:10;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path1192" cx="77.155991" cy="95" r="2.7605052"/>     <circle style="fill:' + buttonstrokecol + ';stroke:' + buttonstrokecol + ';stroke-width:10;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path1192-2" cx="128.28627" cy="95" r="2.7605052"/>     <circle style="fill:' + buttonstrokecol + ';stroke:' + buttonstrokecol + ';stroke-width:10;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path1192-22" cx="102.31316" cy="95" r="2.7605052"/>   </g></svg>'
    var chatButton = document.createElement('minnit-button')
    chatButton.innerHTML = minnitSvg
    chatButton.onclick = drawChat
    if (typeof (minnitChatOptions.minnitchatname) !== 'undefined' && minnitChatOptions.minnitchatname !== null && minnitChatOptions.minnitchatname.length > 0) {
      var minnitContainer = document.getElementById('minnit-container')
      minnitContainer.setAttribute('data-size', 'button')
      minnitContainer.innerHTML = ''
      minnitContainer.appendChild(chatButton)
    }
  }
  function updateMinnitOptions() {
    if (!document.getElementById('minnit-container')) {
      var minnitContainer = document.createElement('minnit-container')
      minnitContainer.id = 'minnit-container'
      document.body.appendChild(minnitContainer)
    }
    var container = document.getElementById('minnit-container')
    container.setAttribute('data-placement', minnitChatOptions.minnitplacement)
    drawButton()
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateMinnitOptions)
  } else {
    updateMinnitOptions()
  }
  function createMinnitCookie(name, value, hours) {
    var expires;
    if (hours) {
      var date = new Date();
      date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    } else expires = "";
    document.cookie = name + "=" + value + expires + "; path=/; SameSite=None; Secure";
  }
  function getMinnitCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  function localStorageSupported() {
    try {
      if (typeof (localStorage) == 'object') {
        localStorage.getItem("test");
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }
  function createMinnitLocalStorage(name, value) {
    name = "minnit_" + name;
    if (localStorageSupported()) {
      localStorage.setItem(name, value);
    } else {
      createMinnitCookie(name, value); //fallback for older browsers
    }
  }
  function getMinnitLocalStorage(name) {
    name = "minnit_" + name;
    if (localStorageSupported()) {
      return localStorage.getItem(name);
    } else {
      return getMinnitCookie(name); //fallback for older browsers
    }
  }
  window.addEventListener("message", function (event) {
    if (typeof (event) !== 'undefined' && event !== null && typeof (event.data) === 'string' && event.data !== null && event.data.indexOf('"minnitnec"') > -1) {
      //find the relevant iframe this is from -- owners are allowed to embed more than one chatroom, so we must make sure we send this to the correct frame!
      try {
        var eventObj = JSON.parse(event.data);
        document.querySelectorAll('iframe').forEach((thisEmbed) => {
          if (typeof (thisEmbed.dataset) !== 'undefined' && thisEmbed.dataset.hasOwnProperty('nec') && thisEmbed.dataset.nec == eventObj.minnitnec) {
            //now, check what this request was for...
            switch (eventObj.request) {
              case "getsigninvars":
                var postMessageData = {
                  'minnitnec': eventObj.minnitnec,
                  'signinvars': true
                }
                if (getMinnitLocalStorage("rauthv") != null && getMinnitLocalStorage("rauthv").length > 6) {
                  postMessageData.rauthv = getMinnitLocalStorage('rauthv');
                  postMessageData.sto = getMinnitLocalStorage('sto');
                } else {
                  postMessageData.gauthv = getMinnitLocalStorage('gauthv');
                  postMessageData.gsto = getMinnitLocalStorage('gsto');
                  if (getMinnitLocalStorage('nickname') !== null) {
                    postMessageData.nickname = getMinnitLocalStorage('nickname');
                  }
                }
                thisEmbed.contentWindow.postMessage(JSON.stringify(postMessageData), '*');
                break;
              case "setcookie":
                createMinnitLocalStorage(eventObj.cookiename, eventObj.cookievalue);
                break;
              case "getcookie":
                thisEmbed.contentWindow.postMessage('{"minnitnec": ' + eventObj.minnitnec + ', "cookiename": "' + eventObj.cookiename + '", "cookievalue": "' + getMinnitLocalStorage(eventObj.cookiename) + '"}', '*');
                break;
              case "setguest":
                createMinnitLocalStorage("gsto", eventObj.gsto);
                createMinnitLocalStorage("gauthv", eventObj.gauthv);
                break;
              case "logout":
                createMinnitLocalStorage("gsto", "");
                createMinnitLocalStorage("sto", "");
                createMinnitLocalStorage("gauthv", "");
                createMinnitLocalStorage("rauthv", "");
                createMinnitLocalStorage("nickname", "");
                break;
            }
          }
        });
      } catch (err) {
        //something went amiss
      }
    }
  });
  window.INSTALL_SCOPE = {
    setOptions: function setOptions(nextOptions) {
      minnitChatOptions = nextOptions
      updateMinnitOptions()
    }
  }
}())
