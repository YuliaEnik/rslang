import { Match } from 'navigo';
import { appState, appStateUI } from '../../app';
import { pages } from '../../utils/constants';
import { router } from '../../utils/router';
import { UserState } from '../../utils/types';
import { createElement, renderElement, saveUserUISettingsToLocalStorage } from '../../utils/utils';
import './style.scss';

const buildActiveClass = (pageLink: string, context: Match | undefined): string => {
  if (!context) {
    return '';
  }

  if (context.route.name === 'Main' && pageLink === '/') {
    return ' active';
  }

  if (pageLink.includes('dictionary')) {
    const currentUrl = `/${context.url}`;
    return currentUrl.includes('dictionary') ? ' active' : '';
  }

  const currentUrl = `/${context.url}`;
  return currentUrl === pageLink ? ' active' : '';
};

function toggleAsideMenu(menuElement: HTMLElement) {
  if (appStateUI.settings.menu === 'active') {
    appStateUI.settings.menu = '';
    menuElement.classList.remove('active');
    saveUserUISettingsToLocalStorage(appStateUI.settings);
  } else {
    appStateUI.settings.menu = 'active';
    menuElement.classList.add('active');
    saveUserUISettingsToLocalStorage(appStateUI.settings);
  }
}

export function logOut(): void {
  appState.user = null;
  localStorage.removeItem('userState');
  alert('You have been logged out');
  router.navigate('/?loggedout=true');
}

function buildLogOut(page: { title: string; link: string; type: string }, userState: UserState) {
  if (userState === null) return createElement('div', { });

  const result = createElement('li', { class: `nav__item nav__item--${page.type}` });
  const userWrapper = createElement('div', { class: 'nav__user' });
  // const userPic = createElement('div', { class: 'nav__pic' });
  // renderElement(userPic, userWrapper);
  const userName = createElement('p', { class: 'nav__name' }, userState.name);
  renderElement(userName, userWrapper);
  renderElement(userWrapper, result);

  const logOutButton = createElement('button', { class: 'btn btn--logout' });
  logOutButton.addEventListener('click', logOut);
  renderElement(logOutButton, result);

  return result;
}

export const buildLogo = (): HTMLElement => {
  const result = createElement('a', { class: 'logo logo__nav', href: '/', 'data-navigo': '' });
  const logoImg = createElement('div', { class: 'logo__img' });
  renderElement(logoImg, result);
  const logoText = createElement('p', { class: 'logo__text' }, 'RS Lang');
  renderElement(logoText, result);
  return result;
};

export const buildMenuTogle = (menuElement: HTMLElement): HTMLElement => {
  const toggleButton = createElement('button', { class: 'aside__toggle' });
  const toggleIcon = createElement('span', { class: 'toggle toggle__nav' });
  toggleButton.addEventListener('click', () => toggleAsideMenu(menuElement));
  renderElement(toggleIcon, toggleButton);
  return toggleButton;
};

const buildNavItem = (page: { title: string; link: string; type: string }, context: Match | undefined): HTMLElement => {
  const result = createElement('li', { class: 'nav__item' });
  const link = createElement(
    'a',
    {
      class: `nav__link nav__link--${page.type}${buildActiveClass(page.link, context)}`,
      'data-navigo': '',
      href: page.link,
    },
    page.title,
  );
  renderElement(link, result);
  return result;
};

export const buildNavigation = (context: Match | undefined): HTMLElement => {
  const result = createElement('nav', { class: 'nav' });
  const list = createElement('ul', { class: 'nav__list' });
  pages.forEach((page) => {
    if (appState.user) {
      if (page.type === 'logout') {
        renderElement(buildLogOut(page, appState.user), list);
      } else {
        renderElement(buildNavItem(page, context), list);
      }
    } else {
      if (page.type === 'statistics' || page.type === 'logout') return;

      renderElement(buildNavItem(page, context), list);
    }
  });

  renderElement(list, result);
  return result;
};

export const buildSideBar = (context: Match | undefined): HTMLElement => {
  const result = createElement('aside', { class: `menu${appStateUI.settings.menu === 'active' ? ' active' : ''}` });
  renderElement(buildLogo(), result);
  renderElement(buildNavigation(context), result);
  renderElement(buildMenuTogle(result), result);
  return result;
};
