import {
  trigger,
  state,
  animate,
  style,
  query,
  transition
} from '@angular/animations';

const leaveTiming = '150ms cubic-bezier(0.5, 0.0, 1, 1)';
const enterTiming = '150ms 25ms cubic-bezier(0.0, 0.0, 0.25, 1)';

const styleOpen = style({ transform: 'translateX(0)' });
const styleClosed = style({ transform: 'translate(100%)' });

export const sidesheetLeaveAnimate = animate(leaveTiming, styleClosed);
export const sidesheetEnterAnimate = animate(enterTiming, styleOpen);

export const sidesheetAnimation = trigger('sidesheetAnimation', [
  state('void,closed', styleClosed),
  transition(':leave, * => closed', sidesheetLeaveAnimate),
  transition(':enter, * => open', sidesheetEnterAnimate)
]);

export const closeSidesheetsAnimation = trigger('closeSidesheetsAnimation', [
  transition('* => close', [
    query(':leave ng-sidesheet', sidesheetLeaveAnimate, { optional: true })
  ])
]);
