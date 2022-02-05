import { createElement, renderElement } from '../../utils/utils';
import './style.scss';

export const buildFooter = (): HTMLElement => {
  const result = createElement('footer');
  result.className = 'footer';
  const footerText = createElement('p');
  footerText.className = 'footer__text';
  footerText.innerText = 'Rolling Scopes School, 2022';
  renderElement(footerText, result);
  return result;
};
