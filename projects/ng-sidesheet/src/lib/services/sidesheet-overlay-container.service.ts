import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable()
export class SidesheetOverlayContainer extends OverlayContainer {
  constructor(@Inject(DOCUMENT) document: any) {
    super(document);
  }

  protected _createContainer(): void {
    super._createContainer();
    this._containerElement.classList.add('ng-sidesheet-overlay-container');
  }
}
