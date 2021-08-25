var activated = false;
var serverurl = "";
var opensession = true;
var Token = "";
var url =  "";
var loadcheck;
var roottext = "";

// Obter se o hack está ativado ou não.
chrome.storage.sync.get("activated", function(items) {
    activated = items.activated;
    console.log(activated)
});

// Obter a url do servidor.
chrome.storage.sync.get("server_url", function(items) {
  console.log('loaded url:', items['server_url'])
  serverurl = items['server_url'];
 });

// Checar se a url do servidor foi alterada ou se o hack foi ligado/desligado.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.msg === "toggle") {
        activated = request.activated;
      } else if (request.msg == "rootDOM") {
        roottext = request.text;
      }
      if (request.msg === "url_change") {
        console.log('Url changed:', request.url)
        serverurl = request.url;
      }
    }
);

// Obter token do duolingo.
chrome.cookies.get({"url": "https://duolingo.com", "name": "jwt_token"}, function(_cookie) {
    try {
      Token = _cookie.value;
    } catch (e) {}
});

// Desvia o request da lissão do duolingo para o request do servidor do hack.
chrome.webRequest.onBeforeRequest.addListener(function(details) {

  loadcheck = setInterval(()=> {
    if (roottext = "") {
      console.log('Root Died, reloading page...')
      document.location.reload();
    } else {
      clearInterval(loadcheck)
    }
  },1000)


    if (activated && opensession && details.url.includes("session") && !details.url.includes('cloudfront')) {
        console.log('[DuoMenu] Session POST found.')
        opensession = false;
        return {
            redirectUrl: `${serverurl}?t=${Date.now()}&token=${Token}&url=${url}`
         }
    }
}, {urls: ["<all_urls>"]}, ["blocking"]);


chrome.webRequest.onErrorOccurred.addListener(
  function(d) {
    if (d.url.includes(Token)) {
      alert('Error: Server unavailable or invalid URL!')
    }
  },
  {urls: ["<all_urls>"]}
);


chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
      url = tab.url;
      if (changeInfo.url) {
        opensession = true;
      }
    }
  );