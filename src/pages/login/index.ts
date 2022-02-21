import { buildLogo } from '../../components/nav';
import { Input } from '../../utils/types';
import { createElement, renderElement } from '../../utils/utils';
import { logInUser } from '../../services/auth/login';
import { appStateUi } from '../../app';

const inputs: Input[] = [
  {
    type: 'email',
    id: 'emailSignup',
    class: 'email',
    label: 'Email',
  },
  {
    type: 'password',
    id: 'passwordSignup',
    class: 'password',
    label: 'Password',
  },
];

const logInText = [
  {
    text: 'Welcome back!',
  },
  {
    text: 'Good luck!',
  },
];

function makeUserObj(email: string, password: string) {
  const result = {
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
  logInUser(makeUserObj(user[0], user[1]));
}

export const buildLogInPage = (): HTMLElement => {
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
    const label = createElement('label', {
      class: `label-form label-form--${input.class}`,
      for: input.id,
    },
    input.class);
    const inputEl = createElement(
      'input', {
        class: `input-form input-form--${input.class}`, id: input.id, type: input.type, name: input.id,
      },
    );
    renderElement(label, inputContainer);
    renderElement(inputEl, inputContainer);
    renderElement(inputContainer, form);
  });
  const button = createElement('button', { class: 'btn btn--signup' }, 'Log in');
  renderElement(button, form);
  renderElement(form, formContainer);

  const question = createElement('p', { class: 'form__question' });
  const signUpLink = createElement('a', { class: 'form__link', href: '/signup', 'data-navigo': ''}, 'Sign up');
  question.append('Do not have an account?');
  question.append(signUpLink);
  renderElement(question, formContainer);

  const errorsContainer = createElement('ul', { class: 'form__errors' });
  if (appStateUi.logInErrors.length > 0) {
    appStateUi.logInErrors.forEach((error: string) => {
      const errorItem = createElement('li', { class: 'form__error' }, error);
      renderElement(errorItem, errorsContainer);
    });
  }
  renderElement(errorsContainer, formContainer);

  renderElement(formContainer, containerLeft);
  renderElement(containerLeft, result);

  const poster = createElement('div', { class: 'signup__poster' });
  logInText.forEach((bubble) => {
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
