import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';
import { onboardingGuard } from './onboarding.guard';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

describe('Route guards', () => {
  const authStub = {
    getSession: () => Promise.resolve(null)
  };
  const profileStub = {
    getMyProfile: () => Promise.resolve(null)
  };
  const routerStub = {
    navigate: jasmine.createSpy().and.resolveTo(true)
  };

  beforeEach(() => {
    routerStub.navigate.calls.reset();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: ProfileService, useValue: profileStub },
        { provide: Router, useValue: routerStub }
      ]
    });
  });

  it('authGuard blocks unauthenticated users', async () => {
    authStub.getSession = () => Promise.resolve(null);
    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(authGuard({} as any, {} as any))
    );
    expect(result).toBeFalse();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/auth']);
  });

  it('guestGuard redirects authenticated users', async () => {
    authStub.getSession = () => Promise.resolve({ user: { id: '1' } } as any);
    profileStub.getMyProfile = () => Promise.resolve(null);
    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(guestGuard({} as any, {} as any))
    );
    expect(result).toBeFalse();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/onboarding']);
  });

  it('onboardingGuard redirects when profile missing', async () => {
    authStub.getSession = () => Promise.resolve({ user: { id: '1' } } as any);
    profileStub.getMyProfile = () => Promise.resolve(null);
    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(onboardingGuard({} as any, {} as any))
    );
    expect(result).toBeFalse();
    expect(routerStub.navigate).toHaveBeenCalledWith(['/onboarding']);
  });
});
