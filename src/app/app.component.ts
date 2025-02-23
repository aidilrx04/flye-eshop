import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/core/navbar/navbar.component';
import { FooterComponent } from './components/core/footer/footer.component';
import { AuthService } from './services/auth.service';
import { zip } from 'rxjs';
import { LoadingComponent } from './components/core/loading/loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  title = 'balls';
  hasInitCompleted = signal(false);
  isInAdmin = false;

  ngOnInit() {
    zip([this.authService.init()]).subscribe({
      complete: () => {
        this.hasInitCompleted.set(true);
      },
    });

    this.isInAdmin = window.location.pathname.startsWith('/admin');
  }
}
