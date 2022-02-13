import './timer.scss';
import { createResult } from '../../../result/result';
import { stateSprint } from '../../../../utils/constants';

let timer: NodeJS.Timeout;

export function countdown(parent:HTMLElement) {
  parent.innerHTML = String(stateSprint.max_sec);
  stateSprint.max_sec--;
  if (stateSprint.max_sec === -2) {
    clearTimeout(timer);
    createResult(stateSprint);
  } else {
    timer = setTimeout(countdown, 1000, parent);
  }
}
