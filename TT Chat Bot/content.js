// const TuyAPI = 'tuyapi';

// // ES5
// require([TuyAPI], function(result){
//   TuyAPI = result;
// });

let isOff = true;

var LightURL = "https://openapi.tuyaus.com/v1.0/devices/eb69ae355caa61581dsl8a/commands"

var colors = {

  "red":  [0, 1000, 1000],
  "orange":  [30, 1000, 1000],
  "yellow": [60, 1000, 1000],
  "green": [120, 1000, 1000],
  "blue":  [240, 1000, 1000],
  "purple":  [275, 1000, 1000],

};





function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

var target = document.querySelector('.webcast-chatroom-messages-list.is-not-lock');
var chatbox = document.getElementsByClassName("public-DraftStyleDefault-block public-DraftStyleDefault-ltr")[0];
let options = {
  attributes: true,
  childList: true,
  subtree: true
}
let str = '';
let observer = new MutationObserver(mCallback);


function mCallback(mutations) {
  for (let mutation of mutations) {
    if (mutation.addedNodes.length) {
      // Chatter joined chatroom message

      switch (mutation.addedNodes[0].className) {
        case "webcast-chatroom__member-message-container":
          str = mutation.addedNodes[0].innerHTML.replace("joined", "");
          //<span class="nickname"></span>
          sayName(str);
          break;
        case "webcast-chatroom-message-item webcast-chatroom__chat-message webcast-chatroom__room":
          str = mutation.addedNodes[0].innerHTML.split('<span class="content">')[1].split('</span>')[0];

          console.log(str);
          doStuff(str);
          break;
        case "webcast-chatroom-message-item webcast-chatroom__social-message":
          doStuff("!commands");
          break;
        case "webcast-chatroom-message-item webcast-chatroom__gift-message":

          break;
        case "webcast-chatroom-message-item webcast-chatroom__like-message":

          break;
        default:
          break;
      }

      // if (mutation.addedNodes[0].className == "webcast-chatroom__member-message-container") {
      //   //console.log(mutation.addedNodes[0]);
      //   let str = mutation.addedNodes[0].innerHTML.replace("joined", "");
      //   sayName(str);

      // }
      // else if (mutation.addedNodes[0].className == "webcast-chatroom-message-item webcast-chatroom__chat-message webcast-chatroom__room") {
      //   //console.log(mutation.addedNodes[0][1][0])
      //   let str = mutation.addedNodes[0].innerHTML.split('<span class="content">')[1].split('</span>')[0];

      //   console.log(str);
      //   doStuff(str);

      // }
      // else if (mutation.addedNodes[0].className == "webcast-chatroom-message-item webcast-chatroom__social-message") {
      //   //console.log(mutation.addedNodes[0]);  
      //   doStuff("!sound airhorn");
      // }
      // else if(mutation.addedNodes[0].className == "webcast-chatroom-message-item webcast-chatroom__gift-message"){

      // }

    }
  }
}

var sounds = {

  "bark": 1000,
  "meow": 1000,
  "cj1": 2000,
  "note": 2000,
  "we got him": 12000,
  "ballz": 6000,
  "boom1": 1000,
  "broke boy": 1000,
  "bruh": 1000,
  "fbi": 7000,
  "john cena": 1000,
  "running": 7000,
  "damn son": 2000,
  "airhorn": 3000,
  "ksi": 2000,
  "roblox": 1000,
  "FTS": 1000,

}

async function waitSum(audio) {
  return new Promise(res => {
    audio.play();
    audio.onended = res
  })

}

async function playSound(x) {

  var url = chrome.runtime.getURL("sounds/" + x + ".mp3");
  console.log(url);
  var audio = new Audio(url);

  //await waitSum(audio);

  audio.play();

}

function sayName(str) {
  speechSynthesis.speak(new SpeechSynthesisUtterance("Hello, " + str));
}

