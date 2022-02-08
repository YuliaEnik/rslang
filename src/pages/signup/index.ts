import { buildLogo } from '../../components/nav';
import { Input } from '../../utils/types';
import { createElement, renderElement } from '../../utils/utils';
import { createUser } from '../registration';

const inputs: Input[] = [
  {
    type: 'text',
    id: 'nameSignup',
    class: 'name',
  },
  {
    type: 'email',
    id: 'emailSignup',
    class: 'email',
  },
  {
    type: 'password',
    id: 'passwordSignup',
    class: 'name',
  },
];

const signUpText = [
  {
    text: 'I am happy you decided to join!',
  },
  {
    text: 'Good luck!',
  },
];

function makeUserObj(name: string, email: string, password: string) {
  const result = {
    name,
    email,
    password,
  };
  return result;
}

function submitForm(this: HTMLFormElement, event: Event) {
  event.preventDefault();
  const user: string[] = [];
  [...this.elements].forEach((element) => {
    if (element.nodeName === 'INPUT') {
      user.push((element as HTMLInputElement).value);
    }
  });
  createUser(makeUserObj(user[0], user[1], user[2]));
}

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
  form.addEventListener('submit', submitForm);
  inputs.forEach((input) => {
    const inputContainer = createElement('div', { class: 'input-container' });
    const label = createElement('label', { class: `label-form label-form--${input.class}`, for: input.id }, input.id);
    const inputEl = createElement(
      'input', {
        class: `input-form input-form--${input.class}`, id: input.id, type: input.type, name: input.id,
      },
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
  signUpText.forEach((bubble) => {
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
