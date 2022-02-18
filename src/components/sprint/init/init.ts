import { Word } from '../../../utils/types';
import { createRandomAnswerFalse } from '../../../utils/utils';
import { stateSprint } from '../../../utils/constants';
import { createSmilePic, removePic, createAngryPic } from './pictures/pictures';

const createScore = (scoreWrap:HTMLElement) => {
  scoreWrap.textContent = '';
  stateSprint.score += stateSprint.points;
  scoreWrap.textContent = `${stateSprint.score}`;
};

const checkAnswer = (data: Word[], btn: HTMLElement, scoreWrap: HTMLElement, parentPic:HTMLElement):void => {
  const btnAnsw = Number(btn.dataset.answ);
  // correct Answer
  if (btnAnsw === stateSprint.isTrueTranslate) {
    data[stateSprint.curIndex].correctAnswer = 1;
    createScore(scoreWrap);
    createSmilePic(parentPic);
    stateSprint.countCorrectAnsw++;
    if (stateSprint.countCorrectAnsw === 4) {
      removePic(parentPic);
      stateSprint.points *= 2;
      stateSprint.countCorrectAnsw = 0;
    }
  } else {
    // incorrect
    data[stateSprint.curIndex].correctAnswer = 0;
    createAngryPic(parentPic);
    stateSprint.countCorrectAnsw = 0;
    stateSprint.points = 10;
  }
  stateSprint.questionsArray.push(data[stateSprint.curIndex]);
};

const updateCurIndex = ():void => {
  stateSprint.curIndex += 1;
};

const isTrueTranslate = ():number => Math.floor(Math.random() * 2);

const setWordRu = (data: Word[], wordRu: HTMLElement, currentIndex:number):void => {
  stateSprint.isTrueTranslate = isTrueTranslate();
  if (stateSprint.isTrueTranslate === stateSprint.falseAnsw) {
    wordRu.textContent = data[createRandomAnswerFalse(data, stateSprint.curIndex)].wordTranslate;
  } else {
    wordRu.textContent = data[currentIndex].wordTranslate;
  }
};

const setWordEn = (data: Word[], wordEn: HTMLElement) => {
  wordEn.textContent = '';
  wordEn.textContent = data[stateSprint.curIndex].word;
};

const setWords = (data: Word[], wordEn: HTMLElement, wordRu:HTMLElement) => {
  setWordEn(data, wordEn);
  setWordRu(data, wordRu, stateSprint.curIndex);
};

export {
  checkAnswer,
  updateCurIndex,
  setWords,
};
