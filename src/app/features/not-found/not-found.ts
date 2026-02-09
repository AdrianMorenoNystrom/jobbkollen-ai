import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-not-found',
  imports: [MatButtonModule, MatCardModule, RouterLink, TranslatePipe],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFound {}
