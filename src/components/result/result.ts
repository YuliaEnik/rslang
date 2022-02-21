import './result.scss';
import { StateSprint, Word, StateAudioG } from '../../utils/types';
import { stateSprint, API_ENDPOINT } from '../../utils/constants';
import { createHTMLelement, getElement } from '../../utils/utils';
import { router } from '../../utils/router';
import { appState } from '../../app';

function getGameAttemptNumber() {
  let attemptNumber = Number(router.current?.[0]?.params?.attempt) || 1;
  attemptNumber++;
  return attemptNumber;
}

function getGameRoute() {
  if (router.current?.[0]?.url) {
    const gameRoute = router.current[0].url;
    return gameRoute;
  }
  return '';
}

function getDictionaryPage() {
  const group = appState.groupState.group < 6 ? appState.groupState.group + 1 : 'difficult';
  const page = appState.groupState.group < 6 ? appState.groupState.pageNumber + 1 : '';
  const queryString = typeof page === 'number' ? `?page=${page}` : page;
  const result = `${group}${queryString}`;
  return result;
}

const createResult = (state:StateSprint | StateAudioG):HTMLElement => {
  const parent = getElement('.game-wrapper-content');
  const sprintWrapper = getElement('.sprint-wrapper') as HTMLElement;
  sprintWrapper?.remove();
  const audioWrapper = getElement('.audio-game-wrapper') as HTMLElement;
  audioWrapper?.remove();
  const resultWrapper = createHTMLelement('div', { class: 'result-wrapper' }, parent);
  const resultContent = createHTMLelement('div', { class: 'result-content' }, resultWrapper);
  const titleWrap = createHTMLelement('div', { class: 'result-title-wrap' }, resultContent);
  const resWords = createHTMLelement('div', { class: 'result-title res-words' }, titleWrap, 'words');
  const wordsWrap = createHTMLelement('div', { class: 'result-content res-words-wrap display-none' }, resultContent);
  state.questionsArray.forEach((el) => {
    const wrap = createHTMLelement('div', { class: 'result-horizontal-wrap' }, wordsWrap);
    const sound = createHTMLelement('div', { class: 'res-sound' }, wrap);
    const volume = new Audio();
    volume.src = `${API_ENDPOINT}/${el.audio}`;
    sound.addEventListener('click', () => {
      volume.play();
    });
    createHTMLelement('div', { class: 'result-cell' }, wrap, `${el.word}`);
    createHTMLelement('div', { class: 'result-cell' }, wrap, `${el.wordTranslate}`);
    if (el.correctAnswer === 0) {
      createHTMLelement('div', { class: 'res-false' }, wrap);
    } else {
      createHTMLelement('div', { class: 'res-true' }, wrap);
    }
  });
  const resultWrap = createHTMLelement('div', { class: 'result-content res-result-wrap' }, resultContent);
  // resultWrap.style.backgroundImage = `url(img/smile/${random(7)}.jpeg)`
  const dilogWrap = createHTMLelement('div', { class: 'dialog-wrap' }, resultWrap);
  createHTMLelement('div', { class: 'dialog-cell dialog-hello' }, dilogWrap, 'Nicely done! Keep up to speed!');
  if (state.score) {
    createHTMLelement('div', { class: 'dialog-cell dialog-score' }, dilogWrap,
      `Your score is ${state.score}!`);
  }
  createHTMLelement('div', { class: 'dialog-cell dialog-score' }, dilogWrap,
  // eslint-disable-next-line
  // @ts-ignore
    `You answered ${state.questionsArray.reduce((res, i) => res + i.correctAnswer, 0)} words correctly!`);
  createHTMLelement('div', { class: 'dialog-cell dialog-chees' }, dilogWrap, 'Cheers!');
  const butWrap = createHTMLelement('div', { class: 'result-horizontal-wrap' }, resultContent);
  const playAgainButton = createHTMLelement('button', { class: 'res-btn' }, butWrap, 'Play again');
  playAgainButton.addEventListener(
    'click',
    () => router.navigate(`/${getGameRoute()}?attempt=${getGameAttemptNumber()}`),
  );
  createHTMLelement(
    'a',
    {
      class: ' res-btn',
      href: `/dictionary/${getDictionaryPage()}`,
    },
    butWrap,
    'Go to Dictionary',
  );
  const resResult = createHTMLelement('div', { class: 'result-title res-result active' }, titleWrap, 'result');
  resWords.addEventListener('click', () => {
    wordsWrap.classList.remove('display-none');
    resultWrap.classList.add('display-none');
    resWords.classList.add('active');
    resResult.classList.remove('active');
  });
  resResult.addEventListener('click', () => {
    resultWrap.classList.remove('display-none');
    wordsWrap.classList.add('display-none');
    resResult.classList.add('active');
    resWords.classList.remove('active');
  });
  return resultWrapper;
};

const isEnd = (data:Word[]):boolean => {
  if (stateSprint.curIndex === data.length - 1) {
    return true;
  }
  return false;
};

export {
  createResult,
  isEnd,
};
