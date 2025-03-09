import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { ModalService } from '../../../services/modal.service';
import { of } from 'rxjs';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let modalServiceMock: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    modalServiceMock = jasmine.createSpyObj<ModalService>(
      'ModalService',
      ['closeCurrentModal'],
      {
        modal$: of(null),
      },
    );
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [
        {
          provide: ModalService,
          useValue: modalServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close a modal', () => {
    component.closeCurrentModal();
    expect(modalServiceMock.closeCurrentModal).toHaveBeenCalled();
  });
  it('should close a modal from template', () => {
    component.closeModalTemplate();
    expect(modalServiceMock.closeCurrentModal).toHaveBeenCalled();
  });
});
