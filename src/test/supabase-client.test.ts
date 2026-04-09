import { describe, it, expect } from 'vitest';

describe('Supabase client', () => {
  it('should export a supabase client', async () => {
    const { supabase } = await import('../lib/supabase');
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });
});
