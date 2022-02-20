import { loadUserFromLocalStorage } from './services/auth/login';
import { router } from './utils/router';
import { AppState, AppStateUI, Data } from './utils/types';
import { loadUserUISettingsFromLocalStorage } from './utils/utils';

export const appState: AppState = {
  user: null,
  groupState: {
    group: 0,
    pageNumber: 0,
  },
};

export const appStateUI: AppStateUI = {
  settings: {
    menu: '',
  },
};

export const data: Data = {
  words: [],
};

export const runApp = (): void => {
  appState.user = loadUserFromLocalStorage();
  appStateUI.settings = loadUserUISettingsFromLocalStorage();
  router.resolve();
};
