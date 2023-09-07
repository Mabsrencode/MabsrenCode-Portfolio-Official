function setSessionCookie() {
  var nowInMinutes = Math.floor(Date.now() / 60e3);
  var expirationTime = new Date(nowInMinutes + 1800000).toUTCString();
  document.cookie =
    "session=" + nowInMinutes + "; expires=" + expirationTime + "; path=/";
}
function getSessionCookie() {
  var name = "session=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(";");

  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }

  return "";
}
function checkSessionTimeout() {
  var session = getSessionCookie();
  if (session === "") {
    window.location.href = "/admin";
  } else {
    var nowInMinutes = Math.floor(Date.now() / 60e3);
    var sessionStart = parseInt(session, 10);
    var sessionDuration = nowInMinutes - sessionStart;
    if (sessionDuration > 30) {
      window.location.href = "/admin";
    }
  }
}
function checkSessionTimeout() {
  var session = getSessionCookie();
  if (session === "") {
    window.location.href = "/admin";
  } else {
    var nowInMinutes = Math.floor(Date.now() / 60e3);
    var sessionStart = parseInt(session, 10);
    var sessionDuration = nowInMinutes - sessionStart;
    if (sessionDuration > 30) {
      window.location.href = "/admin";
    }
  }
}
setSessionCookie();
setInterval(checkSessionTimeout, 100000);
