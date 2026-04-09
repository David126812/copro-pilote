import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Service Worker file', () => {
  const swPath = resolve(__dirname, '../../public/sw.js');

  it('should exist in public/', () => {
    const sw = readFileSync(swPath, 'utf-8');
    expect(sw).toBeTruthy();
  });

  it('should handle install event', () => {
    const sw = readFileSync(swPath, 'utf-8');
    expect(sw).toContain("addEventListener('install'");
  });

  it('should handle activate event', () => {
    const sw = readFileSync(swPath, 'utf-8');
    expect(sw).toContain("addEventListener('activate'");
  });

  it('should NOT have fetch handler (no offline cache for MVP)', () => {
    const sw = readFileSync(swPath, 'utf-8');
    expect(sw).not.toContain("addEventListener('fetch'");
  });
});

describe('Service Worker registration in main.tsx', () => {
  it('should contain SW registration code', () => {
    const mainPath = resolve(__dirname, '../main.tsx');
    const mainContent = readFileSync(mainPath, 'utf-8');
    expect(mainContent).toContain('serviceWorker');
  });

  it('should check for serviceWorker support before registering', () => {
    const mainPath = resolve(__dirname, '../main.tsx');
    const mainContent = readFileSync(mainPath, 'utf-8');
    expect(mainContent).toContain("'serviceWorker' in navigator");
  });
});
