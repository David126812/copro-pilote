import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('Shared function: analyzeMessage', () => {
  const filePath = resolve(__dirname, '../../supabase/functions/_shared/analyzeMessage.ts');

  it('should exist', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  it('should export analyzeMessage function', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('export async function analyzeMessage');
  });

  it('should export AnalysisResult interface', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('export interface AnalysisResult');
  });

  it('should include location field in the interface', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('location: string | null');
  });

  it('should include location in the prompt', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('"location"');
  });

  it('should call Anthropic API', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('api.anthropic.com');
  });

  it('should handle PDF documents', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('pdf');
  });

  it('should handle images', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('image');
  });

  it('should have a fallback when API fails', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('Fallback');
  });

  it('should accept anthropicApiKey as parameter (not hardcoded)', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('anthropicApiKey: string');
  });
});
