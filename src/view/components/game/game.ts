import './game.scss';
import { createElement, renderElement, getElement, getElements } from '../../../utils/utils';

export const viewGame = () => {
  const parent = getElement('.body');
  const gameSection = createElement('section', { id: 'game-section', class: 'game-section' });
  if (parent) {
    renderElement(gameSection, parent);
  }
  const gameWrapper = createElement('div', { class: 'game-wrapper' });
  renderElement(gameWrapper, gameSection);
  const gameContent = createElement('div', { class: 'game-wrapper-content' });
  renderElement(gameContent, gameWrapper);
  sprint(gameContent);
}

const sprint = (parent:Node): void => {
  const sprintWrapper = createElement('div', { class: 'sprint-wrapper' });
  renderElement(sprintWrapper, parent);
  const sprintContent = createElement('div', { class: 'sprint-content' });
  renderElement(sprintContent, sprintWrapper);
  const timer = createElement('div', { class: 'timer' });
  renderElement(timer, sprintContent);
  timer.textContent = 'timer';
  const wordEn = createWord('English word', sprintContent);
  const wordRu = createWord('Russian word', sprintContent);
  const btnContainer = createElement('div', { class: 'btn-container' });
  renderElement(btnContainer, sprintContent);
  const btnTrue = createBtn( btnContainer, { class: 'button true'}, 'true');
  const btnFalse = createBtn( btnContainer, { class: 'button false'}, 'false');
}

const createWord = (text: string, parent:Node): void => {
  const word = createElement('div', { class: 'word' });
  renderElement(word, parent);
  word.textContent = text;
}

const createBtn = ( parent:Node, attrs: { [key: string]: string }, text: string,): void => {
  const btn = createElement('div', attrs);
  renderElement(btn, parent);
  btn.textContent = text;
}
