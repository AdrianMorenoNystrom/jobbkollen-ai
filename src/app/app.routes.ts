import { Routes } from '@angular/router';
import { AppShell } from './core/layout/app-shell/app-shell';
import { Auth } from './features/auth/auth';
import { AuthCallback } from './features/auth/auth-callback/auth-callback';
import { JobForm } from './features/jobs/job-form/job-form';
import { JobsList } from './features/jobs/jobs-list/jobs-list';
import { Landing } from './features/landing/landing';
import { Onboarding } from './features/onboarding/onboarding';
import { Settings } from './features/settings/settings';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { onboardingGuard } from './core/guards/onboarding.guard';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    title: 'JobbKollen'
  },
  {
    path: 'auth',
    component: Auth,
    canActivate: [guestGuard],
    title: 'JobbKollen | Logga in'
  },
  {
    path: 'auth/callback',
    component: AuthCallback,
    title: 'JobbKollen | Slutför inloggning'
  },
  {
    path: 'onboarding',
    component: Onboarding,
    canActivate: [authGuard],
    title: 'JobbKollen | Välkommen'
  },
  {
    path: 'app',
    component: AppShell,
    canActivate: [authGuard, onboardingGuard],
    children: [
      {
        path: 'jobs',
        component: JobsList,
        title: 'JobbKollen | Jobb'
      },
      {
        path: 'jobs/new',
        component: JobForm,
        title: 'JobbKollen | Skapa jobb'
      },
      {
        path: 'jobs/:id/edit',
        component: JobForm,
        title: 'JobbKollen | Redigera jobb'
      },
      {
        path: 'settings',
        component: Settings,
        title: 'JobbKollen | Inställningar'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'jobs'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
