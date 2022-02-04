import Navigo from 'navigo';
import { buildMainPage } from '../pages/main';
import { buildTextbook } from '../textbook';
import { renderPage } from './utils';

export const router = new Navigo('/');

router
  .on('/', () => {
    renderPage(buildMainPage());
  })
  .on('/games', (match) => {
    console.log(match);
  })
  .on('/dictionary', () => {
    renderPage(buildTextbook());
  });
