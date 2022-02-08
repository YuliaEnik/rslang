import { Page, StateTextContentEn } from './types';

export const API_ENDPOINT = 'http://localhost:3000';

export const stateTextContentEn: StateTextContentEn = {
  btnTrue: 'true',
  btnFalse: 'false',
  exit: 'exit',
};

export const pages: Page[] = [
  {
    title: 'Main',
    link: '/',
    type: 'main',
  },
  {
    title: 'Dictionary',
    link: '/dictionary/1',
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
    title: 'Settings',
    link: '/settings',
    type: 'settings',
  },
];
