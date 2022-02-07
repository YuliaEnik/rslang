import { buildLogo } from '../../components/nav';
import { createElement, renderElement } from '../../utils/utils';

const inputs = [
  {
    type: 'text',
    id: 'name',
  },
  {
    type: 'email',
    id: 'email',
  },
  {
    type: 'password',
    id: 'password',
  },
];

const bubbles = [
  {
    text: 'I am happy you decided to join!',
  },
  {
    text: 'Good luck!',
  },
];

export const buildSignUpPage = (): HTMLElement => {
  const result = createElement('section', { class: 'signup' });
  const containerLeft = createElement('section', { class: 'container--left' });
  const header = createElement('header', { class: 'signup__header' });
  renderElement(buildLogo(), header);
  renderElement(header, containerLeft);
  const formContainer = createElement('div', { class: 'form-container' });
  const title = createElement('h1', { class: 'signup__title' }, 'Sign Up');
  renderElement(title, formContainer);
  const form = createElement('form', { class: 'form form--signup' });
  inputs.forEach((input) => {
    const inputContainer = createElement('div', { class: 'input-container' });
    const label = createElement('label', { class: `label-form label-form--${input.id}`, for: input.id }, input.id);
    const inputEl = createElement(
      'input',
      { class: `input-form input-form--${input.id}`, id: input.id, type: input.type },
    );
    renderElement(label, inputContainer);
    renderElement(inputEl, inputContainer);
    renderElement(inputContainer, form);
  });
  const button = createElement('button', { class: 'btn btn--signup' }, 'Create account');
  renderElement(button, form);
  renderElement(form, formContainer);
  renderElement(formContainer, containerLeft);
  renderElement(containerLeft, result);
  const poster = createElement('div', { class: 'signup__poster' });
  bubbles.forEach((bubble) => {
    const text = createElement('p', { class: 'speech-bubble' }, bubble.text);
    renderElement(text, poster);
  });

  const image = createElement('img', {
    src: 'img/poster.png',
    class: 'signup__img',
    alt: 'Elizabeth says hello to you',
  });
  renderElement(image, poster);
  renderElement(poster, result);
  return result;
};
