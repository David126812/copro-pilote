import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('AuthGuard integration in App.tsx', () => {
  const appPath = resolve(__dirname, '../App.tsx');
  const appContent = readFileSync(appPath, 'utf-8');

  it('should import AuthGuard', () => {
    expect(appContent).toContain('import { AuthGuard }');
  });

  it('should wrap dashboard with AuthGuard', () => {
    expect(appContent).toContain('<AuthGuard><Dashboard');
  });

  it('should wrap dossiers with AuthGuard', () => {
    expect(appContent).toContain('<AuthGuard><DossiersList');
  });

  it('should wrap signalements with AuthGuard', () => {
    expect(appContent).toContain('<AuthGuard><Signalements');
  });

  it('should NOT wrap /auth with AuthGuard', () => {
    // /auth route should be Auth directly, not wrapped
    expect(appContent).toContain('path="/auth" element={<Auth />}');
  });
});
