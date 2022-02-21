import { loadUserFromLocalStorage } from './services/auth/login';
import { router } from './utils/router';
import { loadUserUISettingsFromLocalStorage as loadUserUiSettingsFromLocalStorage } from './utils/utils';
import { AppState, AppStateUi, Data } from './utils/types';

export const appState: AppState = {
  user: null,
  groupState: {
    group: 0,
    pageNumber: 0,
  },
};

export const appStateUi: AppStateUi = {
  signUpErrors: [],
  logInErrors: [],
  settings: {
    menu: '',
  },
};

export const data: Data = {
  words: [],
};

export const runApp = (): void => {
  appState.user = loadUserFromLocalStorage();
  appStateUi.settings = loadUserUiSettingsFromLocalStorage();
  router.resolve();
};