function changeLights(color, isCol) {
  var data;
  if (isCol) {
    data = JSON.stringify({
      "commands": [
        {
          "code": "colour_data",
          "value": {
            "h": colors[color][0],
            "s": colors[color][1],
            "v": colors[color][2]
          }
        },
        {
          "code": "bright",
          "value": 100
        }
      ]
    });
  } else {
    if (!isOff) {
      data = JSON.stringify({
        "commands": [
          [{ "code": "switch_led", "value": false }]
        ]
      });
    } else {
      data = JSON.stringify({
        "commands": [
          [{ "code": "switch_led", "value": true }]
        ]
      });
    }

  }

  (function () {
    var timestamp = getTime();
    pm.environment.set("timestamp", timestamp);

    const clientId = pm.environment.get("client_id");
    const secret = pm.environment.get("secret");

    var accessToken = "";
    if (pm.environment.has("easy_access_token")) {
      accessToken = pm.environment.get("easy_access_token")
    }

    const httpMethod = pm.request.method.toUpperCase();
    const query = pm.request.url.query;
    const mode = pm.request.body.mode;
    const headers = pm.request.headers;

    // sha256
    var signMap = stringToSign(query, mode, httpMethod, secret)
    var urlStr = signMap["url"]
    var signStr = signMap["signUrl"]
    pm.request.url = pm.request.url.host + urlStr
    var nonce = ""
    if (headers.has("nonce")) {
      var jsonHeaders = JSON.parse(JSON.stringify(headers))
      jsonHeaders.forEach(function (item) {
        if (item.key == "nonce" && !item.disabled) {
          nonce = headers.get("nonce")
        }
      })
    }
    var sign = calcSign(clientId, accessToken, timestamp, nonce, signStr, secret);
    pm.environment.set('easy_sign', sign);
  })();

  function getTime() {
    var timestamp = new Date().getTime();
    return timestamp;
  }

  // Token verification calculation
  // function calcSign(clientId,timestamp,nonce,signStr,secret){
  //     var str = clientId + timestamp + nonce + signStr;
  //     var hash = CryptoJS.HmacSHA256(str, secret);
  //     var hashInBase64 = hash.toString();
  //     var signUp = hashInBase64.toUpperCase();
  //     return signUp;
  // }

  // Business verification calculation
  function calcSign(clientId, accessToken, timestamp, nonce, signStr, secret) {
    var str = clientId + accessToken + timestamp + nonce + signStr;
    var hash = CryptoJS.HmacSHA256(str, secret);
    var hashInBase64 = hash.toString();
    var signUp = hashInBase64.toUpperCase();
    return signUp;
  }

  // Generate signature string
  function stringToSign(query, mode, method, secret) {
    var sha256 = "";
    var url = "";
    var headersStr = ""
    const headers = pm.request.headers;
    var map = {}
    var arr = []
    var bodyStr = ""
    if (query) {
      toJsonObj(query, arr, map)
    }
    if (pm.request.body && mode) {
      if (mode != "formdata" && mode != "urlencoded") {
        bodyStr = replacePostmanParams(pm.request.body.toString())
      } else if (mode == "formdata") {
        // Traversing form key value pairs
        toJsonObj(pm.request.body["formdata"], arr, map)
      } else if (mode == "urlencoded") {
        // Traversing form key value pairs
        toJsonObj(pm.request.body["urlencoded"], arr, map)
      }
    }
    sha256 = CryptoJS.SHA256(bodyStr)
    arr = arr.sort()
    arr.forEach(function (item) {
      url += item + "=" + map[item] + "&"
    })
    if (url.length > 0) {
      url = url.substring(0, url.length - 1)
      url = "/" + pm.request.url.path.join("/") + "?" + url
    } else {
      url = "/" + pm.request.url.path.join("/")
    }

    if (headers.has("Signature-Headers") && headers.get("Signature-Headers")) {
      var signHeaderStr = headers.get("Signature-Headers")
      const signHeaderKeys = signHeaderStr.split(":")
      signHeaderKeys.forEach(function (item) {
        var val = ""
        if (pm.request.headers.get(item)) {
          val = pm.request.headers.get(item)
        }
        headersStr += item + ":" + val + "\n"
      })
    }
    var map = {}

    url = replacePostmanParams(url)

    map["signUrl"] = method + "\n" + sha256 + "\n" + headersStr + "\n" + url
    map["url"] = url
    return map
  }

  function replacePostmanParams(str) {
    while (str.indexOf("{{") != -1 && str.indexOf("}}") != -1) {
      const key = str.substring(str.indexOf("{{") + 2, str.indexOf("}}"))
      var value = pm.environment.get(key)
      if (!value) value = ""
      str = str.replace("{{" + key + "}}", value)
    }
    return str
  }


  function toJsonObj(params, arr, map) {
    var jsonBodyStr = JSON.stringify(params)
    var jsonBody = JSON.parse(jsonBodyStr)

    jsonBody.forEach(function (item) {
      arr.push(item.key)
      map[item.key] = item.value
    })
  }








  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });


  xhr.open("POST", "https://openapi.tuyaus.com/v1.0/devices/eb69ae355caa61581dsl8a/commands");
  xhr.setRequestHeader("client_id", "94kvxq93azg5s88ta0xj");
  xhr.setRequestHeader("access_token", "8700a8e9a65f7a5039b9c851a4e8403b");
  xhr.setRequestHeader("sign", "E98F58973A7C659039ED96E3204CFD4E93C54FCED1179C11FDF6078A0AB484E5");
  xhr.setRequestHeader("t", "1633569443380");
  xhr.setRequestHeader("sign_method", "HMAC-SHA256");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
}

function doStuff(str) {

  if (str.startsWith("!sound ")) {
    str = str.replace("!sound ", "");
    if (str in sounds) {
      console.log(str);
      playSound(str);
      sleep(sounds[str]);
    }

  }
  else if (str.startsWith("!light ")) {
    str = str.replace("!light ", "");
    if (str in colors) {
      console.log("Color Changed to: " + str);
      changeLights(str, true);
      sleep(3000);
    }
    else if (str == "off" || str == "on") {
      changeLights(str, false);
      sleep(3000);
    }
  }

  else if (str.startsWith("!commands")) {
    console.log(str)
    let str2 = '';
    for (let k in sounds) {
      str2 += (k + '; ');
    }

    chatbox.innerText = "Sounds: ";
  }
  // if(str.toLowerCase().includes("test")){
  //     console.log(str)
  //     var mEvent = document.createEvent("KeyboardEvent");
  //     (keyUp(40), keyDown(38));
  // //     document.addEventListener("keyup", 

  // //   );
  // }


}

// document.addEventListener('click', () => {

//   playSound("bark");
//   //setTimeout(() => { console.log("World!"); }, 2000);
// })

// function start() {
//   observer.observe(target, options);
// }
// function end() {
//   observer.disconnect();
// }




window.addEventListener('load', function load(event) {
  function sub() {
    
    var sound = document.getElementById("sound_form").value;
    //changeLights(sound, true);
    //speechSynthesis.speak(new SpeechSynthesisUtterance("Value entered: " + sound));
    playSound(sound);
  }
  var st = document.getElementById("sub");
  if (st) {
    st.addEventListener('click', sub);
  }

});

observer.observe(target, options);


