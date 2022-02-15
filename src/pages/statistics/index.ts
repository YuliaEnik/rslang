import { createElement, renderElement } from '../../utils/utils';

const games = [
  {
    type: 'sprint',
    title: 'Sprint',
  },
  {
    type: 'audio',
    title: 'Audio Challenge',
  },
];

export const buildStatisticsPage = (): HTMLElement => {
  const result = createElement('section', { class: 'section statistics' });
  const sectionTitle = createElement('h2', { class: 'section__title' }, 'Statistics');
  renderElement(sectionTitle, result);

  const statSwitchList = createElement('ul', { class: 'periods__list' });
  const statDailyButton = createElement('li', { class: 'period__item active' }, 'Daily');
  statDailyButton.addEventListener('click', () => console.log('click'));
  const statEntireButton = createElement('li', { class: 'period__item' }, 'Entire');
  statEntireButton.addEventListener('click', () => console.log('click'));
  renderElement(statDailyButton, statSwitchList);
  renderElement(statEntireButton, statSwitchList);
  renderElement(statSwitchList, result);

  const statOverallList = createElement('ul', { class: 'statistics__list statistics__list--overall' });

  const newWordsItem = createElement('li', { class: 'statistics__item statistics__item--new-words' });
  const newWordsImgContainer = createElement('div', { class: 'statistics__item-image' });
  const newWordsImg = createElement('img', {
    src: 'svg/is-learned.svg',
    class: '',
  });
  renderElement(newWordsImg, newWordsImgContainer);
  renderElement(newWordsImgContainer, newWordsItem);
  const newsWordQuantity = createElement('span', { class: 'statistics__item-quantity' }, '178');
  renderElement(newsWordQuantity, newWordsItem);
  const newsWordDesc = createElement('span', { class: 'statistics__item-desc' }, 'Learned new words');
  renderElement(newsWordDesc, newWordsItem);
  renderElement(newWordsItem, statOverallList);

  const correctItem = createElement('li', { class: 'statistics__item statistics__item--correct' });
  const correctImgContainer = createElement('div', { class: 'statistics__item-image' });
  const correctImg = createElement('img', {
    src: 'svg/stat-correct.svg',
    class: '',
  });
  renderElement(correctImg, correctImgContainer);
  renderElement(correctImgContainer, correctItem);
  const correctQuantity = createElement('span', { class: 'statistics__item-quantity' }, '78%');
  renderElement(correctQuantity, correctItem);
  const correctDesc = createElement('span', { class: 'statistics__item-desc' }, 'Correct answers');
  renderElement(correctDesc, correctItem);
  renderElement(correctItem, statOverallList);

  const learnedItem = createElement('li', { class: 'statistics__item statistics__item--learned' });
  const learnedImgContainer = createElement('div', { class: 'statistics__item-image' });
  const learnedImg = createElement('img', {
    src: 'svg/stat-correct.svg',
    class: '',
  });
  renderElement(learnedImg, learnedImgContainer);
  renderElement(learnedImgContainer, learnedItem);
  const learnedQuantity = createElement('span', { class: 'statistics__item-quantity' }, '78%');
  renderElement(learnedQuantity, learnedItem);
  const LearnedDesc = createElement('span', { class: 'statistics__item-desc' }, 'Correct answers');
  renderElement(LearnedDesc, learnedItem);
  renderElement(learnedItem, statOverallList);

  renderElement(statOverallList, result);

  const statGamesList = createElement('ul', { class: 'statistics__list statistics__list--games' });
  games.forEach((game) => {
    const gameItem = createElement('li', { class: 'statistics__item statistics__item--game', 'data-game': game.type });
    const gameTitle = createElement('p', { class: 'statistics__item-title' }, game.title);
    renderElement(gameTitle, gameItem);

    const statList = createElement('ul', { class: 'statistics__item-list' });
    const statItemQty = createElement('li', { class: 'statistics__item-item' });
    statItemQty.append('Learned ');
    const statItemQtyAmount = createElement('span', { class: 'statistics__item--qty' }, '140');
    statItemQty.append(statItemQtyAmount);
    statItemQty.append(' words');
    renderElement(statItemQty, statList);

    const statItemPercent = createElement('li', { class: 'statistics__item-item' });
    statItemPercent.append('Correct answers: ');
    const statItemPercentAmount = createElement('span', { class: 'statistics__item--percent' }, '40');
    statItemPercent.append(statItemPercentAmount);
    statItemPercent.append(' %');
    renderElement(statItemPercent, statList);

    const statItemstreak = createElement('li', { class: 'statistics__item-item' });
    statItemstreak.append('Streak of correct answers: ');
    const statItemstreakAmount = createElement('span', { class: 'statistics__item--percent' }, '4');
    statItemstreak.append(statItemstreakAmount);
    statItemstreak.append('.');
    renderElement(statItemstreak, statList);

    renderElement(statList, gameItem);
    renderElement(gameItem, statGamesList);
  });

  renderElement(statGamesList, result);

  return result;
};
