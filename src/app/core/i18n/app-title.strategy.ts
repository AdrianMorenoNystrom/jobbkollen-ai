import { Injectable, effect } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { I18nService } from './i18n.service';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private latestState: RouterStateSnapshot | null = null;

  constructor(
    private readonly title: Title,
    private readonly i18n: I18nService
  ) {
    super();

    effect(() => {
      this.i18n.language();
      if (this.latestState) {
        this.updateTitle(this.latestState);
      }
    });
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    this.latestState = routerState;
    const titleKey = this.buildTitle(routerState);
    if (!titleKey) {
      return;
    }
    this.title.setTitle(this.i18n.translate(titleKey));
  }
}
