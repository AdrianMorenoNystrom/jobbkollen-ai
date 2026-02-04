import { Injectable, inject } from '@angular/core';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { SupabaseService } from '../supabase/supabase.service';
import { Session } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = this.supabase.client.auth;
  private readonly sessionSubject = new ReplaySubject<Session | null>(1);
  readonly authState$ = this.sessionSubject.asObservable();
  private currentSession: Session | null = null;

  constructor() {
    this.auth.getSession().then(({ data, error }) => {
      if (error) {
        this.updateSession(null);
        return;
      }
      this.updateSession(data.session ?? null);
    });

    this.auth.onAuthStateChange((_event, session) => {
      this.updateSession(session);
    });
  }

  signInWithOtp(email: string) {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    const emailRedirectTo = origin ? `${origin}/auth/callback` : undefined;
    return this.auth.signInWithOtp({
      email,
      options: emailRedirectTo ? { emailRedirectTo } : undefined
    });
  }

  verifyOtp(email: string, token: string) {
    return this.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
  }

  signOut() {
    return this.auth.signOut();
  }

  async getSession(): Promise<Session | null> {
    return firstValueFrom(this.authState$);
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  private updateSession(session: Session | null) {
    this.currentSession = session;
    this.sessionSubject.next(session);
  }
}
