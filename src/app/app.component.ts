import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/core/navbar/navbar.component';
import { FooterComponent } from './components/core/footer/footer.component';
import { AuthService } from './services/auth.service';
import { zip } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  title = 'balls';
  hasInitCompleted = signal(false);

  ngOnInit() {
    zip([this.authService.init()]).subscribe({
      complete: () => {
        this.hasInitCompleted.set(true);
      },
    });
  }
}
