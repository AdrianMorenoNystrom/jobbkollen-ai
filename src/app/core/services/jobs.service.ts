import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from './auth.service';

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string | null;
  applied_on: string | null;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  async listMyJobs(newestFirst = true): Promise<{ data: Job[]; error: { message: string } | null }> {
    const session = await this.auth.getSession();
    const userId = session?.user.id;
    if (!userId) {
      return { data: [], error: null };
    }

    const { data, error } = await this.supabase.client
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
      .order('applied_on', { ascending: !newestFirst });

    return { data: (data ?? []) as Job[], error: error ? { message: error.message } : null };
  }

  async getJobById(id: string): Promise<{ data: Job | null; error: { message: string } | null }> {
    const session = await this.auth.getSession();
    const userId = session?.user.id;
    if (!userId) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data, error } = await this.supabase.client
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    return { data: (data as Job | null) ?? null, error: error ? { message: error.message } : null };
  }

  async deleteJob(id: string): Promise<{ error: { message: string } | null }> {
    const session = await this.auth.getSession();
    const userId = session?.user.id;
    if (!userId) {
      return { error: { message: 'Not authenticated' } };
    }

    const { error } = await this.supabase.client.from('jobs').delete().eq('id', id).eq('user_id', userId);
    return { error: error ? { message: error.message } : null };
  }
}
