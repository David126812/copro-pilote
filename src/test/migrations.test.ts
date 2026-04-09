import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('Migration: coproprietes table', () => {
  const migrationPath = resolve(__dirname, '../../supabase/migrations/002_coproprietes.sql');

  it('should exist', () => {
    expect(existsSync(migrationPath)).toBe(true);
  });

  it('should create coproprietes table', () => {
    const sql = readFileSync(migrationPath, 'utf-8');
    expect(sql).toContain('create table');
    expect(sql.toLowerCase()).toContain('coproprietes');
  });

  it('should have required columns', () => {
    const sql = readFileSync(migrationPath, 'utf-8').toLowerCase();
    expect(sql).toContain('name');
    expect(sql).toContain('lots_count');
    expect(sql).toContain('created_at');
  });

  it('should enable RLS', () => {
    const sql = readFileSync(migrationPath, 'utf-8').toLowerCase();
    expect(sql).toContain('row level security');
  });
});

describe('Migration: profiles table', () => {
  const migrationPath = resolve(__dirname, '../../supabase/migrations/003_profiles.sql');

  it('should exist', () => {
    expect(existsSync(migrationPath)).toBe(true);
  });

  it('should create profiles table', () => {
    const sql = readFileSync(migrationPath, 'utf-8');
    expect(sql).toContain('create table');
    expect(sql.toLowerCase()).toContain('profiles');
  });

  it('should have required columns', () => {
    const sql = readFileSync(migrationPath, 'utf-8').toLowerCase();
    expect(sql).toContain('first_name');
    expect(sql).toContain('copro_id');
    expect(sql).toContain('whatsapp_phone');
    expect(sql).toContain('email');
    expect(sql).toContain('notification_consent');
  });

  it('should reference auth.users', () => {
    const sql = readFileSync(migrationPath, 'utf-8').toLowerCase();
    expect(sql).toContain('auth.users');
  });

  it('should enable RLS', () => {
    const sql = readFileSync(migrationPath, 'utf-8').toLowerCase();
    expect(sql).toContain('row level security');
  });
});
