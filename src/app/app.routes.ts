import { Routes } from '@angular/router';
import { AppShell } from './core/layout/app-shell/app-shell';
import { Auth } from './features/auth/auth';
import { AuthCallback } from './features/auth/auth-callback/auth-callback';
import { JobForm } from './features/jobs/job-form/job-form';
import { JobsList } from './features/jobs/jobs-list/jobs-list';
import { Landing } from './features/landing/landing';
import { Onboarding } from './features/onboarding/onboarding';
import { Settings } from './features/settings/settings';
import { NotFound } from './features/not-found/not-found';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { onboardingGuard } from './core/guards/onboarding.guard';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    title: 'route.landing.title'
  },
  {
    path: 'auth',
    component: Auth,
    canActivate: [guestGuard],
    title: 'route.auth.title'
  },
  {
    path: 'auth/callback',
    component: AuthCallback,
    title: 'route.authCallback.title'
  },
  {
    path: 'onboarding',
    component: Onboarding,
    canActivate: [authGuard],
    title: 'route.onboarding.title'
  },
  {
    path: 'app',
    component: AppShell,
    canActivate: [authGuard, onboardingGuard],
    children: [
      {
        path: 'jobs',
        component: JobsList,
        title: 'route.jobs.title'
      },
      {
        path: 'jobs/new',
        component: JobForm,
        title: 'route.newJob.title'
      },
      {
        path: 'jobs/:id/edit',
        component: JobForm,
        title: 'route.editJob.title'
      },
      {
        path: 'settings',
        component: Settings,
        title: 'route.settings.title'
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'jobs'
      }
    ]
  },
  {
    path: 'not-found',
    component: NotFound,
    title: 'route.notFound.title'
  },
  {
    path: '**',
    component: NotFound,
    title: 'route.notFound.title'
  }
];
