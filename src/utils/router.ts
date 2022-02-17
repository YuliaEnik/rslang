import Navigo, { Match } from 'navigo';
import { buildDevelopersPage } from '../pages/developers';
import { buildMainPage } from '../pages/main';
import { buildStatisticsPage, calculateStat } from '../pages/statistics';
import { buildDictionaryPage } from '../pages/textbook';
import { renderPage } from './utils';
import { viewGame } from '../pages/games/game';
import { stateTextContentEn } from './constants';
import { buildSignUpPage } from '../pages/signup';
import { appState, data } from '../app';
import { buildLogInPage } from '../pages/login';
import { getUserStatistics, getWords } from './api';
import { buildGameStartPage } from '../pages/games';

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
  .on('/sprint', async (context) => {
    renderPage(buildGameStartPage('sprint'), context, true, true);
    // data.words = await getWords();
    // renderPage(viewGame(stateTextContentEn), context);
  })
  .on('/sprint/play', (context) => {
    renderPage(viewGame('sprint', stateTextContentEn), context, true, true);
  })
  .on('/audioChallenge', async (context) => {
    renderPage(buildGameStartPage('audioChallenge'), context, true, true);
  })
  .on('/audioChallenge/play', async (context) => {
    alert('Game audioChallenge is under contruction');
    // renderPage(viewGame('audioChallenge', stateTextContentEn), context, true, true);
  })
  .on('/statistics', async (context) => {
    const userStatistics = await getUserStatistics(appState.user);
    const result = await calculateStat(userStatistics);
    renderPage(buildStatisticsPage(result), context);
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
