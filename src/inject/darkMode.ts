import { 
  DarkModeState, 
  VoidCallback, 
  StateChangeCallback, 
  ValueCallback, 
  ErrorCallback
} from './callbacks';

/**
 * handleChromeSetCallback : gestionnaire de succès pour chrome.storage.sync.set
 * @param resolve : la fonction à appeler pour résoudre la Promise
 * @param reject : la fonction à appeler pour rejeter la Promise
 * @returns void : tu attends que l'opération se termine
 */
function handleChromeSetCallback(
  resolve: VoidCallback,
  reject: ErrorCallback
): void {
  if (chrome.runtime.lastError) {
    reject.execute(chrome.runtime.lastError);
    return;
  }
  resolve.execute();
}

/**
 * Callback anonyme pour chrome.storage.sync.set.
 * Cette fonction est passée directement à chrome.storage.sync.set.
 * @param resolve La fonction à appeler pour résoudre la Promise
 * @param reject La fonction à appeler pour rejeter la Promise
 */
function chromeStorageSetCallback(resolve: VoidCallback, reject: ErrorCallback): void {
  onChromeSetComplete(resolve, reject);
}

/**
 * Callback appelé quand chrome.storage.sync.set termine.
 * Cette fonction est passée à chrome.storage.sync.set pour gérer la fin de l'opération.
 * @param resolve La fonction à appeler pour résoudre la Promise
 * @param reject La fonction à appeler pour rejeter la Promise
 */
function onChromeSetComplete(resolve: VoidCallback, reject: ErrorCallback): void {
  handleChromeSetCallback(resolve, reject);
}

/**
 * Fonction exécutée par le constructeur Promise.
 * Elle démarre l'opération de sauvegarde dans chrome.storage.sync.
 * @param resolve La fonction à appeler pour résoudre la Promise
 * @param reject La fonction à appeler pour rejeter la Promise
 * @param items Les items à sauvegarder dans le storage Chrome
 */
function promiseExecutor(resolve: VoidCallback,reject: ErrorCallback,items: Record<string, DarkModeState>): void {
  function storageSetHandler(): void {
    chromeStorageSetCallback(resolve, reject);
  }
  chrome.storage.sync.set(items, storageSetHandler);
}

/**
 * Fonction exécutée par le constructeur Promise pour promisifyChromeSet.
 * Cette fonction démarre l'opération de sauvegarde.
 * @param resolve La fonction à appeler pour résoudre la Promise
 * @param reject La fonction à appeler pour rejeter la Promise
 * @param items Les items à sauvegarder dans le storage Chrome
 */
function promisifyChromeSetExecutor(resolve: VoidCallback,reject: ErrorCallback,items: Record<string, DarkModeState>): void {
  promiseExecutor(resolve, reject, items);
}

/**
 * Convertit l'API callback de chrome.storage.sync.set en Promise.
 * Cela permet d'utiliser async/await au lieu de callbacks imbriqués.
 * @param items Les items à sauvegarder dans le storage Chrome
 * @returns Une Promise qui se résout quand l'opération est terminée
 * todo: cest wack
 */
function promisifyChromeSet(items: Record<string, DarkModeState>): Promise<void> {
  return new Promise(function promisifyChromeSetPromise(resolve: () => void, reject: (error: chrome.runtime.LastError) => void): void {
    const resolveCallback = new class extends VoidCallback {
      execute(): void {
        resolve();
      }
    }();
    const rejectCallback = new class extends ErrorCallback {
      execute(error: chrome.runtime.LastError): void {
        reject(error);
      }
    }();
    promisifyChromeSetExecutor(resolveCallback, rejectCallback, items);
  });
}

/**
 * Active le mode sombre.
 * @returns void : tu attends que l'opération se termine
 */
export async function enableDarkMode(): Promise<void> {
  document.documentElement.classList.remove('vanilla');
  await setDarkModeState('yes');
}

/**
 * Désactive le mode sombre.
 * @returns void : tu attends que l'opération se termine
 */
export async function disableDarkMode(): Promise<void> {
  document.documentElement.classList.add('vanilla');
  await setDarkModeState('no');
}

/**
 * Initialise l'état du mode sombre au chargement de la page.
 * Récupère l'état sauvegardé et applique le bon mode.
 * Si aucun état n'existe, active le mode sombre par défaut.
 * @returns L'état actuel du mode sombre ('yes' ou 'no')
 */
export async function initDarkModeState(): Promise<DarkModeState> {
  let state = await getDarkModeState();
  if (state === 'no') {
    disableDarkModeDomOnly();
  } else if (state !== 'yes') {
    await setDarkModeState('yes');
    state = 'yes';
  }
  return state ?? 'yes';
}

/*
  * handleToggleClick : gère le clic sur le bouton toggle
  * @param state : l'état actuel du mode sombre
  * @param onChange : le callback à appeler quand l'état change
  * @returns l'état actuel du mode sombre
*/
async function handleToggleClick(state: DarkModeState, onChange: StateChangeCallback): Promise<DarkModeState> {
  if (state === 'yes') {
    await disableDarkMode();
    state = 'no';
  } else {
    await enableDarkMode();
    state = 'yes';
  }
  onChange.execute(state);
  return state;
}

