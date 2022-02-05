import Navigo from 'navigo';
import { buildDevelopersPage } from '../pages/developers';
import { buildMainPage } from '../pages/main';
import { buildStatisticsPage } from '../pages/statistics';
import { buildTextbook } from '../pages/textbook';
import { renderPage, stateTextContentEn } from './utils';
import { viewGame } from '../pages/games/game';

export const router: Navigo = new Navigo('/');

router
  .on('/', () => {
    renderPage(buildMainPage());
  })
  .on('/dictionary', () => {
    renderPage(buildTextbook());
  })
  .on('/sprint', () => {
    renderPage(viewGame(stateTextContentEn));
  })
  .on('/statistics', () => {
    renderPage(buildStatisticsPage());
  })
  .on('/developers', () => {
    renderPage(buildDevelopersPage());
  });
