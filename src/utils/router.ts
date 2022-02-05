import Navigo from 'navigo';
import { buildDevelopersPage } from '../pages/developers';
import { buildMainPage } from '../pages/main';
import { buildSettingsPage } from '../pages/settings';
import { buildSprintPage } from '../pages/sprint';
import { buildStatisticsPage } from '../pages/statistics';
import { buildTextbook } from '../pages/textbook';
import { renderPage } from './utils';

export const router: Navigo = new Navigo('/');

router
  .on('/', (context) => {
    renderPage(buildMainPage(), context);
  })
  .on('/dictionary', (context) => {
    renderPage(buildTextbook(), context);
  })
  .on('/games', (context) => {
    renderPage(buildSprintPage(), context);
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
