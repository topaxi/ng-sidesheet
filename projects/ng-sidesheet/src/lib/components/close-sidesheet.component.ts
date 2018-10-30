import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'button[ngCloseSidesheet]',
  templateUrl: './close-sidesheet.component.html',
  styleUrls: ['./close-sidesheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloseSidesheetComponent {}
