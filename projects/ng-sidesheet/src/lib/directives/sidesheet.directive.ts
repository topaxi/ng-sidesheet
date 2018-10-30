import { filter } from 'rxjs/operators';
import {
  Directive,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  OnDestroy,
  Input,
  ViewContainerRef,
  TemplateRef,
  EmbeddedViewRef,
  Injector,
  Inject
} from '@angular/core';
import {
  PortalInjector,
  ComponentPortal,
  TemplatePortal
} from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { SidesheetComponent } from '../components/sidesheet.component';
import { SIDESHEET_CONFIG, SidesheetConfig } from '../sidesheet-config';

export class SidesheetDirectiveContext<T> {
  ngSidesheetWith?: T = undefined;
}

const noop = () => {};

@Directive({
  selector: '[ngSidesheet]',
  host: { class: 'sidesheet-host' } // tslint:disable-line
})
export class SidesheetDirective<T> implements OnChanges, OnDestroy {
  @Input()
  ngSidesheet: 'left' | 'right' = 'right';

  @Input()
  ngSidesheetWith?: T;

  @Input()
  ngSidesheetOverlay?: boolean;

  @Input()
  ngSidesheetOverlayCloseOnClick?: boolean;

  @Input()
  ngSidesheetOverlayCloseOnESC?: boolean;

  // Structural directives do not support @Output()..
  @Input()
  ngSidesheetClose: () => void = noop;

  private readonly templateContext = new SidesheetDirectiveContext<T>();
  private overlayRef?: OverlayRef = undefined;
  private sidesheet: SidesheetComponent | null = null;
  private scheduled = false;
  private readonly config: Readonly<SidesheetConfig>;

  constructor(
    @Inject(SIDESHEET_CONFIG) config: any,
    private readonly injector: Injector,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<SidesheetDirectiveContext<T>>,
    private readonly overlay: Overlay
  ) {
    this.config = config;
    this.ngSidesheetOverlay = config.overlay;
    this.ngSidesheetOverlayCloseOnClick = config.overlayCloseOnClick;
    this.ngSidesheetOverlayCloseOnESC = config.overlayCloseOnESC;
  }

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
      } else if (this.sidesheet != null) {
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
        this.sidesheet.close();
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

  private createSidesheet(): EmbeddedViewRef<SidesheetDirectiveContext<T>> {
    if (this.sidesheet !== null) {
      throw new Error('Sidesheet is already rendered!');
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: this.ngSidesheetOverlay
    });

    this.overlayRef
      .backdropClick()
      .pipe(filter(click => this.ngSidesheetOverlayCloseOnClick))
      .subscribe(click => this.sidesheet.close());

    const sidesheetComponentRef = new ComponentPortal(
      SidesheetComponent,
      null,
      new PortalInjector(this.injector, new WeakMap())
    );

    this.sidesheet = this.overlayRef.attach(sidesheetComponentRef).instance;
    this.sidesheet.ngSidesheetOverlay = this.ngSidesheetOverlay;
    this.sidesheet.ngSidesheetOverlayCloseOnClick = this.ngSidesheetOverlayCloseOnClick;
    this.sidesheet.ngSidesheetOverlayCloseOnESC = this.ngSidesheetOverlayCloseOnESC;

    this.sidesheet.afterClosed.subscribe(() => {
      if (this.overlayRef != null) {
        this.overlayRef.detach();
        this.overlayRef.dispose();
        this.sidesheet = null;
      }

      if (typeof this.ngSidesheetClose === 'function') {
        this.ngSidesheetClose.call(undefined);
      }
    });

    return this.sidesheet.attach(
      new TemplatePortal(this.templateRef, null as any, this.templateContext)
    );
  }
}
