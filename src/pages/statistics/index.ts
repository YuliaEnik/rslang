import { createElement } from '../../utils/utils';

export const buildStatisticsPage = (): HTMLElement => {
  const result = createElement('h1', { class: '' });
  result.textContent = 'Statistics';
  return result;
};
