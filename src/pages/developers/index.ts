import { createElement } from '../../utils/utils';

export const buildDevelopersPage = (): HTMLElement => {
  const result = createElement('h1');
  result.textContent = 'Developers';
  return result;
};
