import { DarkModeState } from '../shared/darkMode';

const VANILLA_CLASS = 'vanilla';

export function applyTheme(state: DarkModeState): void {
  const root = document.documentElement;

  if (state === 'yes') {
    root.classList.remove(VANILLA_CLASS);
    return;
  }

  root.classList.add(VANILLA_CLASS);
}

