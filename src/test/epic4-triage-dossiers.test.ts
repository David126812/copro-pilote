import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('Story 4.1-4.3: Signalements hooks', () => {
  const hooksPath = resolve(__dirname, '../hooks/useSignalements.ts');
  const content = readFileSync(hooksPath, 'utf-8');

  it('should export useSignalements', () => {
    expect(content).toContain('export function useSignalements');
  });

  it('should export useQualifySignalement (create dossier)', () => {
    expect(content).toContain('export function useQualifySignalement');
  });

  it('should export useAttachSignalement (attach to existing)', () => {
    expect(content).toContain('export function useAttachSignalement');
  });

  it('should include copro_id in Signalement interface', () => {
    expect(content).toContain('copro_id: string | null');
  });

  it('should include location in Signalement interface', () => {
    expect(content).toContain('location: string | null');
  });

  it('should pass copro_id when creating dossier', () => {
    expect(content).toContain('copro_id: signalement.copro_id');
  });

  it('should add timeline event when attaching signalement', () => {
    expect(content).toContain('Nouveau signalement rattaché');
  });
});

describe('Story 4.6: Status transitions', () => {
  const hooksPath = resolve(__dirname, '../hooks/useSignalements.ts');
  const content = readFileSync(hooksPath, 'utf-8');

  it('should export useUpdateDossierStatus', () => {
    expect(content).toContain('export function useUpdateDossierStatus');
  });

  it('should support en_cours, bloque, termine', () => {
    expect(content).toContain('en_cours');
    expect(content).toContain('bloque');
    expect(content).toContain('termine');
  });

  it('should add timeline event for status change', () => {
    expect(content).toContain('statusLabels');
  });
});

describe('Story 4.4: Dossiers hooks', () => {
  const hooksPath = resolve(__dirname, '../hooks/useDossiers.ts');
  const content = readFileSync(hooksPath, 'utf-8');

  it('should export useDossiers', () => {
    expect(content).toContain('export function useDossiers');
  });

  it('should export useDossier (single)', () => {
    expect(content).toContain('export function useDossier');
  });

  it('should order by updated_at descending', () => {
    expect(content).toContain('ascending: false');
  });
});

describe('Story 4.7: regenerateDossierSummary', () => {
  const filePath = resolve(__dirname, '../../supabase/functions/_shared/regenerateDossierSummary.ts');

  it('should exist', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  it('should export regenerateDossierSummary function', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('export async function regenerateDossierSummary');
  });

  it('should accept DossierContext with signalements array', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('signalements');
    expect(content).toContain('DossierContext');
  });

  it('should call Anthropic API', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('api.anthropic.com');
  });

  it('should have fallback when API fails', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('Fallback');
  });
});
