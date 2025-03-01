import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { AsyncPipe } from '@angular/common';
import { DropdownComponent } from '../../core/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../core/dropdown-item/dropdown-item.component';

@Component({
  selector: 'app-users',
  imports: [AsyncPipe, DropdownComponent, DropdownItemComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  constructor(private userService: UserService) {}

  usersSubject = new BehaviorSubject<UserModel[]>([]);
  users$ = this.usersSubject.asObservable();

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.usersSubject.next(users);
    });
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.userService.getUsers().subscribe((users) => {
        this.usersSubject.next(users);
      });
    });
  }
}
