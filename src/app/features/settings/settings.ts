import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [MatButtonModule, MatCardModule, MatSnackBarModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  constructor(
    private readonly auth: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  async signOut() {
    const { error } = await this.auth.signOut();
    if (error) {
      this.snackBar.open(error.message, 'OK', { duration: 4000 });
      return;
    }
    this.snackBar.open('Du är utloggad.', 'OK', { duration: 3000 });
    await this.router.navigate(['/auth']);
  }
}
