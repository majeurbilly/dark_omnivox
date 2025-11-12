import { attachToggle, initDarkModeState } from './darkMode';
import { StateChangeCallback } from './callbacks';

async function bootstrap(): Promise<void> {
  const state = await initDarkModeState();
  const onChangeCallback = new class extends StateChangeCallback {
    execute(): void {
    }
  }();
  attachToggle(state, onChangeCallback);
}

window.onload = () => {
  void bootstrap();
};

