import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  HostBinding
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { closeSidesheetsAnimation } from '../animations/sidesheet.animations';

@Component({
  selector: 'ng-sidesheet-outlet',
  template: '<router-outlet></router-outlet>',
  exportAs: 'panelOutlet',
  styles: [':host { display: contents }'],
  animations: [closeSidesheetsAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidesheetOutlet {
  @ViewChild(RouterOutlet)
  routerOutlet?: RouterOutlet;

  @HostBinding('@closeSidesheetsAnimation')
  get animateClosingSidesheets(): 'open' | 'close' {
    return this.routerOutlet != null && this.routerOutlet.isActivated
      ? 'open'
      : 'close';
  }
}
