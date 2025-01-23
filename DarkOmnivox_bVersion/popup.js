document.addEventListener("DOMContentLoaded", () => {
    document.getElementsById("changeColor").addEventListener("click", () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: changeDivBackgrounds
            })
        })
    })
    function changeDivBackgrounds() {
        const divs = document.getElementsByTagName("div");
        divs.forEach(div => {
            div.style.backgroundColor = 'red';
        })
    }
})
