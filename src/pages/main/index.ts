import { createElement, renderElement } from '../../utils/utils';

export const buildMainPage = (): HTMLElement => {
  const result = createElement('section', { class: 'main-page' });
  const mainTitle = createElement('h1', { class: 'visually-hidden' }, 'Learn English with RS Lang application');
  renderElement(mainTitle, result);
  const header = createElement('header', { class: 'main__header' });
  const btnSingIn = createElement('a', { class: 'btn btn--sign', 'data-navigo': '', href: '/signup' });
  const btnSingInText = createElement('span', { class: 'btn__text' }, 'Sign in');
  renderElement(btnSingInText, btnSingIn);
  renderElement(btnSingIn, header);
  renderElement(header, result);
  const slideGreeting = createElement('section', { class: 'section greeting' });
  const slideGreetingTitle = createElement('h2', { class: 'section__title' }, 'Start your learning journey today!');
  renderElement(slideGreetingTitle, slideGreeting);
  renderElement(slideGreetingTitle, slideGreeting);
  renderElement(slideGreeting, result);
  return result;
};
