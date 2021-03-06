import Navigo, { Match } from 'navigo';
import { buildDevelopersPage } from '../pages/developers';
import { buildMainPage } from '../pages/main';
import { buildStatisticsPage, calculateStat } from '../pages/statistics';
import { buildDictionaryPage } from '../pages/textbook';
import { renderPage } from './utils';
import { viewGame } from '../pages/games/game';
import { stateTextContentEn } from './constants';
import { buildSignUpPage } from '../pages/signup';
import { appState } from '../app';
import { buildLogInPage } from '../pages/login';
import { getUserStatistics } from './api';
import { buildGameStartPage } from '../pages/games';

function updateDictionaryPageAppState(context: Match | undefined) {
  appState.groupState.group = context?.data && context.data[1] ? parseInt(context.data[1], 10) - 1 : 0;
  appState.groupState.pageNumber = context?.params ? parseInt(context.params.page, 10) - 1 : 0;
}

class CustomNavigo extends Navigo {
  reload(): void {
    const match = this.current ? this.current[0] : {} as Match;

    const route = `${match.url}?${match.queryString}#${match.hashString}`;

    match.queryString = Number(new Date()).toString();

    this.navigate(route);
  }
}

export const router = new CustomNavigo('/');

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
  .on('/sprint', (context) => {
    renderPage(buildGameStartPage('sprint'), context, false, true, true);
  })
  .on('/sprint/play', (context) => {
    renderPage(viewGame('sprint', stateTextContentEn), context, false, true, true);
  })
  .on('/audioChallenge', (context) => {
    renderPage(buildGameStartPage('audioChallenge'), context, false, true, true);
  })
  .on('/audioChallenge/play', (context) => {
    renderPage(viewGame('audioChallenge', stateTextContentEn), context, false, true, true);
  })
  .on('/statistics', async (context) => {
    const userStatistics = await getUserStatistics(appState.user);
    const result = calculateStat(userStatistics);
    renderPage(buildStatisticsPage(result), context);
  })
  .on('/developers', (context) => {
    renderPage(buildDevelopersPage(), context);
  })
  .on('/signup', (context) => {
    renderPage(buildSignUpPage(), context, false, true, true);
  })
  .on('/login', (context) => {
    renderPage(buildLogInPage(), context, false, true, true);
  });
