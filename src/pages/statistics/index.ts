import { createElement } from '../../utils/utils';

export const buildStatisticsPage = (): HTMLElement => {
  const result = createElement('h1');
  result.textContent = 'Statistics';
  return result;
};
