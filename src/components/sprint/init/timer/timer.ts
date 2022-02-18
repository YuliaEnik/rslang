import './timer.scss';
import { createResult } from '../../../result/result';
import { stateSprint } from '../../../../utils/constants';

export let timer: NodeJS.Timeout;

export function countdown(parent:HTMLElement) {
  parent.innerHTML = String(stateSprint.game_time);
  stateSprint.game_time--;
  if (stateSprint.game_time === -2) {
    clearTimeout(timer);
    createResult(stateSprint);
  } else {
    // @ts-ignore
    timer = setTimeout(countdown, 1000, parent);
  }
}
