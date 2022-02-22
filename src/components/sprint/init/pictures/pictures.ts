import './pictures.scss';
import { createHTMLelement, getElement, random } from '../../../../utils/utils';

const createSmilePic = (parent:HTMLElement):HTMLElement => {
  const angryWrap = getElement('.angryWrap') as HTMLElement;
  if (angryWrap) {
    angryWrap.remove();
  }
  const elem = createHTMLelement('div', { class: 'answerPic' }, parent);
  elem.style.backgroundImage = `url(img/smile/${random(7)}.jpeg)`;
  return elem;
};

const createAngryPic = (parent:HTMLElement) => {
  parent.innerHTML = '';
  const elem = createHTMLelement('div', { class: 'angryWrap' }, parent);
  const angryWrap = createHTMLelement('div', { class: 'answerPic angryPic' }, elem);
  angryWrap.style.backgroundImage = `url(img/angry/${random(3)}.jpeg)`;
};

const removePic = (parent: HTMLElement) => {
  parent.innerHTML = '';
};

export {
  createSmilePic,
  removePic,
  createAngryPic,
};
