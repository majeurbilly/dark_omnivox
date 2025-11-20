import { DarkModeState } from '../shared/darkMode';
import { getSync, setSync } from './chromeStorage';

const STORAGE_KEY = 'dark_mode';

type DarkModeStorageShape = {
  [STORAGE_KEY]?: DarkModeState;
};

export class DarkModeStore {
  async read(): Promise<DarkModeState | undefined> {
    const result = await getSync<DarkModeStorageShape>([STORAGE_KEY]);
    return result[STORAGE_KEY];
  }

  async write(state: DarkModeState): Promise<void> {
    await setSync({ [STORAGE_KEY]: state });
  }
}

