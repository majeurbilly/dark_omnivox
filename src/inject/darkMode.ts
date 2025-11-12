import { 
  DarkModeState, 
  VoidCallback, 
  StateChangeCallback, 
  ValueCallback, 
  ErrorCallback
} from './callbacks';

/**
 * Convertit l'API callback de chrome.storage.sync.set en Promise.
 * @param items Les items à sauvegarder dans le storage Chrome
 * @returns Une Promise qui se résout quand l'opération est terminée
 */
function promisifyChromeSet(items: Record<string, DarkModeState>): Promise<void> {
  return new Promise((resolve: () => void, reject: (error: chrome.runtime.LastError) => void): void => {
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
    
    chrome.storage.sync.set(items, (): void => {
      if (chrome.runtime.lastError) {
        rejectCallback.execute(chrome.runtime.lastError);
        return;
      }
      resolveCallback.execute();
    });
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

/**
 * Gère le clic sur le bouton toggle pour basculer entre les modes.
 * @param state L'état actuel du mode sombre
 * @param onChange Le callback à appeler quand l'état change
 * @returns Le nouvel état du mode sombre
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
  if (!logoWrapper) {
    return;
  }

  let state = initialState;

  const toggle = document.createElement('a');
  toggle.id = 'themeToggle';
  toggle.title = 'Toggle Light/Dark Mode';
  toggle.style.cssText = 'display: flex; height: 100%; justify-content: center; align-items: center; margin-left: 28px; cursor: pointer;';
  const iconUrl = chrome.runtime.getURL('/dist/inject/icon.svg');
  const iconImg = document.createElement('img');
  iconImg.style.cssText = 'height: 60%; transition: filter 0.3s ease;';
  iconImg.src = iconUrl;
  iconImg.className = 'logo-lea';
  iconImg.alt = 'Toggle Light/Dark Mode';
  
  // Fonction pour mettre à jour l'apparence de l'icône selon l'état
  function updateIconAppearance(currentState: DarkModeState): void {
    if (currentState === 'yes') {
      // Mode dark : icône inversée (blanche sur fond sombre)
      iconImg.style.filter = 'invert(1) brightness(1.2)';
    } else {
      // Mode light : icône normale (noire sur fond clair)
      iconImg.style.filter = 'none';
    }
  }
  
  // Initialiser l'apparence de l'icône
  updateIconAppearance(state);

  async function onToggleClick(): Promise<void> {
    state = await handleToggleClick(state, onChange);
    // Mettre à jour l'apparence de l'icône après le changement
    updateIconAppearance(state);
  }

  toggle.appendChild(iconImg);
  toggle.addEventListener('click', onToggleClick);

  logoWrapper.appendChild(toggle);
}

function disableDarkModeDomOnly(): void {
  document.documentElement.classList.add('vanilla');
}

/**
 * Récupère l'état du mode sombre sauvegardé dans le storage Chrome.
 * @returns Une Promise qui se résout avec l'état ('yes', 'no') ou undefined si non défini
 */
function getDarkModeState(): Promise<DarkModeState | undefined> {
  return new Promise((resolve: (value: DarkModeState | undefined) => void, reject: (error: chrome.runtime.LastError) => void): void => {
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
    
    chrome.storage.sync.get(['dark_mode'], (result: Record<string, unknown>): void => {
      if (chrome.runtime.lastError) {
        rejectCallback.execute(chrome.runtime.lastError);
        return;
      }
      resolveCallback.execute(result['dark_mode'] as DarkModeState | undefined);
    });
  });
}

function setDarkModeState(state: DarkModeState): Promise<void> {
  return promisifyChromeSet({ dark_mode: state });
}