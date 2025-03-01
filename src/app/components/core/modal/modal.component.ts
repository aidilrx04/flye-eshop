import { Component, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [AsyncPipe, NgTemplateOutlet],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  constructor(private modalService: ModalService) {}

  modal$!: Observable<TemplateRef<any> | null>;

  ngOnInit() {
    this.modal$ = this.modalService.modal$;

    this.modal$.subscribe((val) => {});
  }

  closeCurrentModal() {
    this.modalService.closeCurrentModal();
  }

  closeModalTemplate() {
    return this.closeCurrentModal();
  }
}
