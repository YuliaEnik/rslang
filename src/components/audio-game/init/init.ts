import { Word } from '../../../utils/types';
import { playSound, right, wrong } from '../../../pages/games/sound/sound';
import {
  createRandomAnswerFalse,
  shuffle,
  createHTMLelement,
  getElement,
} from '../../../utils/utils';
import { API_ENDPOINT, stateAudioG } from '../../../utils/constants';
import { updateStatisticsFromGames } from '../../../utils/stat';
import { appState } from '../../../app';

const countIncorAnsws = 4;
// eslint-disable-next-line
// @ts-ignore
const setData = (data:Word[], btnAnsws:HTMLElement[], volume:audio):void => {
  volume.preload = 'auto';
  volume.src = `${API_ENDPOINT}/${data[stateAudioG.curIndex].audio}`;
  volume.play();
  stateAudioG.answsArray.length = 0;
  stateAudioG.answsArray.push(data[stateAudioG.curIndex].wordTranslate);
  for (let i = 0; i < countIncorAnsws; i++) {
    let value:string = data[createRandomAnswerFalse(data, stateAudioG.curIndex)].wordTranslate;
    if (stateAudioG.answsArray.includes(value)) {
      value = data[createRandomAnswerFalse(data, stateAudioG.curIndex)].wordTranslate;
    }
    stateAudioG.answsArray.push(value);
  }
  shuffle(stateAudioG.answsArray);
  btnAnsws.forEach((el, i) => {
    el.textContent = `${i + 1}. ${stateAudioG.answsArray[i]}`;
  });
};

const checkAnswer = (el:Event, data:Word[], BTNS:HTMLElement[]):void => {
  const rightAnswer = data[stateAudioG.curIndex].wordTranslate;
  const userAnswearText = (el.target as HTMLElement).textContent;
  const userAnswer = userAnswearText?.slice(3);
  // click answer btn
  if ((el.target as HTMLElement).classList.contains('unKnow-btn')) {
    data[stateAudioG.curIndex].correctAnswer = 0;
  }
  // correct answer
  if (userAnswer === rightAnswer) {
    data[stateAudioG.curIndex].correctAnswer = 1;
    (el.target as HTMLElement).classList.add('correct');
    playSound(right);
  } else {
  // incorrect answer
    data[stateAudioG.curIndex].correctAnswer = 0;
    playSound(wrong);
    (el.target as HTMLElement).classList.add('incorrect');
    BTNS.forEach((item) => {
      if ((item.textContent)?.slice(3) === rightAnswer) {
        item.classList.add('right');
      }
    });
  }
  stateAudioG.questionsArray.push(data[stateAudioG.curIndex]);

  if (appState.user) {
    if (data[stateAudioG.curIndex].correctAnswer === 0 || data[stateAudioG.curIndex].correctAnswer === 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (data[stateAudioG.curIndex]?._id) {
        // eslint-disable-next-line no-underscore-dangle
        const id = data[stateAudioG.curIndex]._id as string;
        data[stateAudioG.curIndex].id = id;
      }
      updateStatisticsFromGames(appState.user,
        // eslint-disable-next-line no-underscore-dangle
        data[stateAudioG.curIndex],
        'audioChallenge',
        (data[stateAudioG.curIndex].correctAnswer as number));
    }
  }
};

const updateCurIndex = ():void => {
  stateAudioG.curIndex += 1;
};

const setCorrectData = (data:Word[], parent:HTMLElement):HTMLElement => {
  const wrapPic = getElement('.correct-wrap') as HTMLElement;
  if (wrapPic) {
    wrapPic.remove();
  }
  const wrap = createHTMLelement('div', { class: 'correct-wrap' }, parent);
  const img = createHTMLelement('div', { class: 'correct-img' }, wrap);
  img.style.backgroundImage = `url(${API_ENDPOINT}/${data[stateAudioG.curIndex].image})`;
  createHTMLelement('div', { class: 'correct-word' }, wrap, data[stateAudioG.curIndex].word);
  return wrap;
};

const removeClass = (BTNS:HTMLElement[]):void => {
  BTNS.forEach((el) => {
    el.classList.remove('correct');
    el.classList.remove('incorrect');
    el.classList.remove('right');
  });
};

const isEnd = (data:Word[]):boolean => {
  if (stateAudioG.curIndex === data.length - 1) {
    return true;
  }
  return false;
};

const toggleNextAnswBTN = (nextBTN:HTMLElement, unKnowBTN:HTMLElement) => {
  nextBTN.classList.toggle('hidden');
  unKnowBTN.classList.toggle('hidden');
};

const createMessageCorgi = (data:Word[], corgiParent:HTMLElement) => {
  const message = getElement('.audio-corgi_message') as HTMLElement;
  if (message) {
    message.remove();
  }
  if (data[stateAudioG.curIndex].correctAnswer) {
    createHTMLelement('div', { class: 'audio-corgi_message' }, corgiParent, 'Correct!');
  } else {
    createHTMLelement('div', { class: 'audio-corgi_message' }, corgiParent, 'Incorrect!');
  }
};

const disabledBTNS = (BTNS:HTMLElement[]):void => {
  BTNS.forEach((el) => {
    el.setAttribute('disabled', 'true');
  });
};

const unDisabledBTNS = (BTNS:HTMLElement[]):void => {
  BTNS.forEach((el) => {
    el.removeAttribute('disabled');
  });
};

export {
  setData,
  checkAnswer,
  removeClass,
  updateCurIndex,
  isEnd,
  setCorrectData,
  toggleNextAnswBTN,
  disabledBTNS,
  unDisabledBTNS,
  createMessageCorgi,
};
