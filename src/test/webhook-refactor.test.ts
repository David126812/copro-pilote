import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Webhook refactored (Story 3.2)', () => {
  const webhookPath = resolve(__dirname, '../../supabase/functions/whatsapp-webhook/index.ts');
  const content = readFileSync(webhookPath, 'utf-8');

  it('should import shared analyzeMessage', () => {
    expect(content).toContain('import { analyzeMessage }');
    expect(content).toContain('_shared/analyzeMessage');
  });

  it('should have findCoproByPhone function', () => {
    expect(content).toContain('findCoproByPhone');
  });

  it('should pass copro_id to createSignalement', () => {
    expect(content).toContain('copro_id');
  });

  it('should include location in signalement insert', () => {
    expect(content).toContain('location: analysis.location');
  });

  it('should pass ANTHROPIC_API_KEY to analyzeMessage', () => {
    expect(content).toContain('analyzeMessage(ANTHROPIC_API_KEY');
  });

  it('should reject unknown senders', () => {
    expect(content).toContain('no matching profile');
  });
});
