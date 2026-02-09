import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { I18nService } from '../../../core/i18n/i18n.service';
import { JobsService, Job } from '../../../core/services/jobs.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { DeleteJobDialog } from './delete-job-dialog/delete-job-dialog';
import { JobCard } from './job-card/job-card';

@Component({
  selector: 'app-jobs-list',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    DeleteJobDialog,
    JobCard,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.scss'
})
export class JobsList {
  protected jobs: Job[] = [];
  protected isLoading = false;
  protected readonly statusControl = new FormControl('all', { nonNullable: true });
  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected statusOptions: string[] = ['all'];

  constructor(
    private readonly jobsService: JobsService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly i18n: I18nService
  ) {
    void this.loadJobs();
  }

  protected get filteredJobs(): Job[] {
    const statusFilter = this.statusControl.value;
    const term = this.searchControl.value.trim().toLowerCase();

    return this.jobs.filter((job) => {
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      const haystack = `${job.title} ${job.company}`.toLowerCase();
      const matchesSearch = !term || haystack.includes(term);
      return matchesStatus && matchesSearch;
    });
  }

  protected statusLabel(status: string): string {
    const normalized = status.toLowerCase();
    const key = `jobs.status.${normalized}`;
    const label = this.i18n.translate(key);
    return label === key ? status : label;
  }

  protected async confirmDelete(job: Job): Promise<void> {
    const dialogRef = this.dialog.open(DeleteJobDialog, {
      data: { title: job.title, company: job.company }
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());
    if (!confirmed) {
      return;
    }
    await this.deleteJob(job);
  }

  private async deleteJob(job: Job): Promise<void> {
    const { error } = await this.jobsService.deleteJob(job.id);
    if (error) {
      this.snackBar.open(
        error.message || this.i18n.translate('jobs.delete.error'),
        this.i18n.translate('common.ok'),
        { duration: 4000 }
      );
      return;
    }

    this.jobs = this.jobs.filter((item) => item.id !== job.id);
    this.updateStatusOptions(this.jobs);
    this.snackBar.open(
      this.i18n.translate('jobs.delete.success'),
      this.i18n.translate('common.ok'),
      { duration: 3000 }
    );
  }

  private async loadJobs(): Promise<void> {
    this.isLoading = true;
    const { data, error } = await this.jobsService.listMyJobs(true);
    this.isLoading = false;

    if (error) {
      this.snackBar.open(
        error.message || this.i18n.translate('jobs.loadError'),
        this.i18n.translate('common.ok'),
        { duration: 4000 }
      );
      return;
    }

    this.jobs = [...data].sort((a, b) => this.toTime(b.applied_on) - this.toTime(a.applied_on));
    this.updateStatusOptions(this.jobs);
  }

  private updateStatusOptions(jobs: Job[]): void {
    const statuses = Array.from(new Set(jobs.map((job) => job.status).filter(Boolean)));
    this.statusOptions = ['all', ...statuses];
    if (!this.statusOptions.includes(this.statusControl.value)) {
      this.statusControl.setValue('all', { emitEvent: false });
    }
  }

  private toTime(value: string | null): number {
    if (!value) {
      return 0;
    }
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }
}