/**
 * Attache un bouton toggle dans le header Omnivox pour basculer entre mode clair et sombre.
 * Le bouton est ajouté à côté du logo Omnivox.
 * @param initialState L'état initial du mode sombre
 * @param onChange Callback appelé quand l'état change (pour mise à jour de l'UI si nécessaire)
 */
export function attachToggle(initialState: DarkModeState, onChange: StateChangeCallback): void {
  const logoWrapper = document.getElementById('wrapper-headerOmnivoxLogo');
  if (!logoWrapper)
    {
      return;
    } 

  let state = initialState;

  const toggle = document.createElement('a');
  toggle.id = 'themeToggle';
  toggle.title = 'Toggle Light/Dark Mode';
  toggle.style.cssText = 'display: flex; height: 100%; justify-content: center; align-items: center; margin-left: 28px;';
  const iconUrl = chrome.runtime.getURL('/src/inject/icon.svg');
  toggle.innerHTML = '<img style="height: 60%" src="' + iconUrl + '" class="logo-lea" alt="Toggle Light/Dark Mode">';

  async function onToggleClick(): Promise<void> {
    state = await handleToggleClick(state, onChange);
  }

  toggle.addEventListener('click', onToggleClick);

  logoWrapper.appendChild(toggle);
}

function disableDarkModeDomOnly(): void {
  document.documentElement.classList.add('vanilla');
}

/**
 * Callback appelé quand chrome.storage.sync.get termine.
 * Gère les erreurs et résout ou rejette la Promise avec le résultat.
 * @param result Le résultat de la récupération depuis chrome.storage.sync
 * @param resolve La fonction à appeler pour résoudre la Promise avec la valeur
 * @param reject La fonction à appeler pour rejeter la Promise en cas d'erreur
 */
function onStorageGetComplete(result: Record<string, unknown>,resolve: ValueCallback,reject: ErrorCallback): void {
  if (chrome.runtime.lastError) {
    reject.execute(chrome.runtime.lastError);
    return;
  }
  resolve.execute(result['dark_mode'] as DarkModeState | undefined);
}

/**
 * Crée une fonction callback pour chrome.storage.sync.get.
 * Cette fonction wrapper permet de passer resolve et reject à onStorageGetComplete.
 * @param resolve La fonction à appeler pour résoudre la Promise avec la valeur
 * @param reject La fonction à appeler pour rejeter la Promise en cas d'erreur
 * @returns Une fonction callback compatible avec chrome.storage.sync.get
 */
function createStorageGetCallback(resolve: ValueCallback,reject: ErrorCallback): (result: Record<string, unknown>) => void {
  return function storageCallback(result: Record<string, unknown>): void {
    onStorageGetComplete(result, resolve, reject);
  };
}

/**
 * Fonction exécutée par le constructeur Promise pour getDarkModeState.
 * Elle démarre l'opération de récupération depuis chrome.storage.sync.
 * @param resolve La fonction à appeler pour résoudre la Promise avec la valeur
 * @param reject La fonction à appeler pour rejeter la Promise en cas d'erreur
 */
function getDarkModeStateExecutor(resolve: ValueCallback,reject: ErrorCallback): void {
  const callback = createStorageGetCallback(resolve, reject);
  chrome.storage.sync.get(['dark_mode'], callback);
}

/**
 * Fonction exécutée par le constructeur Promise pour getDarkModeState.
 * Cette fonction démarre l'opération de récupération.
 * @param resolve La fonction à appeler pour résoudre la Promise avec la valeur
 * @param reject La fonction à appeler pour rejeter la Promise en cas d'erreur
 */
function getDarkModeStatePromiseExecutor(resolve: ValueCallback,reject: ErrorCallback): void {
  getDarkModeStateExecutor(resolve, reject);
}

/**
 * Récupère l'état du mode sombre sauvegardé dans le storage Chrome.
 * Convertit l'API callback de Chrome en Promise pour pouvoir utiliser async/await.
 * @returns Une Promise qui se résout avec l'état ('yes', 'no') ou undefined si non défini
 */
function getDarkModeState(): Promise<DarkModeState | undefined> {
  return new Promise(function getDarkModeStatePromise(resolve: (value: DarkModeState | undefined) => void, reject: (error: chrome.runtime.LastError) => void): void {
    const resolveCallback = new class extends ValueCallback {
      execute(value: DarkModeState | undefined): void {
        resolve(value);
      }
    }();
    const rejectCallback = new class extends ErrorCallback {
      execute(error: chrome.runtime.LastError): void {
        reject(error);
      }
    }();
    getDarkModeStatePromiseExecutor(resolveCallback, rejectCallback);
  });
}

function setDarkModeState(state: DarkModeState): Promise<void> {
  return promisifyChromeSet({ dark_mode: state });
}