import './game.scss';
import { getElement, createHTMLelement } from '../../utils/utils';
import { sprint } from '../../components/sprint/sprintApp';
import { StateTextContentEn } from '../../utils/types';
import { fullscreen } from '../../components/full-screen/full-screen';

export const viewGame = (stateTextContentEn: StateTextContentEn):HTMLElement => {
  const parent = getElement('div');
  const gameSection = createHTMLelement('section', { id: 'game-section', class: 'game-section' }, parent);
  const gameWrapper = createHTMLelement('div', { class: 'game-wrapper' }, gameSection);
  const fullScreen = createHTMLelement('div', { class: 'full-screen screen-open' }, gameWrapper);
  fullScreen.addEventListener('click', () => {
    fullscreen(gameSection, fullScreen);
  });
  const sound = createHTMLelement('div', { class: 'sound sound-on' }, gameWrapper);
  const gameContent = createHTMLelement('div', { class: 'game-wrapper-content' }, gameWrapper);
  sprint(gameContent, stateTextContentEn, gameWrapper);
  return gameSection;
};
