import { Component } from '@angular/core';
import { SectionComponent } from '../core/section/section.component';
import { LoadingComponent } from '../core/loading/loading.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-signout',
  imports: [SectionComponent, LoadingComponent],
  templateUrl: './signout.component.html',
  styleUrl: './signout.component.css',
})
export class SignoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService
      .signOut()
      .pipe(catchError(() => ''))
      .subscribe(() => {
        console.log('signed out');
        // this.router.navigate(['/signin']);
        window.location.href = '/signin';
      });
  }
}
