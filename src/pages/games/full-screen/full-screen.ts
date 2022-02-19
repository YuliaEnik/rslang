import './full-screen.scss';

export function fullscreen(elem:HTMLElement, el:HTMLElement) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
    el.classList.remove('screen-open');
    el.classList.add('screen-close');
  }
  if (document.fullscreenElement) {
    setTimeout(() => document.exitFullscreen(), 0);
    el.classList.remove('screen-close');
    el.classList.add('screen-open');
  }
}
