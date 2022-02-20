import './audio-game.scss';
import { data } from '../../app';
import { getElement, createHTMLelement, getElements } from '../../utils/utils';
import { createResult } from '../result/result';
import { keyboardKeysAudioGame, nextKeyboardBtn } from '../../utils/constants';
import {
  stateAudioG,
  setData,
  checkAnswer,
  removeClass,
  updateCurIndex,
  checkLengthData,
  isEnd,
  setCorrectData,
  toggleNextAnswBTN,
  disabledBTNS,
  unDisabledBTNS,
  createMessageCorgi,
} from './init/init';
import { router } from '../../utils/router';

const audioChallenge = (parent:HTMLElement): HTMLElement | null => {
  if (data.words.length === 0) {
    router.navigate('/audioChallenge');
    return null;
  }
  stateAudioG.questionsArray.length = 0;
  const BTNS:HTMLElement[] = [];
  const gameContent = createHTMLelement('div', { class: 'audio-game-wrapper' }, parent);
  parent.classList.add('game-wrapper-content-audio');
  const picsWrap = createHTMLelement('div', { class: 'horiz-wrap' }, gameContent);
  const volumePic = createHTMLelement('div', { class: 'audio-volume-wrap' }, picsWrap);
  const volume = new Audio();
  volumePic.addEventListener('click', () => {
    volume.play();
  });
  const corgi = createHTMLelement('div', { class: 'audio-corgi' }, picsWrap);
  const answWrap = createHTMLelement('div', { class: 'audio-answ-wrap' }, gameContent);
  const nextBTN = createHTMLelement('button', { class: 'next-answ-btn next-btn hidden' }, gameContent, 'Next');
  const unKnowBTN = createHTMLelement('button', { class: 'next-answ-btn unKnow-btn' }, gameContent, 'Answer');
  for (let i = 0; i < stateAudioG.maxAnsw; i++) {
    const answ = createHTMLelement('button', { class: 'audio-answ-btn' }, answWrap) as HTMLButtonElement;
    BTNS.push(answ);
    answ?.addEventListener('click', (el) => {
      disabledBTNS(BTNS);
      checkAnswer(el, data.words, BTNS);
      createMessageCorgi(data.words, corgi);
      toggleNextAnswBTN(nextBTN, unKnowBTN);
      setCorrectData(data.words, picsWrap);
    });
  }
  nextBTN.addEventListener('click', () => {
    toggleNextAnswBTN(nextBTN, unKnowBTN);
    removeClass(BTNS);
    (getElement('.audio-corgi_message') as HTMLElement)?.remove();
    (getElement('.correct-wrap') as HTMLElement)?.remove();
    updateCurIndex();
    unDisabledBTNS(BTNS);
    if (isEnd(data.words)) {
      stateAudioG.isEnded = true;
      createResult(stateAudioG);
    } setData(data.words, BTNS, volume);
  });
  unKnowBTN.addEventListener('click', (el) => {
    disabledBTNS(BTNS);
    setCorrectData(data.words, picsWrap);
    toggleNextAnswBTN(nextBTN, unKnowBTN);
    checkAnswer(el, data.words, BTNS);
  });

// keyboard handling
window.addEventListener("keydown", (event) => {
  if (stateAudioG.isEnded) return;
  let keyPressed = event.code;
  if (keyboardKeysAudioGame[keyPressed] || keyboardKeysAudioGame[keyPressed] === undefined) {
      return;
  }
  keyboardKeysAudioGame[keyPressed] = true;
});

window.addEventListener("keyup", (event) => {
  if (stateAudioG.isEnded) return;
  let keyPressed = event.code;
  if (keyboardKeysAudioGame[keyPressed]) {
    if (keyPressed === nextKeyboardBtn) {
      if (nextBTN.classList.contains('hidden')) return;
      nextBTN.click();
      return;
    };
    let answBtns = getElements('.audio-answ-btn');
    let ind = +keyPressed.slice(-1);
    ((answBtns[ind-1]) as HTMLButtonElement).click();
    keyboardKeysAudioGame[keyPressed] = false;
  }
});


  checkLengthData(data.words, corgi, answWrap, volume, nextBTN);
  setData(data.words, BTNS, volume);
  return gameContent;
};

export {
  audioChallenge,
};
