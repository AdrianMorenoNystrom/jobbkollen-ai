import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { from, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { LanguageToggle } from '../../../shared/components/language-toggle/language-toggle';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-app-shell',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    LanguageToggle,
    TranslatePipe,
    Avatar
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss'
})
export class AppShell {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly i18n = inject(I18nService);

  protected readonly navItems = [
    { label: 'nav.jobs', icon: 'work', link: '/app/jobs' },
    { label: 'nav.newJob', icon: 'add_circle', link: '/app/jobs/new' },
    { label: 'nav.settings', icon: 'settings', link: '/app/settings' }
  ];

  protected isHandsetNow = false;

  protected readonly isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  protected readonly profile$ = this.authService.authState$.pipe(
    switchMap((session) => (session ? from(this.profileService.getMyProfile()) : of(null))),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor() {
    this.isHandset$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isHandset) => {
        this.isHandsetNow = isHandset;
      });
  }

  protected closeIfHandset(drawer: MatSidenav): void {
    if (this.isHandsetNow) {
      drawer.close();
    }
  }

  protected async signOut(): Promise<void> {
    const { error } = await this.authService.signOut();
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
