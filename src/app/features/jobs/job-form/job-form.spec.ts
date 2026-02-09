import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobForm } from './job-form';
import { JobsService } from '../../../core/services/jobs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { I18nService } from '../../../core/i18n/i18n.service';
import { of } from 'rxjs';

describe('JobForm', () => {
  let component: JobForm;
  let fixture: ComponentFixture<JobForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobForm],
      providers: [
        {
          provide: JobsService,
          useValue: {
            getJobById: () => Promise.resolve({ data: null, error: null }),
            createJob: () => Promise.resolve({ error: null }),
            updateJob: () => Promise.resolve({ error: null }),
            deleteJob: () => Promise.resolve({ error: null })
          }
        },
        {
          provide: MatSnackBar,
          useValue: { open: () => undefined }
        },
        {
          provide: Router,
          useValue: { navigate: () => Promise.resolve(true) }
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } }
        },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(false) }) }
        },
        {
          provide: I18nService,
          useValue: { translate: (key: string) => key }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
