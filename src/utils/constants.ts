import {
  Page,
  StateTextContentEn,
  StateSprint,
  StateAudioG,
} from './types';

export const API_ENDPOINT = 'http://localhost:3000';

export const stateTextContentEn: StateTextContentEn = {
  btnTrue: 'true',
  btnFalse: 'false',
  exit: 'exit',
};

export const stateSprint: StateSprint = {
  curIndex: 0,
  score: 0,
  countCorrectAnsw: 0,
  questionsArray: [],
  falseAnsw: 0,
  trueAnsw: 1,
  isTrueTranslate: null,
  game_time: 60,
  points: 10,
};

export const stateAudioG:StateAudioG = {
  curIndex: 0,
  answsArray: [],
  questionsArray: [],
  score: 0,
  maxAnsw: 5,
};

export const pages: Page[] = [
  {
    title: 'Main',
    link: '/',
    type: 'main',
  },
  {
    title: 'Dictionary',
    link: '/dictionary/1?page=1',
    type: 'dictionary',
  },
  {
    title: 'Sprint',
    link: '/games',
    type: 'games',
  },
  {
    title: 'Statistics',
    link: '/statistics',
    type: 'statistics',
  },
  {
    title: 'Developers',
    link: '/developers',
    type: 'developers',
  },
  {
    title: '',
    link: '/logout',
    type: 'logout',
  },
];
