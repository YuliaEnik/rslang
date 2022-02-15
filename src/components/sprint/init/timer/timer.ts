import './timer.scss';
import { createResult } from '../../../result/result';
import { stateSprint } from '../../../../utils/constants';

export let timer1: NodeJS.Timeout;

export function countdown(parent:HTMLElement) {
  parent.innerHTML = String(stateSprint.game_time);
  stateSprint.game_time--;
  if (stateSprint.game_time === -2) {
    clearTimeout(timer1);
    createResult(stateSprint);
  } else {
    timer1 = setTimeout(countdown, 1000, parent);
  }
}
