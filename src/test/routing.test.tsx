import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('App routing', () => {
  const appPath = resolve(__dirname, '../App.tsx');
  const appContent = readFileSync(appPath, 'utf-8');

  it('should have /auth route', () => {
    expect(appContent).toContain('path="/auth"');
  });

  it('should redirect / to /auth', () => {
    expect(appContent).toContain('Navigate to="/auth"');
  });

  it('should redirect /login to /auth for compatibility', () => {
    expect(appContent).toContain('path="/login"');
  });

  it('should import Auth component', () => {
    expect(appContent).toContain('import Auth');
  });
});
