import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { I18nService } from '../../../core/i18n/i18n.service';
import { JobsService } from '../../../core/services/jobs.service';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { DeleteJobDialog } from '../jobs-list/delete-job-dialog/delete-job-dialog';
import { calculateFollowUpDate, FollowUpPreset } from './follow-up-calculator';

type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

@Component({
  selector: 'app-job-form',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    PageHeader,
    RouterLink,
    TranslatePipe,
    DeleteJobDialog
  ],
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss'
})
export class JobForm {
  protected readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    company: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    applied_on: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    status: new FormControl<JobStatus>('Applied', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true }),
    job_url: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)]
    }),
    follow_up_preset: new FormControl<FollowUpPreset | null>(null)
  });

  protected isLoading = false;
  protected isSaving = false;
  protected readonly jobId: string | null;
  protected readonly isEdit: boolean;
  protected readonly statuses: { value: JobStatus; labelKey: string }[] = [
    { value: 'Applied', labelKey: 'jobs.status.applied' },
    { value: 'Interview', labelKey: 'jobs.status.interview' },
    { value: 'Offer', labelKey: 'jobs.status.offer' },
    { value: 'Rejected', labelKey: 'jobs.status.rejected' }
  ];
  protected readonly followUpPresets: { value: FollowUpPreset | null; labelKey: string }[] = [
    { value: null, labelKey: 'jobForm.followUpNone' },
    { value: '5bd', labelKey: 'jobForm.followUp5bd' },
    { value: '1w', labelKey: 'jobForm.followUp1w' },
    { value: '2w', labelKey: 'jobForm.followUp2w' }
  ];

  constructor(
    private readonly jobsService: JobsService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly i18n: I18nService
  ) {
    this.jobId = this.route.snapshot.paramMap.get('id');
    this.isEdit = Boolean(this.jobId);

    if (this.isEdit && this.jobId) {
      void this.loadJob(this.jobId);
    }
  }

  protected async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const appliedOn = this.form.controls.applied_on.value;
    const followUpPreset = this.form.controls.follow_up_preset.value;
    const followUpOn = calculateFollowUpDate(appliedOn, followUpPreset);
    const payload = {
      title: this.form.controls.title.value.trim(),
      company: this.form.controls.company.value.trim(),
      location: this.form.controls.location.value.trim(),
      applied_on: appliedOn ? this.toDateString(appliedOn) : null,
      status: this.form.controls.status.value,
      notes: this.form.controls.notes.value.trim() || null,
      job_url: this.form.controls.job_url.value.trim() || null,
      follow_up_preset: followUpPreset,
      follow_up_on: followUpOn ? this.toDateString(followUpOn) : null
    };

    this.isSaving = true;
    const { error } = this.isEdit && this.jobId
      ? await this.jobsService.updateJob(this.jobId, payload)
      : await this.jobsService.createJob(payload);
    this.isSaving = false;

    if (error) {
      this.snackBar.open(
        error.message || this.i18n.translate('jobForm.saveError'),
        this.i18n.translate('common.ok'),
        { duration: 4000 }
      );
      return;
    }

    this.snackBar.open(this.i18n.translate('jobForm.saved'), this.i18n.translate('common.ok'), {
      duration: 3000
    });
    await this.router.navigate(['/app/jobs']);
  }

  protected async confirmDelete(): Promise<void> {
    if (!this.jobId) {
      return;
    }

    const dialogRef = this.dialog.open(DeleteJobDialog, {
      data: {
        title: this.form.controls.title.value,
        company: this.form.controls.company.value
      }
    });

    const confirmed = await firstValueFrom(dialogRef.afterClosed());
    if (!confirmed) {
      return;
    }

    const { error } = await this.jobsService.deleteJob(this.jobId);
    if (error) {
      this.snackBar.open(
        error.message || this.i18n.translate('jobForm.deleteError'),
        this.i18n.translate('common.ok'),
        { duration: 4000 }
      );
      return;
    }

    this.snackBar.open(this.i18n.translate('jobForm.deleteSuccess'), this.i18n.translate('common.ok'), {
      duration: 3000
    });
    await this.router.navigate(['/app/jobs']);
  }

  protected get titleText(): string {
    return this.i18n.translate(this.isEdit ? 'jobForm.editTitle' : 'jobForm.createTitle');
  }

  protected get subtitleText(): string {
    return this.i18n.translate(this.isEdit ? 'jobForm.editSubtitle' : 'jobForm.createSubtitle');
  }

  protected get computedFollowUpOn(): Date | null {
    return calculateFollowUpDate(
      this.form.controls.applied_on.value,
      this.form.controls.follow_up_preset.value
    );
  }

  private async loadJob(jobId: string): Promise<void> {
    this.isLoading = true;
    const { data, error } = await this.jobsService.getJobById(jobId);
    this.isLoading = false;

    if (error || !data) {
      this.snackBar.open(
        error?.message || this.i18n.translate('jobForm.loadError'),
        this.i18n.translate('common.ok'),
        { duration: 4000 }
      );
      await this.router.navigate(['/app/jobs']);
      return;
    }

    this.form.patchValue({
      title: data.title,
      company: data.company,
      location: data.location,
      applied_on: data.applied_on ? new Date(data.applied_on) : null,
      status: data.status as JobStatus,
      notes: data.notes ?? '',
      job_url: data.job_url ?? '',
      follow_up_preset: (data.follow_up_preset as FollowUpPreset | null) ?? null
    });
  }

  private toDateString(value: Date): string {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, '0');
    const day = `${value.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
