document.addEventListener('DOMContentLoaded', function() {
    var token;
    var activated = false;
    var serverurl = "";
    function toggleColorName() {
        var color = !activated ? 'red' : 'green';
        document.querySelector(".status").style.color = color;
        document.querySelector(".status").innerHTML = activated ? "Activated" : "Disabled"
        document.querySelector(".button").innerHTML = activated ? "Stop" : "Start"
        document.querySelector(".input").value = !serverurl ? 'Insert server url here!' : serverurl
    }
    chrome.storage.sync.get("server_url", function(items) {
      serverurl = items['server_url'];
     });
    chrome.storage.sync.get("activated", function(items) {
      activated = items.activated;
      toggleColorName()
     });
  
    chrome.cookies.get({"url": "https://duolingo.com", "name": "jwt_token"}, function(cookie) {
      try {
        document.querySelector('.msg').innerHTML = 'Duolingo account detected!';
        token = cookie.value
      } catch (e) {
        document.querySelector('.msg').innerHTML = "Log into Duolingo!";
      }
    });
    document.querySelector(".input").addEventListener('input',(e)=> {
      chrome.storage.sync.set({
        "server_url": e.target.value
      }, function() {
        serverurl = e.target.value
        chrome.runtime.sendMessage({
          msg: "url_change",
          url: e.target.value
        });
      });
    })

    document.querySelector('.git').addEventListener('click',() => {
      window.open('https://github.com/GabrielMota1056/duomenu/blob/main/README.md', '_blank').focus();
    })
    document.querySelector(".button").addEventListener("click", () => {
        chrome.storage.sync.set({
            "activated": !activated
          }, function() {
            activated = !activated;
            chrome.runtime.sendMessage({
              msg: "toggle",
              activated: activated
            });
          });
      toggleColorName();
      chrome.runtime.reload();
    });
  
  });