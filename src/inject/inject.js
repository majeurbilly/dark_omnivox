/*chrome.extension.sendMessage({}, function(response) {
    document.addEventListener("DOMContentLoaded", function(event) {
      document.getElementsByTagName("body")[0].style.filter = "invert(1) hue-rotate(180deg)";
    });
}); */

window.onload = async function () {
    
    var isDarkModeEnabled;
    
    function enableDark() {
        document.getElementsByTagName("html")[0].classList.remove("vanilla")
    }
    
    function disableDark() {
        console.log('disabling')
        document.getElementsByTagName("html")[0].classList.add("vanilla")
    }
    
    await chrome.storage.sync.get(['dark_mode'], function(result) {
        isDarkModeEnabled = result['dark_mode']
        
        if(isDarkModeEnabled === 'yes' || isDarkModeEnabled === 'no') {
            if (isDarkModeEnabled === 'no') {
                disableDark()
            }
        } else {
            chrome.storage.sync.set({dark_mode: 'yes'}, function() {
                isDarkModeEnabled = 'yes'
            });     
        }
    
        var div = document.createElement('a');
        div.setAttribute('id', 'themeToggle')
        div.setAttribute('title', 'Toggle Light/Dark Mode')
        div.setAttribute('style', 'display: flex; height: 100%; justify-content: center; align-items: center; margin-left: 28px;')
        div.innerHTML = `<img style="height: 60%" src="${chrome.runtime.getURL('/src/inject/icon.svg')}" class="logo-lea" alt="Toggle Light/Dark Mode">`;
        document.getElementById('wrapper-headerOmnivoxLogo').appendChild(div);
        document.getElementById("themeToggle").addEventListener("click", () => {
            if (isDarkModeEnabled === 'yes') { 
                disableDark()
                chrome.storage.sync.set({dark_mode: 'no'}, function() {
                    isDarkModeEnabled = 'no'
                });
            }
            else if (isDarkModeEnabled === 'no') {
                enableDark()
                chrome.storage.sync.set({dark_mode: 'yes'}, function() {
                    isDarkModeEnabled = 'yes'
                });
            }
        });
    });
    

    /*document.getElementsByTagName("html")[0].style.filter = "invert(1) hue-rotate(180deg)";*/
}
