import { createElement, createEl, renderElement } from '../../utils/utils';
import './style.scss';

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
      // createEl('h4', {
      //   classes: 'title flex center',
      //   elementConfiguration: (h4) => {
      //     h4.innerHTML = 'For authorized user';
      //   },
      // }),
      createEl('div', {
        children: [
          createEl('div', {
            children: [
              createEl('p', {
                classes: 'title description-item-title',
                elementConfiguration: (p) => {
                  p.innerHTML = 'Read the dictionary';
                },
              }),
              createEl('img', {
                classes: 'description-img',
                elementConfiguration: (img) => {
                  img.src = 'https://cdn0.iconfinder.com/data/icons/tutor-icon-set/512/set_of_three_books-512.png';
                },
              }),
              createEl('div', {
                classes: 'description-title',
              }),
              createEl('p', {
                classes: 'description-info',
              }),
            ],
            classes: 'description-card description-item',
          }),
          createEl('div', {
            children: [
              createEl('p', {
                classes: 'title description-item-title',
                elementConfiguration: (p) => {
                  p.innerHTML = 'Play games with studying words';
                },
              }),
              createEl('img', {
                classes: 'description-img',
                elementConfiguration: (img) => {
                  img.src = 'https://ru.seaicons.com/wp-content/uploads/2015/10/Gamepad-icon.png';
                },
              }),
              createEl('div', {
                classes: 'description-title',
              }),
              createEl('p', {
                classes: 'description-info',
              }),
            ],
            classes: 'description-card description-item',
          }),
          createEl('div', {
            children: [
              createEl('p', {
                classes: 'title description-item-title',
                elementConfiguration: (p) => {
                  p.innerHTML = 'Note difficult words';
                },
              }),
              createEl('img', {
                classes: 'description-img',
                elementConfiguration: (img) => {
                  img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Circle-icons-pencil.svg/512px-Circle-icons-pencil.svg.png?20160314153754';
                },
              }),
              createEl('div', {
                classes: 'description-title',
              }),
              createEl('p', {
                classes: 'description-info',
              }),
            ],
            classes: 'description-card description-item',
          }),

          createEl('div', {
            children: [
              createEl('p', {
                classes: 'title description-item-title',
                elementConfiguration: (p) => {
                  p.innerHTML = 'Track your progress in statistics';
                },
              }),
              createEl('img', {
                classes: 'description-img',
                elementConfiguration: (img) => {
                  img.src = 'https://png2.cleanpng.com/sh/72949d22d6147cc66ddcee19415f6b54/L0KzQYm3VMI2N6hnj5H0aYP2gLBuTfNwdaF6jNd7LXnmf7B6TfRwf59xh9NtLXL4g7r1hgN0NaN0jdDtLXL4g7r1hgN0NZdxkdd7LUXkdYGAVcUxOZI8fao9LkO8QYeCWcQ3OWY3TKgAOUW2RoK3WMUveJ9s/kisspng-computer-icons-download-business-round-business-flyer-5ae075501a7e84.3916994615246595361085.png';
                },
              }),
              createEl('div', {
                classes: 'description-title',
              }),
              createEl('p', {
                classes: 'description-info',
              }),
            ],
            classes: 'description-card description-item',
          }),

        ],
        classes: 'description-container',
      })],
    classes: 'section about main-page-section',
  })];
};
