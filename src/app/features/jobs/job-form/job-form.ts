import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-job-form',
  imports: [MatButtonModule, MatCardModule, RouterLink, TranslatePipe],
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss'
})
export class JobForm {
}
