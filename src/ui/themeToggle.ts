import { DarkModeController } from '../core/darkModeController';
import { DarkModeState } from '../shared/darkMode';

const TOGGLE_ID = 'themeToggle';
const ICON_CLASS = 'logo-lea';
const ICON_PATH = 'inject/icon.svg';

export class ThemeToggle {
  private readonly toggleElement: HTMLAnchorElement;
  private readonly iconElement: HTMLImageElement;
  private isProcessing = false;
  private unsubscribe?: () => void;

  constructor(
    private readonly container: HTMLElement,
    private readonly controller: DarkModeController
  ) {
    this.toggleElement = document.createElement('a');
    this.toggleElement.id = TOGGLE_ID;
    this.toggleElement.title = chrome.i18n.getMessage('toggleButtonTitle');
    this.toggleElement.setAttribute('aria-pressed', 'false');
    this.toggleElement.style.cssText = [
      'display: flex',
      'height: 100%',
      'justify-content: center',
      'align-items: center',
      'margin-left: 28px',
      'cursor: pointer'
    ].join('; ');

    this.iconElement = document.createElement('img');
    this.iconElement.src = chrome.runtime.getURL(ICON_PATH);
    this.iconElement.alt = chrome.i18n.getMessage('toggleButtonTitle');
    this.iconElement.className = ICON_CLASS;
    this.iconElement.style.cssText = 'height: 60%; transition: filter 0.3s ease';

    this.toggleElement.appendChild(this.iconElement);
    this.toggleElement.addEventListener('click', this.handleClick);
  }

  mount(): void {
    this.container.appendChild(this.toggleElement);
    this.unsubscribe = this.controller.onChange((state) => {
      this.toggleElement.setAttribute('aria-pressed', String(state === 'yes'));
      this.updateIcon(state);
    });
  }

  dispose(): void {
    this.unsubscribe?.();
    this.toggleElement.removeEventListener('click', this.handleClick);
    this.toggleElement.remove();
  }

  private handleClick = async (event: MouseEvent): Promise<void> => {
    event.preventDefault();

    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      await this.controller.toggle();
    } finally {
      this.isProcessing = false;
    }
  };

  private updateIcon(state: DarkModeState): void {
    if (state === 'yes') {
      this.iconElement.style.filter = 'invert(1) brightness(1.2)';
      return;
    }

    this.iconElement.style.filter = 'none';
  }
}

