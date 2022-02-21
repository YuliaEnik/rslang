import { appState, data } from '../../app';
import { getWords } from '../../utils/api';
import { router } from '../../utils/router';
import { createElement, random, renderElement } from '../../utils/utils';

interface GameLabels {
  [key:string]: {
    [key:string]: string;
  }
}

const gameLabels: GameLabels = {
  sprint: {
    title: 'Sprint',
    description: 'Pick all correct translations in a minute',
  },
  audioChallenge: {
    title: 'Audio Challenge',
    description: 'This game will improve your listening skills',
  },
};

const gameLevels = [
  {
    levelName: 'A1',
    levelGroup: '0',
    page: `${random(29)}`,
  },
  {
    levelName: 'A2',
    levelGroup: '1',
    page: `${random(29)}`,
  },
  {
    levelName: 'B1',
    levelGroup: '2',
    page: `${random(29)}`,
  },
  {
    levelName: 'B2',
    levelGroup: '3',
    page: `${random(29)}`,
  },
  {
    levelName: 'C1',
    levelGroup: '4',
    page: `${random(29)}`,
  },
  {
    levelName: 'C2',
    levelGroup: '5',
    page: `${random(29)}`,
  },
];

async function buildGamePage(game: string, group: string, page: string) {
  data.words = await getWords({ group: +group, page: +page });
  router.navigate(`/${game}/play`);
}

export function buildGameStartPage(game: string) {
  const result = createElement('section', { class: `section game game--${game}` });

  const header = createElement('header', { class: 'game__header' });
  renderElement(header, result);

  const section = createElement('section', { class: 'section__game' });

  const gameButtons = createElement('div', { class: 'game__buttons' });
  const gameClose = createElement('a', { class: 'btn btn--close', href: '/dictionary/1?page=1', 'data-navigo': '' });
  renderElement(gameClose, gameButtons);

  const gameFullScreen = createElement('button', { class: 'btn btn--fullscreen' });
  gameClose.addEventListener('click', () => console.log(game));
  renderElement(gameFullScreen, gameButtons);

  const gameAudio = createElement('button', { class: 'btn btn--audio' });
  gameClose.addEventListener('click', () => console.log(game));
  renderElement(gameAudio, gameButtons);

  renderElement(gameButtons, section);

  const gameWrapper = createElement('div', { class: 'game-wrapper-content' });

  const gameTitle = createElement('h2', { class: 'game__title' }, `${gameLabels[game].title}`);
  renderElement(gameTitle, gameWrapper);

  const gameDescription = createElement('p', { class: 'game__description' }, `${gameLabels[game].description}`);
  renderElement(gameDescription, gameWrapper);

  const gameLevel = createElement('div', { class: 'game__game-level game-level' });

  const gameLevelLabel = createElement('p', { class: 'game-level__title' }, 'Pick a level:');
  renderElement(gameLevelLabel, gameLevel);

  const gameLevelList = createElement('ul', { class: 'game-level__list' });
  gameLevels.forEach((level) => {
    const levelItem = createElement('li', { class: 'game-level__item' }, `${level.levelName}`);
    levelItem.addEventListener('click', () => {
      appState.groupState.group = Number(level.levelGroup);
      appState.groupState.pageNumber = Number(level.page);
      buildGamePage(game, level.levelGroup, level.page);
    });
    renderElement(levelItem, gameLevelList);
  });

  renderElement(gameLevelList, gameLevel);
  renderElement(gameLevel, gameWrapper);

  const doggyWrapper = createElement('div', { class: 'game__doggy' });
  const doggyImage = createElement('img', {
    src: 'img/doggy.png',
    class: 'doggy',
    alt: 'Corgi offers to play',
  });
  renderElement(doggyImage, doggyWrapper);

  const doggySpeaks = createElement('span', { class: 'doggy__speaks' }, 'Let\'s play');
  renderElement(doggySpeaks, doggyWrapper);

  renderElement(doggyWrapper, gameWrapper);

  renderElement(gameWrapper, section);
  renderElement(section, result);

  return result;
}
