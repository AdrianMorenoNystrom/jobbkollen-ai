import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeleteJobDialog } from './delete-job-dialog';
import { I18nService } from '../../../../core/i18n/i18n.service';

describe('DeleteJobDialog', () => {
  let component: DeleteJobDialog;
  let fixture: ComponentFixture<DeleteJobDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteJobDialog],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { title: 'Test', company: 'Acme' }
        },
        {
          provide: MatDialogRef,
          useValue: { close: () => undefined }
        },
        {
          provide: I18nService,
          useValue: { translate: (key: string) => key, language: () => 'sv' }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteJobDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
