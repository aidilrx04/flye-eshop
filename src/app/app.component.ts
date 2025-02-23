import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoadingComponent } from './components/core/loading/loading.component';
import { filter, zip } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  hasInitCompleted = signal(false);

  ngOnInit() {
    zip(
      this.authService.initCompletedSubject.pipe(
        filter((initCompleted) => initCompleted === true),
      ),
    ).subscribe((v) => {
      this.hasInitCompleted.set(true);
    });
  }
}
