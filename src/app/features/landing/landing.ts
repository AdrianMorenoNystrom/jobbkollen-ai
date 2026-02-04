import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { LanguageToggle } from '../../shared/components/language-toggle/language-toggle';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    RouterLink,
    LanguageToggle,
    TranslatePipe
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {
  protected readonly features = [
    {
      icon: 'view_agenda',
      title: 'landing.feature1Title',
      body: 'landing.feature1Body'
    },
    {
      icon: 'event',
      title: 'landing.feature2Title',
      body: 'landing.feature2Body'
    },
    {
      icon: 'notifications_active',
      title: 'landing.feature3Title',
      body: 'landing.feature3Body'
    },
    {
      icon: 'smartphone',
      title: 'landing.feature4Title',
      body: 'landing.feature4Body'
    }
  ];
}
