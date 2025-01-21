var div = document.createElement('a');// création d'un élément <a> dynamiquement
div.setAttribute('id', 'themeToggle')// ID à l'élément pour le manipuler plus facilement
div.setAttribute('title', 'Toggle Light/Dark Mode')// titre pour indiquer la fonctionnalité du bouton
div.setAttribute('style', 'display: flex; height: 100%; justify-content: center; align-items: center; margin-left: 28px;')// apparence et la position du bouton
// bouton (une image icône)
div.innerHTML = `<img style="height: 60%" src="${chrome.runtime.getURL('/src/inject/icon.svg')}" class="logo-lea" alt="Toggle Light/Dark Mode">`;// élément bouton au DOM, en tant qu'enfant d'un élément existant
document.getElementById('wrapper-headerOmnivoxLogo').appendChild(div);// événements sur le bouton pour détecter les clics


window.onload = async function () {// exécuté au chargement de la page

    var darkModeActive;  // Variable pour stocker l'état du mode sombre

    function activerDark() {  // Fonction pour activer le mode sombre
        document.getElementsByTagName("html")[0].classList.remove("vanilla")
    }

    function desactiverDark() {  // Fonction pour désactiver le mode sombre
        console.log('disabling')
        document.getElementsByTagName("html")[0].classList.add("vanilla")
    }

    // Récupère la valeur actuelle du mode sombre dans le stockage de Chrome
    await chrome.storage.sync.get(['dark_mode'], function (result) {
        darkModeActive = result['dark_mode']

        if (darkModeActive === 'yes' || darkModeActive === 'no') {
            if (darkModeActive === 'no') {
                desactiverDark()
            }
        } else { // Définit le mode sombre comme activé par défaut si aucune configuration n'existe
            chrome.storage.sync.set({dark_mode: 'yes'}, function () {
                darkModeActive = 'yes'
            });
        }

        document.getElementById("themeToggle").addEventListener("click", () => {// événements sur le bouton pour détecter les clics
            if (darkModeActive === 'yes') {    // vérifie si le mode sombre est activé

                desactiverDark();// Désactive le mode sombre
                chrome.storage.sync.set({dark_mode: 'no'}, function () {
                    darkModeActive = 'no'
                });
            } else if (darkModeActive === 'no') { // Vérifier le navigateur du user pour voir si il est sur dark ou light et set le mode
                activerDark()
                chrome.storage.sync.set({dark_mode: 'yes'}, function () {
                    darkModeActive = 'yes'
                });
            }
        });
    });


    /*document.getElementsByTagName("html")[0].style.filter = "invert(1) hue-rotate(180deg)";*/
    /*chrome.extension.sendMessage({}, function(response) {
    document.addEventListener("DOMContentLoaded", function(event) {
      document.getElementsByTagName("body")[0].style.filter = "invert(1) hue-rotate(180deg)";
    });
}); */
}
