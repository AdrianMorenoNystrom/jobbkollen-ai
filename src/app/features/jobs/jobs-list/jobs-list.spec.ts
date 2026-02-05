import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsList } from './jobs-list';
import { JobsService } from '../../../core/services/jobs.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { I18nService } from '../../../core/i18n/i18n.service';
import { of } from 'rxjs';

describe('JobsList', () => {
  let component: JobsList;
  let fixture: ComponentFixture<JobsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsList],
      providers: [
        {
          provide: JobsService,
          useValue: { listMyJobs: () => Promise.resolve({ data: [], error: null }), deleteJob: () => Promise.resolve({ error: null }) }
        },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(false) }) }
        },
        {
          provide: MatSnackBar,
          useValue: { open: () => undefined }
        },
        {
          provide: I18nService,
          useValue: { translate: (key: string) => key }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
