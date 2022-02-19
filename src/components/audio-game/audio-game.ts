import './audio-game.scss';
import { data } from '../../app';
import { getElement, createHTMLelement } from '../../utils/utils';
import { createResult } from '../result/result';
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

  if (data.words.length === 1) {
    alert('You cannot play with only 1 word');
    router.reload();
    return null;
  }

  stateAudioG.curIndex = 0;
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
      createResult(stateAudioG);
    } setData(data.words, BTNS, volume);
  });
  unKnowBTN.addEventListener('click', (el) => {
    disabledBTNS(BTNS);
    setCorrectData(data.words, picsWrap);
    toggleNextAnswBTN(nextBTN, unKnowBTN);
    checkAnswer(el, data.words, BTNS);
  });

  checkLengthData(data.words, corgi, answWrap, volume, nextBTN);
  setData(data.words, BTNS, volume);
  return gameContent;
};

export {
  audioChallenge,
};
