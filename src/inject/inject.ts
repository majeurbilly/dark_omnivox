import { DarkModeStore } from '../storage/darkModeStore';
import { DarkModeController } from '../core/darkModeController';
import { ThemeToggle } from '../ui/themeToggle';

async function bootstrapThemeToggle(): Promise<void> {
  const container = document.getElementById('wrapper-headerOmnivoxLogo');

  if (!container) {
    return;
  }

  const store = new DarkModeStore();
  const controller = new DarkModeController(store);

  try {
    await controller.init();
  } catch (error) {
    console.error('Failed to initialize dark mode state', error);
    return;
  }

  const toggle = new ThemeToggle(container, controller);
  toggle.mount();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void bootstrapThemeToggle();
  });
} else {
  void bootstrapThemeToggle();
}
