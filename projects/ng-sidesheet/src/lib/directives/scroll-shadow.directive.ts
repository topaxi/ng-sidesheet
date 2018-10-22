import { merge, fromEvent, Subscription } from 'rxjs';
import {
  Directive,
  Inject,
  OnInit,
  OnDestroy,
  ElementRef,
  NgZone
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[ngSidesheetScrollShadow]'
})
export class ScrollShadowDirective implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  private readonly before: HTMLDivElement;
  private readonly after: HTMLDivElement;
  private readonly document: Document;

  constructor(
    private readonly elementRef: ElementRef<HTMLUnknownElement>,
    private readonly zone: NgZone,
    @Inject(DOCUMENT) document: any
  ) {
    this.document = document;
    this.before = document.createElement('div');
    this.after = document.createElement('div');
    this.setInitialStyle(this.before, 'before');
    this.setInitialStyle(this.after, 'after');
  }

  ngOnInit(): void {
    const { parentElement } = this.elementRef.nativeElement;

    parentElement!.appendChild(this.before); // tslint:disable-line
    parentElement!.appendChild(this.after); // tslint:disable-line

    this.subscription = this.zone.runOutsideAngular(() =>
      merge(
        fromEvent(this.document, 'resize', { passive: true }),
        fromEvent(this.elementRef.nativeElement, 'scroll', { passive: true })
      ).subscribe(() => this.render())
    );

    setTimeout(() => this.render());
  }

  ngOnDestroy(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }

    const { parentElement } = this.elementRef.nativeElement;

    if (parentElement != null) {
      parentElement.removeChild(this.before);
      parentElement.removeChild(this.after);
    }
  }

  protected render(): void {
    const {
      clientHeight,
      scrollHeight,
      scrollTop
    } = this.elementRef.nativeElement;

    this.before.style.transform = `translateY(${-16 +
      Math.min(16, scrollTop / 2)}px)`;

    const scrollBottom = scrollHeight - clientHeight - scrollTop;
    this.after.style.transform = `translateY(${16 +
      -Math.min(16, scrollBottom / 2)}px)`;
  }

  protected setInitialStyle(
    element: HTMLDivElement,
    position: 'before' | 'after'
  ): void {
    Object.assign(element.style, {
      position: 'absolute',
      left: 0,
      right: 0,
      [position === 'before' ? 'top' : 'bottom']: 0,
      height: '16px',
      transform: `translateY(${position === 'before' ? '-16px' : '16px'})`,
      pointerEvents: 'none',
      contain: 'strict',
      willChange: 'transform',
      background:
        position === 'before'
          ? 'radial-gradient(farthest-side at 50% 0, rgba(0,0,0,.2), rgba(0,0,0,0))'
          : 'radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%'
    });
  }
}
