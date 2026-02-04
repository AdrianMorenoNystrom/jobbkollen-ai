import { Routes } from '@angular/router';
import { AppShell } from './core/layout/app-shell/app-shell';
import { Auth } from './features/auth/auth';
import { JobForm } from './features/jobs/job-form/job-form';
import { JobsList } from './features/jobs/jobs-list/jobs-list';
import { Landing } from './features/landing/landing';
import { Onboarding } from './features/onboarding/onboarding';
import { Settings } from './features/settings/settings';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    title: 'JobbKollen'
  },
  {
    path: 'auth',
    component: Auth,
    title: 'JobbKollen | Auth'
  },
  {
    path: 'onboarding',
    component: Onboarding,
    title: 'JobbKollen | Onboarding'
  },
  {
    path: 'app',
    component: AppShell,
    children: [
      {
        path: 'jobs',
        component: JobsList,
        title: 'JobbKollen | Jobs'
      },
      {
        path: 'jobs/new',
        component: JobForm,
        title: 'JobbKollen | New job'
      },
      {
        path: 'jobs/:id/edit',
        component: JobForm,
        title: 'JobbKollen | Edit job'
      },
      {
        path: 'settings',
        component: Settings,
        title: 'JobbKollen | Settings'
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
