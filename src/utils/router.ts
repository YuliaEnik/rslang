import Navigo from 'navigo';
import { buildDevelopersPage } from '../pages/developers';
import { buildMainPage } from '../pages/main';
import { buildStatisticsPage } from '../pages/statistics';
import { buildTextbook } from '../pages/textbook';
import { renderPage, stateTextContentEn } from './utils';
import { viewGame } from '../pages/games/game';
import { buildSettingsPage } from '../pages/settings';

export const router: Navigo = new Navigo('/');

router
  .on('/', (context) => {
    renderPage(buildMainPage(), context);
  })
  .on('/dictionary', (context) => {
    renderPage(buildTextbook(), context);
  })
  .on('/sprint', (context) => {
    renderPage(viewGame(stateTextContentEn), context);
  })
  .on('/statistics', (context) => {
    renderPage(buildStatisticsPage(), context);
  })
  .on('/developers', (context) => {
    renderPage(buildDevelopersPage(), context);
  })
  .on('/settings', (context) => {
    renderPage(buildSettingsPage(), context);
  });
