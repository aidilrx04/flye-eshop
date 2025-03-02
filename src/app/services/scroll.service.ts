import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  constructor() {}

  scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  scrollToElement(elementRef: ElementRef) {
    elementRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
