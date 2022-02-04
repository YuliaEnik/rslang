import { createElement } from '../../utils/utils';

export const buildSprintPage = (): HTMLElement => {
  const result = createElement('h1');
  result.textContent = 'Game Sprint';
  return result;
};
