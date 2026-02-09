import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { JobsService } from '../../../../core/services/jobs.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

export interface JobNotesDialogData {
  jobId: string;
  title: string;
  company: string;
  notes: string;
}

@Component({
  selector: 'app-job-notes-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  templateUrl: './job-notes-dialog.html',
  styleUrl: './job-notes-dialog.scss'
})
export class JobNotesDialog {
  protected readonly notesControl = new FormControl('', { nonNullable: true });
  protected isSaving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected readonly data: JobNotesDialogData,
    protected readonly dialogRef: MatDialogRef<JobNotesDialog>,
    private readonly jobsService: JobsService,
    private readonly snackBar: MatSnackBar,
    private readonly i18n: I18nService
  ) {
    this.notesControl.setValue(data.notes ?? '');
  }

  protected async save(): Promise<void> {
    if (this.isSaving) {
      return;
    }

    const normalized = this.notesControl.value.trim();
    const notes = normalized.length ? normalized : null;

    this.isSaving = true;
    const { error } = await this.jobsService.updateJobNotes(this.data.jobId, notes);
    this.isSaving = false;

    if (error) {
      this.snackBar.open(
        error.message || this.i18n.translate('jobs.notes.saveError'),
        this.i18n.translate('common.ok'),
        { duration: 4000 }
      );
      return;
    }

    this.snackBar.open(
      this.i18n.translate('jobs.notes.saved'),
      this.i18n.translate('common.ok'),
      { duration: 2500 }
    );
    this.dialogRef.close(notes);
  }
}
