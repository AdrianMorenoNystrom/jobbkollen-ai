import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Settings } from './settings';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [
        {
          provide: AuthService,
          useValue: { signOut: () => Promise.resolve({ error: null }) }
        },
        {
          provide: MatSnackBar,
          useValue: { open: () => undefined }
        },
        {
          provide: Router,
          useValue: { navigate: () => Promise.resolve(true) }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
