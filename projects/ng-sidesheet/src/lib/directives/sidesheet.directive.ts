import {
  Directive,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef,
  TemplateRef,
  EmbeddedViewRef,
  Injector
} from '@angular/core';
import {
  PortalInjector,
  ComponentPortal,
  TemplatePortal
} from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { SidesheetComponent } from '../components/sidesheet.component';

export class SidesheetDirectiveContext {
  ngSidesheetWith: any = null;
}

@Directive({
  selector: '[ngSidesheet]',
  host: { class: 'sidesheet-host' } // tslint:disable-line
})
export class SidesheetDirective implements OnChanges, OnDestroy {
  @Input()
  ngSidesheet: 'left' | 'right' = 'right';

  @Input()
  ngSidesheetWith: any = undefined;

  @Input()
  ngSidesheetOpen = true;

  @Output()
  close = new EventEmitter<void>();

  private readonly templateContext = new SidesheetDirectiveContext();
  private overlayRef?: OverlayRef = undefined;
  private sidesheet: SidesheetComponent | null = null;
  private scheduled = false;

  constructor(
    private readonly injector: Injector,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<SidesheetDirectiveContext>,
    private readonly overlay: Overlay
  ) {}

  ngOnChanges({
    ngSidesheet,
    ngSidesheetWith,
    ngSidesheetOpen
  }: SimpleChanges): void {
    if (ngSidesheetWith != null) {
      this.ngSidesheetWithChanges(ngSidesheetWith);
    }

    if (ngSidesheet != null) {
      this.scheduleSidesheetCreation();
    }

    if (ngSidesheetOpen != null) {
      if (ngSidesheetOpen.currentValue) {
        this.scheduleSidesheetCreation();
      } else {
        this.sidesheet.close();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.sidesheet !== null) {
      this.sidesheet.close();
    }
  }

  private ngSidesheetWithChanges({ currentValue }: SimpleChange): void {
    this.templateContext.ngSidesheetWith = currentValue;

    if (currentValue == null) {
      if (this.sidesheet !== null) {
        this.viewContainerRef.clear();
        return;
      }
    } else if (this.sidesheet === null) {
      this.scheduleSidesheetCreation();
    }
  }

  private scheduleSidesheetCreation(): void {
    if (this.scheduled === true) {
      return;
    }

    this.scheduled = true;
    Promise.resolve().then(() => {
      this.createSidesheet();
      this.scheduled = false;
    });
  }

  private createSidesheet(): EmbeddedViewRef<SidesheetDirectiveContext> {
    if (this.sidesheet !== null) {
      throw new Error('Sidesheet is already rendered!');
    }

    this.overlayRef = this.overlay.create();

    const sidesheetComponentRef = new ComponentPortal(
      SidesheetComponent,
      null,
      new PortalInjector(this.injector, new WeakMap())
    );

    this.sidesheet = this.overlayRef.attach(sidesheetComponentRef).instance;

    this.sidesheet.afterClosed.subscribe(() => {
      if (this.overlayRef != null) {
        this.overlayRef.detach();
        this.overlayRef.dispose();
        this.sidesheet = null;
      }

      this.close.emit();
    });

    return this.sidesheet.attach(
      new TemplatePortal(this.templateRef, null as any, this.templateContext)
    );
  }
}
