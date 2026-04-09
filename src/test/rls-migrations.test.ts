import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('Migration: add copro_id columns', () => {
  const migrationPath = resolve(__dirname, '../../supabase/migrations/004_add_copro_id.sql');

  it('should exist', () => {
    expect(existsSync(migrationPath)).toBe(true);
  });

  it('should add copro_id to dossiers', () => {
    const sql = readFileSync(migrationPath, 'utf-8').toLowerCase();
    expect(sql).toContain('dossiers');
    expect(sql).toContain('copro_id');
  });

  it('should add copro_id to signalements', () => {
    const sql = readFileSync(migrationPath, 'utf-8').toLowerCase();
    expect(sql).toContain('signalements');
  });
});

describe('Migration: add location to signalements', () => {
  const migrationPath = resolve(__dirname, '../../supabase/migrations/005_add_location.sql');

  it('should exist', () => {
    expect(existsSync(migrationPath)).toBe(true);
  });

  it('should add location column', () => {
    const sql = readFileSync(migrationPath, 'utf-8').toLowerCase();
    expect(sql).toContain('location');
    expect(sql).toContain('signalements');
  });
});

describe('Migration: RLS policies by copro', () => {
  const migrationPath = resolve(__dirname, '../../supabase/migrations/006_rls_policies.sql');

  it('should exist', () => {
    expect(existsSync(migrationPath)).toBe(true);
  });

  it('should create policies referencing profiles and copro_id', () => {
    const sql = readFileSync(migrationPath, 'utf-8').toLowerCase();
    expect(sql).toContain('policy');
    expect(sql).toContain('copro_id');
    expect(sql).toContain('profiles');
  });
});
