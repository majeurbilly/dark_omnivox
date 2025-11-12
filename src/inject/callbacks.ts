export type DarkModeState = 'yes' | 'no';

/**
 * Classe abstraite pour les callbacks qui ne prennent pas de paramètres
 * @returns void : tu attends que l'opération se termine
 */
export abstract class VoidCallback {
  abstract execute(): void;
}

/**
 * Classe abstraite pour les callbacks qui prennent un état en paramètre
 * @param nextState : l'état suivant
 * @returns void : tu attends que l'opération se termine
 */
export abstract class StateChangeCallback {
  abstract execute(nextState: DarkModeState): void;
}

/**
 * Classe abstraite pour les callbacks qui prennent une valeur en paramètre
 * @param value : la valeur à récupérer
 * @returns void : tu attends que l'opération se termine
 */
export abstract class ValueCallback {
  abstract execute(value: DarkModeState | undefined): void;
}

/**
 * Classe abstraite pour les callbacks qui prennent une erreur en paramètre
 * @param error : l'erreur qui s'est produite
 * @returns void : tu attends que l'opération se termine
 */
export abstract class ErrorCallback {
  abstract execute(error: chrome.runtime.LastError): void;
}
