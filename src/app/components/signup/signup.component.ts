import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SectionComponent } from '../core/section/section.component';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [SectionComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    fullName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordConfirmation: new FormControl('', Validators.required),
  });

  isLoading = false;
  success = false;
  error?: string;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  onSubmit() {
    const isFormValid = this.signupForm.valid;

    console.log(isFormValid);

    if (!isFormValid) return;

    const { email, fullName, password } = this.signupForm.value;

    this.authService.signUp(email!, fullName!, password!).subscribe({
      next: (value) => {
        console.log('User created');

        // sign in

        //redirect user to login page
        this.router.navigate(['/signin']);

        // this.authService.signIn(email!, password!).subscribe({
        //   next: (value) => {
        //     console.log('signed in', value);
        //     // redirect
        //     this.router.navigate(['/']);
        //   },
        // });
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
