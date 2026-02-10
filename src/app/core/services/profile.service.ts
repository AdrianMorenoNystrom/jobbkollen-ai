import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from './auth.service';

export type PreferredLanguage = 'sv' | 'en';

export interface Profile {
  id: string;
  first_name: string;
  avatar_color: string;
  preferred_language: PreferredLanguage;
  reminder_email?: string | null;
  reminders_enabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);
  private readonly client = this.supabase.client;
  readonly profileUpdated$ = new Subject<void>();

  async getMyProfile(): Promise<Profile | null> {
    const session = await this.auth.getSession();
    const userId = session?.user.id;
    if (!userId) {
      return null;
    }

    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data as Profile | null;
  }

  async upsertMyProfile(profile: Partial<Profile>) {
    const session = await this.auth.getSession();
    const userId = session?.user.id;
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const result = await this.client.from('profiles').upsert({ id: userId, ...profile });
    if (!result.error) {
      this.profileUpdated$.next();
    }
    return result;
  }

  async updateMyProfile(profile: Partial<Profile>) {
    const session = await this.auth.getSession();
    const userId = session?.user.id;
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const result = await this.client.from('profiles').update(profile).eq('id', userId);
    if (!result.error) {
      this.profileUpdated$.next();
    }
    return result;
  }
}
