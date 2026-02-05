import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

export interface DeleteJobDialogData {
  title: string;
  company: string;
}

@Component({
  selector: 'app-delete-job-dialog',
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  templateUrl: './delete-job-dialog.html',
  styleUrl: './delete-job-dialog.scss'
})
export class DeleteJobDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) protected readonly data: DeleteJobDialogData,
    protected readonly dialogRef: MatDialogRef<DeleteJobDialog>
  ) {}
}
