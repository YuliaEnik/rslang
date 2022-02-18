import { UsageState } from 'webpack';
import { UserCalculatedStat, UserStatisticsResponse } from '../../utils/types';
import { createElement, renderElement } from '../../utils/utils';

interface Games {
  [key: string]: string;
}

const games: Games[] = [
  {
    type: 'sprint',
    title: 'Sprint',
  },
  {
    type: 'audioChallenge',
    title: 'Audio Challenge',
  },
];

export function calculateStat(input: UserStatisticsResponse | null) {
  const userStatistics = input || {} as UserStatisticsResponse;

  const learnedWords = userStatistics.learnedWords ? `${userStatistics.learnedWords}` : '0';

  const sprintNewWords = userStatistics.optional?.games?.sprint?.newWordsGame || 0;
  const audioChallengeNewWords = userStatistics.optional?.games?.audioChallenge?.newWordsGame || 0;

  const newWords = `${sprintNewWords + audioChallengeNewWords}`;

  const sprintCorrectAnswers = userStatistics.optional?.games?.sprint?.correct || 0;
  const sprintWrongAnswers = userStatistics.optional?.games?.sprint?.wrong || 0;
  const sprintProcent = sprintCorrectAnswers
    ? `${Math.ceil((sprintCorrectAnswers / (sprintCorrectAnswers + sprintWrongAnswers)) * 100)}%` : '0%';

  const sprintStreak = userStatistics.optional?.games?.sprint?.bestStreak
    ? `${userStatistics.optional.games.sprint.bestStreak}` : '0';

  const audioChallengeCorrectAnswers = userStatistics.optional?.games?.audioChallenge?.correct || 0;
  const audioChallengeWrongAnswers = userStatistics.optional?.games?.audioChallenge?.wrong || 0;
  const audioChallengeProcent = audioChallengeCorrectAnswers
    ? `${Math.ceil((audioChallengeCorrectAnswers / (audioChallengeCorrectAnswers + audioChallengeWrongAnswers)) * 100)}%` : '0%';

  const audioChallengeStreak = userStatistics.optional?.games?.audioChallenge?.bestStreak
    ? `${userStatistics.optional.games.audioChallenge.bestStreak}` : '0';

  const correctAnswers = sprintCorrectAnswers + audioChallengeCorrectAnswers;
  const wrongAnswers = sprintWrongAnswers + audioChallengeWrongAnswers;
  const procent = correctAnswers
    ? `${Math.ceil((correctAnswers / (correctAnswers + wrongAnswers)) * 100)}%` : '0%';

  const result: UserCalculatedStat = {
    newWords,
    procent,
    learnedWords,
    newWordsGame: [
      sprintNewWords,
      audioChallengeNewWords,
    ],
    streak: [
      sprintStreak,
      audioChallengeStreak,
    ],
    procentGames: [
      sprintProcent,
      audioChallengeProcent,
    ],
  };
  return result;
}

export const buildStatisticsPage = (stat: UserCalculatedStat): HTMLElement => {
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
    src: 'svg/new-words.svg',
    class: '',
  });
  renderElement(newWordsImg, newWordsImgContainer);
  renderElement(newWordsImgContainer, newWordsItem);
  const newsWordQuantity = createElement('span', { class: 'statistics__item-quantity' }, `${stat.newWords}`);
  renderElement(newsWordQuantity, newWordsItem);
  const newsWordDesc = createElement('span', { class: 'statistics__item-desc' }, 'New words');
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
  const correctQuantity = createElement('span', { class: 'statistics__item-quantity' }, `${stat.procent}`);
  renderElement(correctQuantity, correctItem);
  const correctDesc = createElement('span', { class: 'statistics__item-desc' }, 'Correct answers');
  renderElement(correctDesc, correctItem);
  renderElement(correctItem, statOverallList);

  const learnedItem = createElement('li', { class: 'statistics__item statistics__item--learned' });
  const learnedImgContainer = createElement('div', { class: 'statistics__item-image' });
  const learnedImg = createElement('img', {
    src: 'svg/is-learned.svg',
    class: '',
  });
  renderElement(learnedImg, learnedImgContainer);
  renderElement(learnedImgContainer, learnedItem);
  const learnedQuantity = createElement('span', { class: 'statistics__item-quantity' }, `${stat.learnedWords}`);
  renderElement(learnedQuantity, learnedItem);
  const LearnedDesc = createElement('span', { class: 'statistics__item-desc' }, 'Words are learned');
  renderElement(LearnedDesc, learnedItem);
  renderElement(learnedItem, statOverallList);

  renderElement(statOverallList, result);

  const statGamesList = createElement('ul', { class: 'statistics__list statistics__list--games' });
  games.forEach((game, index) => {
    const gameItem = createElement('li', { class: 'statistics__item statistics__item--game', 'data-game': game.type });
    const gameTitle = createElement('p', { class: 'statistics__item-title' }, game.title);
    renderElement(gameTitle, gameItem);

    const statList = createElement('ul', { class: 'statistics__item-list' });
    const statItemQty = createElement('li', { class: 'statistics__item-item' });
    statItemQty.append('Learned ');
    const statItemQtyAmount = createElement('span', { class: 'statistics__item--qty' }, `${stat.newWordsGame[index]}`);
    statItemQty.append(statItemQtyAmount);
    statItemQty.append(' words');
    renderElement(statItemQty, statList);

    const statItemPercent = createElement('li', { class: 'statistics__item-item' });
    statItemPercent.append('Correct answers: ');
    const statItemPercentAmount = createElement(
      'span',
      { class: 'statistics__item--percent' },
      `${stat.procentGames[index]}`,
    );
    statItemPercent.append(statItemPercentAmount);
    renderElement(statItemPercent, statList);

    const statItemstreak = createElement('li', { class: 'statistics__item-item' });
    statItemstreak.append('Streak of correct answers: ');
    const statItemstreakAmount = createElement(
      'span',
      { class: 'statistics__item--streak' },
      `${stat.streak[index]}`,
    );
    statItemstreak.append(statItemstreakAmount);
    renderElement(statItemstreak, statList);

    renderElement(statList, gameItem);
    renderElement(gameItem, statGamesList);
  });

  renderElement(statGamesList, result);

  return result;
};
