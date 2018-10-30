import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverlayModule, OverlayContainer } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { SidesheetOutlet } from './components/sidesheet-outlet.component';
import { CloseSidesheetComponent } from './components/close-sidesheet.component';
import { SidesheetComponent } from './components/sidesheet.component';
import { ScrollShadowDirective } from './directives/scroll-shadow.directive';
import { SidesheetDirective } from './directives/sidesheet.directive';
import { SidesheetOverlayContainer } from './services/sidesheet-overlay-container.service';
import { SidesheetConfig, SIDESHEET_CONFIG } from './sidesheet-config';

export const DEFAULT_CONFIG: SidesheetConfig = {
  closeButton: true,
  scrollShadow: true,
  overlay: true,
  overlayCloseOnClick: true,
  overlayCloseOnESC: true
};

const imports = [CommonModule, RouterModule, PortalModule, OverlayModule];
const declarations = [
  SidesheetOutlet,
  CloseSidesheetComponent,
  ScrollShadowDirective,
  SidesheetComponent,
  SidesheetDirective
];
const entryComponents = [SidesheetComponent];
const exports = [SidesheetOutlet, SidesheetDirective];
const providers = [
  {
    provide: OverlayContainer,
    useClass: SidesheetOverlayContainer
  }
];

@NgModule({
  imports,
  declarations,
  entryComponents,
  exports,
  providers: [
    ...providers,
    {
      provide: SIDESHEET_CONFIG,
      useValue: DEFAULT_CONFIG
    }
  ]
})
export class NgSidesheetModule {
  static withConfig(config: Partial<SidesheetConfig>) {
    return {
      ngModule: NgSidesheetModule,
      imports,
      declarations,
      entryComponents,
      exports,
      providers: [
        ...providers,
        {
          provide: SIDESHEET_CONFIG,
          useValue: { ...DEFAULT_CONFIG, ...config }
        }
      ]
    };
  }
}
