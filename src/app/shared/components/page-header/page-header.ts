import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [NgIf],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss'
})
export class PageHeader {
  @Input({ required: true }) title = '';
  @Input() subtitle?: string | null;
  @Input() meta?: string | number | null;
}
