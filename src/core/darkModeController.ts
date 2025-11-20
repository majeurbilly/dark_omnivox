import { applyTheme } from './themeApplier';
import { DarkModeState, DarkModeChangeHandler } from '../shared/darkMode';
import { DarkModeStore } from '../storage/darkModeStore';

const DEFAULT_STATE: DarkModeState = 'yes';

export class DarkModeController {
  private currentState: DarkModeState = DEFAULT_STATE;
  private readonly listeners = new Set<DarkModeChangeHandler>();

  constructor(
    private readonly store: DarkModeStore,
    private readonly defaultState: DarkModeState = DEFAULT_STATE
  ) {}

<<<<<<< HEAD
  init(): void {
    const savedState = this.store.getDarkMode();
    this.apply(savedState);
=======
  async init(): Promise<DarkModeState> {
    const savedState = await this.store.read();
    const nextState = savedState ?? this.defaultState;

    this.apply(nextState);

    if (savedState === undefined) {
      await this.store.write(nextState);
    }

    return nextState;
>>>>>>> parent of a7ff512 (Merge pull request #1 from majeurbilly/gab)
  }

  get state(): DarkModeState {
    return this.currentState;
  }

<<<<<<< HEAD
  toggle(): boolean {
    const nextState: boolean = !this.currentState;
=======
  async toggle(): Promise<DarkModeState> {
    const nextState: DarkModeState = this.currentState === 'yes' ? 'no' : 'yes';

>>>>>>> parent of a7ff512 (Merge pull request #1 from majeurbilly/gab)
    this.apply(nextState);
    await this.store.write(nextState);

    return nextState;
  }

  onChange(listener: DarkModeChangeHandler): () => void {
    this.listeners.add(listener);
    listener(this.currentState);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private apply(state: DarkModeState): void {
    this.currentState = state;
    applyTheme(state);
    this.listeners.forEach((listener) => listener(state));
  }
}

