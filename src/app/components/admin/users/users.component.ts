import { Component } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { AsyncPipe } from '@angular/common';
import { DropdownComponent } from '../../core/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../core/dropdown-item/dropdown-item.component';
import { AuthService } from '../../../services/auth.service';
import { PagingComponent } from '../../core/paging/paging.component';
import { MetaService } from '../../../services/meta.service';
import { ActivatedRoute } from '@angular/router';
import { isNumberOr } from '../../../utils/is-number-or';

@Component({
  selector: 'app-users',
  imports: [
    AsyncPipe,
    DropdownComponent,
    DropdownItemComponent,
    PagingComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private metaService: MetaService,
    private route: ActivatedRoute,
  ) {}

  usersSubject = new BehaviorSubject<UserModel[]>([]);
  users$ = this.usersSubject.asObservable();

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.route.queryParamMap
      .pipe(
        switchMap((params) =>
          this.userService.getUsers({
            page: isNumberOr(params.get('page'), 1),
          }),
        ),
      )
      .subscribe((res) => {
        this.usersSubject.next(res.data);
        this.metaService.setMeta(res.meta);
      });
  }

  deleteUser(userId: number) {
    const isCurrentUser = userId === this.authService.getUser()?.id;

    if (isCurrentUser) {
      alert('You cannot delete yourself!');
      return;
    }

    this.userService.deleteUser(userId).subscribe(() => {
      console.log('user deleted');
      this.getUsers();
    });
  }
}
