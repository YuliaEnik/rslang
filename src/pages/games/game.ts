import './game.scss';
import { getElement, createHTMLelement, createElement, renderElement } from '../../utils/utils';
import { sprint } from '../../components/sprint/sprintApp';
import { StateTextContentEn } from '../../utils/types';
import { fullscreen } from '../../components/full-screen/full-screen';

export const viewGame = (game: string, stateTextContentEn: StateTextContentEn):HTMLElement => {
  const parent = getElement('div');
  const gameSection = createHTMLelement('section', { id: 'game-section', class: 'game-section' }, parent);
  const gameWrapper = createHTMLelement('div', { class: 'game-wrapper' }, gameSection);
  const gameClose = createElement('a', { class: 'btn btn--close btn--game-close', href: '/dictionary/1?page=1' });
  renderElement(gameClose, gameWrapper);
  const fullScreen = createHTMLelement('div', { class: 'full-screen screen-open' }, gameWrapper);
  fullScreen.addEventListener('click', () => {
    fullscreen(gameSection, fullScreen);
  });
  const gameContent = createHTMLelement('div', { class: 'game-wrapper-content' }, gameWrapper);
  if (game === 'sprint') {
    sprint(gameContent, stateTextContentEn, gameWrapper);
  }
  if (game === 'audioChallenge') {
    alert(`Game ${game} is under contruction`);
  }

  return gameSection;
};
