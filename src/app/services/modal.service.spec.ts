import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { first, firstValueFrom } from 'rxjs';
import { TemplateRef } from '@angular/core';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a modal', async () => {
    expect(await firstValueFrom(service.modal$)).toBeNull();

    const template = {} as any as TemplateRef<any>;

    service.openModal(template);

    expect(await firstValueFrom(service.modal$)).toEqual(
      {} as any as TemplateRef<any>,
    );
  });
  it('should close a modal', async () => {
    const template = {} as any as TemplateRef<any>;

    service.openModal(template);

    expect(await firstValueFrom(service.modal$)).toEqual(
      {} as any as TemplateRef<any>,
    );

    service.closeCurrentModal();

    expect(await firstValueFrom(service.modal$)).toBeNull();
  });
});
