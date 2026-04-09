import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('useAuth hook', () => {
  const hookPath = resolve(__dirname, '../hooks/useAuth.ts');

  it('should exist', () => {
    expect(existsSync(hookPath)).toBe(true);
  });

  it('should export useAuth function', () => {
    const content = readFileSync(hookPath, 'utf-8');
    expect(content).toContain('export');
    expect(content).toContain('useAuth');
  });

  it('should use onAuthStateChange', () => {
    const content = readFileSync(hookPath, 'utf-8');
    expect(content).toContain('onAuthStateChange');
  });

  it('should track loading state', () => {
    const content = readFileSync(hookPath, 'utf-8');
    expect(content).toContain('loading');
  });
});
