import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverlayModule, OverlayContainer } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { SidesheetOutlet } from './components/sidesheet-outlet.component';
import { CloseSidesheetComponent } from './components/close-sidesheet.component';
import { SidesheetHeaderComponent } from './components/sidesheet-header.component';
import { SidesheetComponent } from './components/sidesheet.component';
import { ScrollShadowDirective } from './directives/scroll-shadow.directive';
import { SidesheetDirective } from './directives/sidesheet.directive';
import { SidesheetOverlayContainer } from './services/sidesheet-overlay-container.service';

@NgModule({
  imports: [RouterModule, PortalModule, OverlayModule],
  declarations: [
    SidesheetOutlet,
    CloseSidesheetComponent,
    SidesheetHeaderComponent,
    ScrollShadowDirective,
    SidesheetComponent,
    SidesheetDirective
  ],
  entryComponents: [SidesheetComponent],
  exports: [SidesheetOutlet, SidesheetHeaderComponent, SidesheetDirective],
  providers: [
    {
      provide: OverlayContainer,
      useClass: SidesheetOverlayContainer
    }
  ]
})
export class NgSidesheetModule {}
