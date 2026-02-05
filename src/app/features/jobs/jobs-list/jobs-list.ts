import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-jobs-list',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink, TranslatePipe],
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.scss'
})
export class JobsList {
  protected readonly sampleJobs = [
    { title: 'Frontend Engineer', company: 'Northwind', location: 'Remote', status: 'Applied' },
    { title: 'Product Designer', company: 'Acme AB', location: 'Stockholm', status: 'Interview' },
    { title: 'UX Researcher', company: 'Bright Labs', location: 'Göteborg', status: 'Offer' }
  ];
}
