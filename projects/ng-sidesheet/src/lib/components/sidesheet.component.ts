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

@Component({
  selector: 'ng-sidesheet',
  templateUrl: './sidesheet.component.html',
  styleUrls: ['./sidesheet.component.scss'],
  animations: [sidesheetAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidesheetComponent
  implements AfterContentInit, OnDestroy, PortalOutlet {
  readonly afterClosed = new Subject<void>();

  @HostBinding('@sidesheetAnimation')
  sidesheetAnimation = 'open';

  // tslint:disable-next-line
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

  private attachedPortal: TemplatePortal | null = null;
  private scrollShadow: ScrollShadowDirective;
  private readonly document: Document;

  constructor(
    private readonly zone: NgZone,
    private readonly cd: ChangeDetectorRef,
    @Inject(DOCUMENT) document: any
  ) {
    this.document = document;
  }

  ngAfterContentInit(): void {
    this.scrollShadow = new ScrollShadowDirective(
      this.sidesheetScroller,
      this.zone,
      this.document
    );
    this.scrollShadow.ngOnInit();
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
      this.afterClosed.next();
      this.afterClosed.complete();
    }
  }

  close(): void {
    this.sidesheetAnimation = 'closed';
    this.cd.markForCheck();
  }
}
