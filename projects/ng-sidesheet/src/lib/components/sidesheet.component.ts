import { Subject } from 'rxjs';
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterContentInit,
  OnDestroy,
  Input,
  HostBinding,
  HostListener,
  ViewChild,
  EmbeddedViewRef,
  ElementRef,
  Inject,
  InjectionToken,
  NgZone
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AnimationEvent } from '@angular/animations';
import {
  TemplatePortal,
  PortalHostDirective,
  PortalOutlet
} from '@angular/cdk/portal';
import { sidesheetAnimation } from '../animations/sidesheet.animations';
import { ScrollShadowDirective } from '../directives/scroll-shadow.directive';
import { SidesheetConfig, SIDESHEET_CONFIG } from '../sidesheet-config';

@Component({
  selector: 'ng-sidesheet',
  templateUrl: './sidesheet.component.html',
  styleUrls: ['./sidesheet.component.scss'],
  animations: [sidesheetAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidesheetComponent
  implements AfterContentInit, OnDestroy, PortalOutlet {
  private readonly _afterClosed = new Subject<void>();

  readonly afterClosed = this._afterClosed.asObservable();

  @HostBinding('@sidesheetAnimation')
  sidesheetAnimation = 'open';

  @ViewChild(PortalHostDirective)
  private readonly portalHost!: PortalHostDirective;
  @ViewChild('sidesheetScroller')
  private readonly sidesheetScroller!: ElementRef<HTMLDivElement>;

  @Input()
  ngSidesheet: 'left' | 'right' = 'right';

  @HostBinding('class.left')
  get left(): boolean {
    return this.ngSidesheet === 'left';
  }

  @HostBinding('class.right')
  get right(): boolean {
    return this.ngSidesheet === 'right';
  }

  get showCloseButton(): boolean {
    return this.config.closeButton;
  }

  @Input()
  ngSidesheetOverlay = false;

  @Input()
  ngSidesheetOverlayCloseOnClick = false;

  @Input()
  ngSidesheetOverlayCloseOnESC = false;

  private attachedPortal: TemplatePortal | null = null;
  private scrollShadow: ScrollShadowDirective;
  private readonly document: Document;
  private readonly config: Readonly<SidesheetConfig>;

  constructor(
    @Inject(SIDESHEET_CONFIG) config: any,
    @Inject(NgZone) private readonly zone: NgZone,
    @Inject(ChangeDetectorRef) private readonly cd: ChangeDetectorRef,
    @Inject(DOCUMENT) document: any
  ) {
    this.config = config;
    this.document = document;
  }

  ngAfterContentInit(): void {
    if (this.config.scrollShadow) {
      this.scrollShadow = new ScrollShadowDirective(
        this.sidesheetScroller,
        this.zone,
        this.document
      );
      this.scrollShadow.ngOnInit();
    }
  }

  ngOnDestroy(): void {
    if (this.scrollShadow != null) {
      this.scrollShadow.ngOnDestroy();
    }
  }

  attach<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this.portalHost.attachTemplatePortal(portal);
  }

  detach(): void {
    if (this.attachedPortal !== null) {
      this.attachedPortal.setAttachedHost(null);
      this.attachedPortal = null;
    }
  }

  dispose(): void {
    return this.detach();
  }

  hasAttached(): boolean {
    return this.attachedPortal !== null;
  }

  @HostListener('@sidesheetAnimation.done', ['$event'])
  onAnimationDone({ fromState, toState }: AnimationEvent): void {
    if (fromState === 'open' && (toState === 'void' || toState === 'closed')) {
      this._afterClosed.next();
      this._afterClosed.complete();
    }
  }

  close(): void {
    this.sidesheetAnimation = 'closed';
    this.cd.markForCheck();
  }

  @HostListener('window:keydown', ['$event'])
  onOverlayESC(e: KeyboardEvent): void {
    if ((e as any).keyCode === 27 && this.ngSidesheetOverlayCloseOnESC) {
      this.close();
    }
  }

  onOverlayClick(e: MouseEvent): void {
    if (this.ngSidesheetOverlayCloseOnClick) {
      this.close();
    }
  }
}
