import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs/operators';
import { LanguageToggle } from '../../../shared/components/language-toggle/language-toggle';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-app-shell',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    LanguageToggle,
    TranslatePipe
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss'
})
export class AppShell {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

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
}
