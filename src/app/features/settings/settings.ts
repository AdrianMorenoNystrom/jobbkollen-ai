import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-settings',
  imports: [MatButtonModule, MatCardModule, MatSnackBarModule, TranslatePipe],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  constructor(
    private readonly auth: AuthService,
    private readonly i18n: I18nService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  async signOut() {
    const { error } = await this.auth.signOut();
    if (error) {
      this.snackBar.open(error.message, this.i18n.translate('common.ok'), { duration: 4000 });
      return;
    }
    this.snackBar.open(this.i18n.translate('toast.signOut'), this.i18n.translate('common.ok'), {
      duration: 3000
    });
    await this.router.navigate(['/']);
  }
}
