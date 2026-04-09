import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Epic 5: Notifications
describe('Epic 5: Notification helpers', () => {
  it('sendWhatsApp.ts should exist', () => {
    expect(existsSync(resolve(__dirname, '../../supabase/functions/_shared/sendWhatsApp.ts'))).toBe(true);
  });

  it('sendEmail.ts should exist', () => {
    expect(existsSync(resolve(__dirname, '../../supabase/functions/_shared/sendEmail.ts'))).toBe(true);
  });

  it('send-notification Edge Function should exist', () => {
    expect(existsSync(resolve(__dirname, '../../supabase/functions/send-notification/index.ts'))).toBe(true);
  });

  it('send-notification should import shared helpers', () => {
    const content = readFileSync(resolve(__dirname, '../../supabase/functions/send-notification/index.ts'), 'utf-8');
    expect(content).toContain('sendWhatsApp');
    expect(content).toContain('sendEmail');
  });

  it('send-notification should check notification_consent', () => {
    const content = readFileSync(resolve(__dirname, '../../supabase/functions/send-notification/index.ts'), 'utf-8');
    expect(content).toContain('notification_consent');
  });
});

// Epic 6: Dashboard & Digest
describe('Epic 6: Digest Edge Function', () => {
  it('send-digest Edge Function should exist', () => {
    expect(existsSync(resolve(__dirname, '../../supabase/functions/send-digest/index.ts'))).toBe(true);
  });

  it('should generate AI summary of dossiers', () => {
    const content = readFileSync(resolve(__dirname, '../../supabase/functions/send-digest/index.ts'), 'utf-8');
    expect(content).toContain('api.anthropic.com');
    expect(content).toContain('digest');
  });

  it('should send via WhatsApp and email', () => {
    const content = readFileSync(resolve(__dirname, '../../supabase/functions/send-digest/index.ts'), 'utf-8');
    expect(content).toContain('sendWhatsApp');
    expect(content).toContain('sendEmail');
  });

  it('should query dossiers by copro_id', () => {
    const content = readFileSync(resolve(__dirname, '../../supabase/functions/send-digest/index.ts'), 'utf-8');
    expect(content).toContain('copro_id');
  });
});

// Epic 6: analyze-document Edge Function
describe('Epic 3/6: analyze-document Edge Function', () => {
  it('should exist', () => {
    expect(existsSync(resolve(__dirname, '../../supabase/functions/analyze-document/index.ts'))).toBe(true);
  });

  it('should import shared analyzeMessage', () => {
    const content = readFileSync(resolve(__dirname, '../../supabase/functions/analyze-document/index.ts'), 'utf-8');
    expect(content).toContain('import { analyzeMessage }');
  });

  it('should download document from URL', () => {
    const content = readFileSync(resolve(__dirname, '../../supabase/functions/analyze-document/index.ts'), 'utf-8');
    expect(content).toContain('document_url');
    expect(content).toContain('fetch');
  });
});

// Epic 7: PostHog
describe('Epic 7: PostHog integration', () => {
  it('posthog.ts should exist', () => {
    expect(existsSync(resolve(__dirname, '../lib/posthog.ts'))).toBe(true);
  });

  it('should export initPostHog', () => {
    const content = readFileSync(resolve(__dirname, '../lib/posthog.ts'), 'utf-8');
    expect(content).toContain('export function initPostHog');
  });

  it('should export identifyUser', () => {
    const content = readFileSync(resolve(__dirname, '../lib/posthog.ts'), 'utf-8');
    expect(content).toContain('export function identifyUser');
  });

  it('should export trackEvent', () => {
    const content = readFileSync(resolve(__dirname, '../lib/posthog.ts'), 'utf-8');
    expect(content).toContain('export function trackEvent');
  });

  it('should use EU host by default', () => {
    const content = readFileSync(resolve(__dirname, '../lib/posthog.ts'), 'utf-8');
    expect(content).toContain('eu.posthog.com');
  });

  it('should support group by copro', () => {
    const content = readFileSync(resolve(__dirname, '../lib/posthog.ts'), 'utf-8');
    expect(content).toContain("group");
    expect(content).toContain("copro");
  });
});

// Epic 8: Seed data
describe('Epic 8: Seed data', () => {
  it('existing seed SQL should exist', () => {
    expect(existsSync(resolve(__dirname, '../../supabase-schema.sql'))).toBe(true);
  });
});
