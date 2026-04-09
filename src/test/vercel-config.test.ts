import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('vercel.json', () => {
  const vercelPath = resolve(__dirname, '../../vercel.json');

  it('should exist and be valid JSON', () => {
    const content = readFileSync(vercelPath, 'utf-8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it('should contain rewrites for SPA routing', () => {
    const config = JSON.parse(readFileSync(vercelPath, 'utf-8'));
    expect(config.rewrites).toBeDefined();
    expect(Array.isArray(config.rewrites)).toBe(true);
  });

  it('should rewrite all routes to index.html', () => {
    const config = JSON.parse(readFileSync(vercelPath, 'utf-8'));
    const catchAll = config.rewrites.find((r: any) => r.destination === '/index.html');
    expect(catchAll).toBeDefined();
  });
});
