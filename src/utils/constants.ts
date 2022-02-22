import {
  Page,
  StateTextContentEn,
  StateSprint,
  StateAudioG,
} from './types';

export const API_ENDPOINT = 'https://rslang-20-be.herokuapp.com';

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
  isEnded: false,
  currentStreak: 0,
  muted: false,
};

export const stateAudioG: StateAudioG = {
  curIndex: 0,
  answsArray: [],
  questionsArray: [],
  score: 0,
  maxAnsw: 5,
  isEnded: false,
  currentStreak: 0,
  muted: false,
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
    link: '/sprint',
    type: 'sprintgame',
  },
  {
    title: 'Audio Challenge',
    link: '/audioChallenge',
    type: 'audiogame',
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

export const keyboardKeysSprintGame: { [key: string]: boolean } = {
  ArrowLeft: false,
  ArrowRight: false,
};

export const keyboardKeysAudioGame: { [key: string]: boolean } = {
  Digit1: false,
  Digit2: false,
  Digit3: false,
  Digit4: false,
  Digit5: false,
  Enter: false,
  ArrowRight: false,
  Space: false,
};

export const navigationKeys: { [key: string]: boolean } = { ArrowLeft: true, ArrowRight: false };

export const nextKeyboardBtn = 'ArrowRight';

export const amswerKeyboardBtn = 'Enter';

export const soundKeyboardBtn = 'Space';
