import { createElement, createEl, renderElement } from '../../utils/utils';

export const buildMainPage = () => {
  const result = createElement('section', { class: 'main-page main-page-section' });
  const header = createElement('header', { class: 'main__header' });
  const btnSingIn = createElement('a', { class: 'btn btn--sign', 'data-navigo': '', href: '/login' });
  const btnSingInText = createElement('span', { class: 'btn__text' }, 'Sign in');
  renderElement(btnSingInText, btnSingIn);
  renderElement(btnSingIn, header);
  renderElement(header, result);
  const slideGreeting = createElement('section', { class: 'section greeting' });
  const slideGreetingTitle = createElement('h2', {
    class: 'section__title--main section__title',
  }, 'Start your learning journey today!');
  renderElement(slideGreetingTitle, slideGreeting);
  renderElement(slideGreetingTitle, slideGreeting);
  renderElement(slideGreeting, result);

  return [result, createEl('section', {
    children: [
      createEl('h2', {
        classes: 'section__title--main section__title',
        elementConfiguration: (h2) => {
          h2.innerText = 'How it works';
        },
      }),
    ],
    classes: 'section about main-page-section',
  })];
};
