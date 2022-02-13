import './sprint.scss';
import { createHTMLelement } from '../../utils/utils';
import { Word, StateTextContentEn } from '../../utils/types';
import {
  checkAnswer,
  updateCurIndex,
  setWords,
  checkEnd,
  addBusAnimation,
} from './init/init';
import { stateSprint } from '../../utils/constants';
import { createPics } from './init/pictures/pictures';
import { countdown } from './init/timer/timer';
import { getWords } from '../../utils/api';
import { data } from '../../app';

export const sprint = async (
  parent:HTMLElement,
  stateTextContentEn:StateTextContentEn,
  busParent: HTMLElement,
): Promise<HTMLElement> => {
  const arrayBtnEl:HTMLElement[] = [];
  busParent.classList.add('bus');
  const sprintWrapper = createHTMLelement('div', { class: 'sprint-wrapper' }, parent);
  const sprintContent = createHTMLelement('div', { class: 'sprint-content' }, sprintWrapper);
  const timerScoreWrap = createHTMLelement('div', { class: 'horizontal-wrap' }, sprintContent);
  const timer = createHTMLelement('div', { class: 'timer' }, timerScoreWrap);
  // const clock = createHTMLelement('div', { class: 'clock' }, timer);
  const scoreWrap = createHTMLelement('div', { class: 'score' }, timerScoreWrap, `${stateSprint.score}`);
  const answerPicturesWrap = createHTMLelement('div', { class: 'answ-pic-wrap' }, sprintContent);
  const wordWrapEn = createHTMLelement('div', { class: 'sprintWordEn' }, sprintContent);
  const wordWrapRu = createHTMLelement('div', { class: 'sprintWordRu' }, sprintContent);
  const btnContainer = createHTMLelement('div', { class: 'horizontal-wrap' }, sprintContent);
  const btnTrue = createHTMLelement('button',
    { class: 'button button_true', 'data-answ': String(stateSprint.trueAnsw) },
    btnContainer, stateTextContentEn.btnTrue);
  arrayBtnEl.push(btnTrue);
  const btnFalse = createHTMLelement('button',
    { class: 'button button_false', 'data-answ': String(stateSprint.falseAnsw) },
    btnContainer, stateTextContentEn.btnFalse);
  arrayBtnEl.push(btnFalse);
  arrayBtnEl.forEach((el) => {
    el.addEventListener(('click'), () => {
      checkAnswer(data.words, el, scoreWrap);
      createPics(stateSprint, data.words, answerPicturesWrap);
      updateCurIndex();
      setWords(data.words, wordWrapEn, wordWrapRu);
    });
  });
  setWords(data.words, wordWrapEn, wordWrapRu);
  checkEnd();
  countdown(timer);
  addBusAnimation(busParent);
  return sprintWrapper;
};
