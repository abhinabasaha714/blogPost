import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMagnify]',
  standalone: true,
})
export class MagnifyDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.setScale('1.05');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setScale('1');
  }

  private setScale(scale: string) {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `scale(${scale})`
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      'transform 0.3s'
    );
  }
}
