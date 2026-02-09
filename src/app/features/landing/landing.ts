import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LanguageToggle } from '../../shared/components/language-toggle/language-toggle';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-landing',
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    LanguageToggle,
    TranslatePipe
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {
  private readonly featureIcons = [
    'view_agenda',
    'event',
    'notifications_active',
    'smartphone',
    'task_alt',
    'link',
    'sticky_note_2',
    'insights'
  ];

  protected readonly features = this.featureIcons.map((icon, index) => {
    const number = `${index + 1}`.padStart(2, '0');
    return {
      icon,
      title: `landing.feature${number}Title`,
      body: `landing.feature${number}Body`
    };
  });

  protected readonly steps = [
    {
      title: 'landing.step1Title',
      body: 'landing.step1Body'
    },
    {
      title: 'landing.step2Title',
      body: 'landing.step2Body'
    },
    {
      title: 'landing.step3Title',
      body: 'landing.step3Body'
    }
  ];
}
