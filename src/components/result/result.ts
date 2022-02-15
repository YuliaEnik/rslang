import './result.scss';
import { StateSprint } from '../../utils/types';
import { createHTMLelement, getElement } from '../../utils/utils';

export const createResult = (state:StateSprint):HTMLElement => {
  const parent = getElement('.game-wrapper-content');
  const sprintWrapper = getElement('.sprint-wrapper') as HTMLElement;
  sprintWrapper?.remove();
  const resultWrapper = createHTMLelement('div', { class: 'result-wrapper' }, parent);
  const resultContent = createHTMLelement('div', { class: 'result-content' }, resultWrapper);
  const titleWrap = createHTMLelement('div', { class: 'result-title-wrap' }, resultContent);
  const resWords = createHTMLelement('div', { class: 'result-title res-words' }, titleWrap, 'words');
  const wordsWrap = createHTMLelement('div', { class: 'result-content res-words-wrap display-none' }, resultContent);
  state.questionsArray.forEach((el) => {
    const wrap = createHTMLelement('div', { class: 'result-horizontal-wrap' }, wordsWrap);
    createHTMLelement('div', { class: 'res-sound' }, wrap);
    createHTMLelement('div', { class: 'result-cell' }, wrap, `${el.word}`);
    createHTMLelement('div', { class: 'result-cell' }, wrap, `${el.wordTranslate}`);
    if (el.correctAnswer === 0) {
      createHTMLelement('div', { class: 'res-false' }, wrap);
    } else {
      createHTMLelement('div', { class: 'res-true' }, wrap);
    }
  });
  const resultWrap = createHTMLelement('div', { class: 'result-content res-result-wrap' }, resultContent);
  const dilogWrap = createHTMLelement('div', { class: 'dialog-wrap' }, resultWrap);
  const dilogHello = createHTMLelement('div', { class: 'dialog-cell dialog-hello' }, dilogWrap, 'Nicely done! Keep up to speed!');
  const dilogScore = createHTMLelement('div', { class: 'dialog-cell dialog-score' }, dilogWrap, `Your score is ${state.score}!`);
  const dilogChees = createHTMLelement('div', { class: 'dialog-cell dialog-chees' }, dilogWrap, 'Cheers!');
  const butWrap = createHTMLelement('div', { class: 'result-horizontal-wrap' }, resultContent);
  const btnRestart = createHTMLelement('div', { class: 'res-btn' }, butWrap, 'Play again');
  const bntExit = createHTMLelement('div', { class: ' res-btn' }, butWrap, 'Go to Dictionary');
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
