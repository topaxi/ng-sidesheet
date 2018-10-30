import {
  trigger,
  state,
  animate,
  style,
  query,
  transition
} from '@angular/animations';

export const sidesheetLeaveAnimate = animate(
  '150ms cubic-bezier(0.5, 0.0, 1, 1)',
  style({
    transform: 'translateX(100%)'
  })
);
export const sidesheetEnterAnimate = animate(
  '150ms 25ms cubic-bezier(0.0, 0.0, 0.25, 1)',
  style({
    transform: 'translateX(0)'
  })
);

export const sidesheetAnimation = trigger('sidesheetAnimation', [
  state('void,closed', style({ transform: 'translateX(100%)' })),
  transition(':leave, * => closed', sidesheetLeaveAnimate),
  transition(':enter, * => open', sidesheetEnterAnimate)
]);

export const closeSidesheetsAnimation = trigger('closeSidesheetsAnimation', [
  transition('* => close', [
    query(':leave ng-sidesheet', sidesheetLeaveAnimate, { optional: true })
  ])
]);
