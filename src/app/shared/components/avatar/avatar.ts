import { NgClass } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, effect, inject } from '@angular/core';
import { AVATAR_COLORS } from '../../data/avatar-palette';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'app-avatar',
  imports: [NgClass],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss'
})
export class Avatar implements OnChanges {
  @Input() name = '';
  @Input() color = '';

  private readonly i18n = inject(I18nService);

  protected avatarClass = 'avatar--default';
  protected textClass = 'avatar--text-dark';
  protected ariaLabel = 'Avatar';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['name'] || changes['color']) {
      this.updatePresentation();
    }
  }

  protected getInitial(): string {
    const trimmed = this.name.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
  }

  private updatePresentation(): void {
    const initial = this.getInitial();
    this.ariaLabel = `${this.i18n.translate('avatar.label')} ${initial}`;

    if (this.color) {
      this.avatarClass = `avatar--${this.color}`;
    } else {
      this.avatarClass = 'avatar--default';
    }

    const hex = AVATAR_COLORS.find((option) => option.id === this.color)?.hex ?? '#cbd5f5';
    this.textClass = this.isLight(hex) ? 'avatar--text-dark' : 'avatar--text-light';
  }

  private isLight(hex: string): boolean {
    const normalized = hex.replace('#', '');
    const r = parseInt(normalized.substring(0, 2), 16);
    const g = parseInt(normalized.substring(2, 4), 16);
    const b = parseInt(normalized.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 160;
  }

  constructor() {
    effect(() => {
      this.i18n.language();
      this.updatePresentation();
    });
  }
}
