import './audio-game.scss';
import { data } from '../../app';
import { fullscreen } from '../../components/full-screen/full-screen';
import { getElement, createHTMLelement } from '../../utils/utils';
import { createResult } from '../../components/result/result';
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

const audioChalange = ():HTMLElement => {
  stateAudioG.questionsArray.length = 0;
  const BTNS:HTMLElement[] = [];
  const parent = getElement('div');
  const gameSection = createHTMLelement('section', { id: 'game-section', class: 'game-section' }, parent);
  const gameWrapper = createHTMLelement('div', { class: 'game-wrapper-content' }, gameSection);
  const fullScreen = createHTMLelement('div', { class: 'full-screen screen-open' }, gameWrapper);
  fullScreen.addEventListener('click', () => {
    fullscreen(gameSection, fullScreen);
  });
  const gameContent = createHTMLelement('div', { class: 'audio-game-wrapper' }, gameWrapper);
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
  return gameSection;
};

export {
  audioChalange,
};
