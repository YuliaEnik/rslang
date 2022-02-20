import './sprint.scss';
import { createHTMLelement, getElement } from '../../utils/utils';
import { StateTextContentEn } from '../../utils/types';
import {
  checkAnswer,
  updateCurIndex,
  setWords,
} from './init/init';
import { createResult, isEnd } from '../result/result';
import { stateSprint, keyboardKeysSprintGame, navigationKeys, nextKeyboardBtn } from '../../utils/constants';
import { countdown, timer } from './init/timer/timer';
import { data } from '../../app';
import { router } from '../../utils/router';

export const sprint = async (
  parent:HTMLElement,
  stateTextContentEn:StateTextContentEn,
  busParent: HTMLElement,
): Promise<HTMLElement | null> => {
  if (data.words.length === 0) {
    router.navigate('/sprint');
    return null;
  }
  clearTimeout(timer);
  stateSprint.game_time = 60;
  stateSprint.questionsArray.length = 0;
  const arrayBtnEl:HTMLElement[] = [];
  busParent.classList.add('bus');
  const sprintWrapper = createHTMLelement('div', { class: 'sprint-wrapper' }, parent);
  const soundBtn = createHTMLelement('div', { class: 'sound sound-on' }, parent);
  const sprintContent = createHTMLelement('div', { class: 'sprint-content' }, sprintWrapper);
  const timerScoreWrap = createHTMLelement('div', { class: 'horizontal-wrap' }, sprintContent);
  const timerWrap = createHTMLelement('div', { class: 'timer' }, timerScoreWrap);
  const scoreWrap = createHTMLelement('div', { class: 'score' }, timerScoreWrap, `${stateSprint.score}`);
  const answerPicturesWrap = createHTMLelement('div', { class: 'answ-pic-wrap' }, sprintContent);
  const wordWrapEn = createHTMLelement('h2', { class: 'sprintWordEn' }, sprintContent);
  const wordWrapRu = createHTMLelement('h2', { class: 'sprintWordRu' }, sprintContent);
  const btnContainer = createHTMLelement('div', { class: 'btn-wrap' }, sprintContent);
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
      checkAnswer(data.words, el, scoreWrap, answerPicturesWrap);
      if (isEnd(data.words)) {
        stateSprint.isEnded = true;
        createResult(stateSprint);
        clearTimeout(timer);
        busParent.style.animationPlayState = 'paused';
        return;
      }
      updateCurIndex();
      setWords(data.words, wordWrapEn, wordWrapRu);
    });
  });

  // keyboard handling
  window.addEventListener("keydown", (event) => {
    let keyPressed = event.code;
    if (keyboardKeysSprintGame[keyPressed] || keyboardKeysSprintGame[keyPressed] === undefined) {
        return;
    }
    keyboardKeysSprintGame[keyPressed] = true;
  });

  window.addEventListener("keyup", (event) => {
    if (stateSprint.isEnded) return;
    let keyPressed = event.code;
    if (keyboardKeysSprintGame[keyPressed]) {

      const selector: string = navigationKeys[keyPressed] ?

        `[data-answ = '${String(stateSprint.trueAnsw)}']` :

        `[data-answ = '${String(stateSprint.falseAnsw)}']`
      const btnPressed = (getElement(selector)) as HTMLElement;
      checkAnswer(data.words, btnPressed, scoreWrap, answerPicturesWrap);
      if (isEnd(data.words)) {
        stateSprint.isEnded = true;
        createResult(stateSprint);
        clearTimeout(timer);
        busParent.style.animationPlayState = 'paused';
        return;
      }
      updateCurIndex();
      setWords(data.words, wordWrapEn, wordWrapRu);
      keyboardKeysSprintGame[keyPressed] = false;
    }
  });
  setWords(data.words, wordWrapEn, wordWrapRu);
  countdown(timerWrap);
  return sprintWrapper;
};
