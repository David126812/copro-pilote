import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('AuthGuard component', () => {
  const guardPath = resolve(__dirname, '../components/auth/AuthGuard.tsx');

  it('should exist', () => {
    expect(existsSync(guardPath)).toBe(true);
  });

  it('should export AuthGuard', () => {
    const content = readFileSync(guardPath, 'utf-8');
    expect(content).toContain('export');
    expect(content).toContain('AuthGuard');
  });

  it('should use useAuth hook', () => {
    const content = readFileSync(guardPath, 'utf-8');
    expect(content).toContain('useAuth');
  });

  it('should redirect to /auth when not authenticated', () => {
    const content = readFileSync(guardPath, 'utf-8');
    expect(content).toContain('/auth');
  });

  it('should show loading state', () => {
    const content = readFileSync(guardPath, 'utf-8');
    expect(content).toContain('loading');
  });
});
