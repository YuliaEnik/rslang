import Navigo, { Match } from 'navigo';
import { buildDevelopersPage } from '../pages/developers';
import { buildMainPage } from '../pages/main';
import { buildStatisticsPage } from '../pages/statistics';
import { buildDictionaryPage } from '../pages/textbook';
import { renderPage } from './utils';
import { viewGame } from '../pages/games/game';
import { stateTextContentEn } from './constants';
import { buildSignUpPage } from '../pages/signup';
import { appState, data } from '../app';
import { buildLogInPage } from '../pages/login';
import { getWords } from './api';

function updateDictionaryPageAppState(context: Match | undefined) {
  appState.groupState.group = context?.data && context.data[1] ? parseInt(context.data[1], 10) - 1 : 0;
  appState.groupState.pageNumber = context?.params ? parseInt(context.params.page, 10) - 1 : 0;
}

export const router: Navigo = new Navigo('/');

router
  .on({
    '/': {
      as: 'Main',
      uses: (context: Match | undefined) => {
        renderPage(buildMainPage(), context);
      },
    },
  })
  .on(/dictionary(\/(.*)?)?/, (context) => {
    updateDictionaryPageAppState(context);
    renderPage(buildDictionaryPage(), context);
  })
  .on('/games', async (context) => {
    data.words = await getWords();
    renderPage(viewGame(stateTextContentEn), context);
  })
  .on('/games/sprint', (context) => {
    renderPage(viewGame(stateTextContentEn), context);
  })
  .on('/statistics', (context) => {
    renderPage(buildStatisticsPage(), context);
  })
  .on('/developers', (context) => {
    renderPage(buildDevelopersPage(), context);
  })
  .on('/signup', (context) => {
    renderPage(buildSignUpPage(), context);
  })
  .on('/login', (context) => {
    renderPage(buildLogInPage(), context);
  });
