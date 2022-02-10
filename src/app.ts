import { loadUserFromLocalStorage } from './services/auth/login';
import { router } from './utils/router';
import { AppState } from './utils/types';

export const appState: AppState = {
  user: null,
  groupState: {
    group: 0,
    pageNumber: 0,
  },
};

export const runApp = (): void => {
  appState.user = loadUserFromLocalStorage();
  router.resolve();
};
