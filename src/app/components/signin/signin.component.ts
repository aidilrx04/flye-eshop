import { Component } from '@angular/core';
import { SectionComponent } from '../core/section/section.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  imports: [SectionComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  hasLoggedIn = false;

  ngOnInit() {
    this.hasLoggedIn = this.authService.isLoggedIn();
  }

  onSubmit() {
    console.log(this.signinForm);

    if (this.signinForm.invalid) return;

    const { email, password } = this.signinForm.value;

    this.authService.signIn(email!, password!).subscribe({
      next(value) {
        const { token } = value as { token: string };

        localStorage.setItem('token', token);
      },

      complete: () => {
        console.log('signed in');
        window.location.reload();
      },
    });
  }
}
