import { Directive, ElementRef, HostListener } from '@angular/core';
import {until} from 'selenium-webdriver';
import elementIsVisible = until.elementIsVisible;
import elementIsNotVisible = until.elementIsNotVisible;

@Directive({
  selector: '[appHideIcone]'
})
export class HideIconeDirective {

  constructor(private el: ElementRef) { }
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('#ffffff');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('#673AB7');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.color = color;
  }
}
