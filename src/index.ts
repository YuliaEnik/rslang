import './style.scss';
import { appState, runApp } from './app';
import { getUserWords } from './utils/api';

runApp();
if (appState.user) {
  await getUserWords(appState.user, { group: appState.groupState.group, page: appState.groupState.pageNumber });
}
