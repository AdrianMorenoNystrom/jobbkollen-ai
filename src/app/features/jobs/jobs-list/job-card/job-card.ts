import { DatePipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { Job } from '../../../../core/services/jobs.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { JobNotesDialog } from '../job-notes-dialog/job-notes-dialog';

type CountdownTone = 'today' | 'upcoming' | 'overdue';

@Component({
  selector: 'app-job-card',
  imports: [
    DatePipe,
    NgClass,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    RouterLink,
    TranslatePipe,
    JobNotesDialog
  ],
  templateUrl: './job-card.html',
  styleUrl: './job-card.scss'
})
export class JobCard {
  @Input({ required: true }) job!: Job;
  @Output() deleteJob = new EventEmitter<Job>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly i18n: I18nService
  ) {}

  protected statusLabel(status: string): string {
    const normalized = status.toLowerCase();
    const key = `jobs.status.${normalized}`;
    const label = this.i18n.translate(key);
    return label === key ? status : label;
  }

  protected statusClass(status: string): string {
    const normalized = status.toLowerCase().replace(/\s+/g, '-');
    return `job-card__status-chip--${normalized}`;
  }

  protected get hasNotes(): boolean {
    return Boolean(this.job?.notes?.trim());
  }

  protected async openNotes(): Promise<void> {
    const dialogRef = this.dialog.open(JobNotesDialog, {
      data: {
        jobId: this.job.id,
        title: this.job.title,
        company: this.job.company,
        notes: this.job.notes ?? ''
      }
    });

    const updated = await firstValueFrom(dialogRef.afterClosed());
    if (updated !== undefined) {
      this.job.notes = updated;
    }
  }

  protected get notesActionLabel(): string {
    return this.i18n.translate(this.hasNotes ? 'jobs.notes.edit' : 'jobs.notes.add');
  }

  protected requestDelete(): void {
    this.deleteJob.emit(this.job);
  }

  protected get followUpLabel(): string {
    const target = this.parseDate(this.job?.follow_up_on);
    if (!target) {
      return '';
    }

    const days = this.diffInDays(target, new Date());
    if (days === 0) {
      return this.i18n.translate('jobs.followUpToday');
    }

    if (days > 0) {
      return this.interpolateDays('jobs.followUpInDays', days);
    }

    return this.interpolateDays('jobs.followUpOverdue', Math.abs(days));
  }

  protected get followUpTone(): CountdownTone | null {
    const target = this.parseDate(this.job?.follow_up_on);
    if (!target) {
      return null;
    }

    const days = this.diffInDays(target, new Date());
    if (days === 0) {
      return 'today';
    }
    return days > 0 ? 'upcoming' : 'overdue';
  }

  protected get followUpClass(): string {
    const tone = this.followUpTone;
    return tone ? `job-card__countdown--${tone}` : '';
  }

  protected get isDueSoon(): boolean {
    const target = this.parseDate(this.job?.follow_up_on);
    if (!target) {
      return false;
    }

    const days = this.diffInDays(target, new Date());
    return days >= 0 && days <= 2;
  }

  private interpolateDays(key: string, days: number): string {
    return this.i18n.translate(key).replace('{days}', `${days}`);
  }

  private parseDate(value?: string | null): Date | null {
    if (!value) {
      return null;
    }

    const parts = value.split('-').map((segment) => Number(segment));
    if (parts.length === 3 && parts.every((segment) => Number.isFinite(segment))) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return parsed;
  }

  private diffInDays(target: Date, base: Date): number {
    const start = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const milliseconds = end.getTime() - start.getTime();
    return Math.round(milliseconds / 86400000);
  }
}
