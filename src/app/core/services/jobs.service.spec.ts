import { TestBed } from '@angular/core/testing';
import { JobsService } from './jobs.service';
import { AuthService } from './auth.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JobsService,
        {
          provide: AuthService,
          useValue: { getSession: () => Promise.resolve(null) }
        },
        {
          provide: SupabaseService,
          useValue: { client: {} }
        }
      ]
    });

    service = TestBed.inject(JobsService);
  });

  it('returns empty list when not authenticated', async () => {
    const result = await service.listMyJobs(true);
    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
  });
});
