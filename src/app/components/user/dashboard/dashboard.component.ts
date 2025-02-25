import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}

  user$!: Observable<UserModel>;

  ngOnInit() {
    this.user$ = this.authService.user$.pipe(map((value) => value!));
  }
}
