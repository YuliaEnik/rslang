import { Word, StateSprint } from '../../../../utils/types';
import { createHTMLelement } from '../../../../utils/utils';

const createOnePic = (parent: HTMLElement) => {
  const elem = createHTMLelement('div', { class: 'answerPic' }, parent);
  elem.style.backgroundImage = 'url(1.png)';
};

const removePic = (parent: HTMLElement) => {
  parent.innerHTML = '';
};

const createPics = (stateSprint: StateSprint, data:Word[], parentPic:HTMLElement) => {
  console.log(stateSprint.countCorrectAnsw);
  /* if (stateSprint.countCorrectAnsw === 3) {
    removePic(parentPic);
  } */
  if (data[stateSprint.curIndex].correctAnswer === 1) {
    createOnePic(parentPic);
  } if (data[stateSprint.curIndex].correctAnswer === 0) {
    removePic(parentPic);
  }
};

export {
  createPics,
};
