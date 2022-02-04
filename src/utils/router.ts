import Navigo from 'navigo';
import { buildDevelopersPage } from '../pages/developers';
import { buildMainPage } from '../pages/main';
import { buildSprintPage } from '../pages/sprint';
import { buildStatisticsPage } from '../pages/statistics';
import { buildTextbook } from '../pages/textbook';
import { renderPage } from './utils';

export const router: Navigo = new Navigo('/');

router
  .on('/', () => {
    renderPage(buildMainPage());
  })
  .on('/dictionary', () => {
    renderPage(buildTextbook());
  })
  .on('/sprint', () => {
    renderPage(buildSprintPage());
  })
  .on('/statistics', () => {
    renderPage(buildStatisticsPage());
  })
  .on('/developers', () => {
    renderPage(buildDevelopersPage());
  });
