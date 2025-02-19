import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SectionComponent } from '../core/section/section.component';
import { RouterLink } from '@angular/router';

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

  onSubmit() {
    const isFormValid = this.signupForm.valid;

    
    if (!isFormValid) return;
  }
}
