import './full-screen.scss';

export function fullscreen(elem:HTMLElement, el:HTMLElement) {
  if (!document.fullscreenElement) {
    el.classList.remove('screen-open');
    el.classList.add('screen-close');
    document.documentElement.requestFullscreen();
  }
  if (document.fullscreenElement) {
    el.classList.remove('screen-close');
    el.classList.add('screen-open');
    setTimeout(() => document.exitFullscreen(), 0);
  }
}
