import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-auth',
  imports: [MatButtonModule, MatCardModule, TranslatePipe],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth {
}
