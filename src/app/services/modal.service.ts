import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor() {}

  private modalSubject = new BehaviorSubject<TemplateRef<any> | null>(null);
  modal$ = this.modalSubject.asObservable();

  openModal(template: TemplateRef<any>) {
    this.modalSubject.next(template);
  }

  closeCurrentModal() {
    this.modalSubject.next(null);
  }
}
