import { appState, data } from '../../app';
import { getDictionaryPage } from '../../components/result/result';
import { getWords } from '../../utils/api';
import { router } from '../../utils/router';
import {
  createElement,
  createHTMLelement,
  random,
  renderElement,
} from '../../utils/utils';

interface GameLabels {
  [key: string]: {
    [key: string]: string;
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

const keyDescriptionTextSprint = [
  '"Arrow left" or "Arrow right" to answer',
];

const keyDescriptionTextAudio = [
  '1, 2, 3, 4, 5 to choose your answer',
  '"Enter" to show a correct answer',
  '"Arrow right" to get the next question',
  '"Space" to repeat the word',
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
  const gameClose = createElement(
    'a',
    {
      class: 'btn btn--close',
      title: 'close the game',
      href: '/dictionary/1?page=1',
      'data-navigo': '',
    },
  );
  renderElement(gameClose, gameButtons);

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

  const keyDescription = createHTMLelement('div', { class: 'key-description' }, gameWrapper);
  const keyDescriptionTitle = createHTMLelement('p', { class: 'key-description__title' }, keyDescription, 'Press:');
  if (game === 'sprint') {
    keyDescriptionTextSprint.forEach((element) => {
      const keyText = createHTMLelement('p', { class: 'key-description__item' }, keyDescription, element);
    });
  }
  if (game === 'audioChallenge') {
    keyDescriptionTextAudio.forEach((element) => {
      const keyText = createHTMLelement('p', { class: 'key-description__item' }, keyDescription, element);
    });
  }
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
