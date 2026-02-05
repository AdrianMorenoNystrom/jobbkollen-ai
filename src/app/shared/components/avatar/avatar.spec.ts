import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Avatar } from './avatar';
import { I18nService } from '../../../core/i18n/i18n.service';

describe('Avatar', () => {
  let component: Avatar;
  let fixture: ComponentFixture<Avatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
      providers: [
        {
          provide: I18nService,
          useValue: { translate: (key: string) => key, language: () => 'sv' }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avatar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
