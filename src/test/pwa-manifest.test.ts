import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('PWA Manifest', () => {
  const manifestPath = resolve(__dirname, '../../public/manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  it('should have name "Septrion"', () => {
    expect(manifest.name).toBe('Septrion');
  });

  it('should have short_name "Septrion"', () => {
    expect(manifest.short_name).toBe('Septrion');
  });

  it('should have display standalone', () => {
    expect(manifest.display).toBe('standalone');
  });

  it('should have 192x192 icon', () => {
    const icon192 = manifest.icons.find((i: any) => i.sizes === '192x192');
    expect(icon192).toBeDefined();
  });

  it('should have 512x512 icon', () => {
    const icon512 = manifest.icons.find((i: any) => i.sizes === '512x512');
    expect(icon512).toBeDefined();
  });

  it('should have a description', () => {
    expect(manifest.description).toBeTruthy();
  });
});

describe('index.html PWA meta', () => {
  const indexPath = resolve(__dirname, '../../index.html');
  const indexHtml = readFileSync(indexPath, 'utf-8');

  it('should have title "Septrion"', () => {
    expect(indexHtml).toContain('<title>Septrion</title>');
  });

  it('should have apple-mobile-web-app-title "Septrion"', () => {
    expect(indexHtml).toContain('content="Septrion"');
  });

  it('should link to manifest.json', () => {
    expect(indexHtml).toContain('rel="manifest"');
  });
});
