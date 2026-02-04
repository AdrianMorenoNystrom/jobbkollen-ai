import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('AuthService', () => {
  const authMock = {
    getSession: jasmine.createSpy().and.resolveTo({ data: { session: null } }),
    onAuthStateChange: jasmine.createSpy().and.callFake((callback: any) => {
      callback('SIGNED_OUT', null);
      return { data: { subscription: { unsubscribe: () => undefined } } };
    }),
    signInWithOtp: jasmine.createSpy().and.resolveTo({ data: {}, error: null }),
    verifyOtp: jasmine.createSpy().and.resolveTo({ data: {}, error: null }),
    signOut: jasmine.createSpy().and.resolveTo({ error: null })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: SupabaseService,
          useValue: { client: { auth: authMock } }
        }
      ]
    });
  });

  it('should create', () => {
    const service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should call signInWithOtp', async () => {
    const service = TestBed.inject(AuthService);
    await service.signInWithOtp('test@example.com');
    expect(authMock.signInWithOtp).toHaveBeenCalled();
  });
});
