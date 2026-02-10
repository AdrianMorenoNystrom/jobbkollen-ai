import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { DeleteJobDialog } from './delete-job-dialog/delete-job-dialog';
import { JobCard } from './job-card/job-card';

type SortOption = 'recent' | 'oldest' | 'company' | 'status';

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
    PageHeader,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.scss'
})
export class JobsList implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  protected jobs: Job[] = [];
  protected isLoading = false;
  protected readonly statusControl = new FormControl('all', { nonNullable: true });
  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly sortControl = new FormControl<SortOption>('recent', { nonNullable: true });
  protected statusOptions: string[] = ['all'];
  protected readonly sortOptions: { value: SortOption; labelKey: string }[] = [
    { value: 'recent', labelKey: 'jobs.sort.recent' },
    { value: 'oldest', labelKey: 'jobs.sort.oldest' },
    { value: 'company', labelKey: 'jobs.sort.company' },
    { value: 'status', labelKey: 'jobs.sort.status' }
  ];

  constructor(
    private readonly jobsService: JobsService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly i18n: I18nService
  ) {}

  ngOnInit(): void {
    void this.loadJobs();
  }

  protected get jobsCountLabel(): string {
    return this.i18n.translate('jobs.countLabel').replace('{count}', `${this.filteredJobs.length}`);
  }

  protected get filteredJobs(): Job[] {
    const statusFilter = this.statusControl.value;
    const term = this.searchControl.value.trim().toLowerCase();

    const filtered = this.jobs.filter((job) => {
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      const haystack = `${job.title} ${job.company}`.toLowerCase();
      const matchesSearch = !term || haystack.includes(term);
      return matchesStatus && matchesSearch;
    });

    return this.sortJobs(filtered, this.sortControl.value);
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
      this.cdr.detectChanges();
      return;
    }

    this.jobs = [...data];
    this.updateStatusOptions(this.jobs);
    this.cdr.detectChanges();
  }

  private updateStatusOptions(jobs: Job[]): void {
    const statuses = Array.from(new Set(jobs.map((job) => job.status).filter(Boolean)));
    this.statusOptions = ['all', ...statuses];
    if (!this.statusOptions.includes(this.statusControl.value)) {
      this.statusControl.setValue('all', { emitEvent: false });
    }
  }

  private sortJobs(jobs: Job[], sort: SortOption): Job[] {
    const sorted = [...jobs];
    switch (sort) {
      case 'oldest':
        return sorted.sort((a, b) => this.toTime(a.applied_on) - this.toTime(b.applied_on));
      case 'company':
        return sorted.sort((a, b) => this.toText(a.company).localeCompare(this.toText(b.company)));
      case 'status':
        return sorted.sort((a, b) => this.toText(a.status).localeCompare(this.toText(b.status)));
      case 'recent':
      default:
        return sorted.sort((a, b) => this.toTime(b.applied_on) - this.toTime(a.applied_on));
    }
  }

  private toTime(value: string | null): number {
    if (!value) {
      return 0;
    }
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private toText(value: string | null | undefined): string {
    return (value ?? '').toString().toLowerCase();
  }
}
