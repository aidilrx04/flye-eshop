import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { MetaService } from '../../../services/meta.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UserModel } from '../../../models/user.model';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let metaServiceSpy: jasmine.SpyObj<MetaService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUsers',
      'deleteUser',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    metaServiceSpy = jasmine.createSpyObj('MetaService', ['setMeta']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParamMap: of(new Map<string, string>([['page', '1']])),
    });

    TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MetaService, useValue: metaServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on init', () => {
    const mockUsers: UserModel[] = [{ id: 1, full_name: 'John Doe' }] as any;
    userServiceSpy.getUsers.and.returnValue(
      of({ data: mockUsers, meta: {} } as any),
    );

    component.ngOnInit();

    expect(userServiceSpy.getUsers).toHaveBeenCalled();
    component.users$.subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });
  });

  it('should delete user', () => {
    const userId = 2;
    userServiceSpy.deleteUser.and.returnValue(of(null as any));
    spyOn(component, 'getUsers');

    component.deleteUser(userId);

    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(userId);
    expect(component.getUsers).toHaveBeenCalled();
  });

  it('should prevent deleting the current user', () => {
    const userId = 1;
    authServiceSpy.getUser.and.returnValue({
      id: 1,
      full_name: 'John Doe',
    } as any);
    spyOn(window, 'alert');

    component.deleteUser(userId);

    expect(userServiceSpy.deleteUser).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('You cannot delete yourself!');
  });
});
