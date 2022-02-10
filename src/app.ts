import { router } from './utils/router';
import { AppState } from './utils/types';

export const runApp = (): void => {
  router.resolve();
};

export const appState: AppState = {
  user: {
    token: null,
    refreshToken: null,
    userId: null,
    name: null,
    email: null,
  },
  groupState: {
    group: 0,
    pageNumber: 0,
  },
};
