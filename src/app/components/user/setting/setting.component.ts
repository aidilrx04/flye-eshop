import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, Observable } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-setting',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent {
  authService = inject(AuthService);
  form = inject(FormBuilder);

  user$!: Observable<UserModel>;

  updateUserGroup = this.form.group({
    full_name: ['', Validators.required],
    password: [''],
    passwordConfirmation: [''],
  });

  ngOnInit() {
    this.user$ = this.authService.user$.pipe(filter((user) => user !== null));

    this.updateUserGroup.controls.full_name.setValue(
      this.authService.getUser()!.full_name,
    );
  }

  onSubmit() {
    console.log('balls');
    if (this.updateUserGroup.invalid) {
      alert('Full name is required');
    }

    const { full_name, password, passwordConfirmation } =
      this.updateUserGroup.value;

    if (password?.trim() !== '' || passwordConfirmation?.trim() !== '') {
      if (password !== passwordConfirmation) {
        alert('Password confirmation is not match');
        return;
      }
    }

    this.authService
      .updateCurrentUser({
        full_name: full_name ?? undefined,
        password: password!.trim().length > 0 ? password! : undefined,
      })
      .subscribe(() => {
        alert('Profile updated');
      });
  }
}
