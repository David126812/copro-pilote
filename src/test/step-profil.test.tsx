import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StepProfil } from '../components/onboarding/StepProfil';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('StepProfil component', () => {
  it('should render the title', () => {
    render(<BrowserRouter><StepProfil onNext={() => {}} /></BrowserRouter>);
    expect(screen.getByText(/votre profil/i)).toBeDefined();
  });

  it('should have a prénom field', () => {
    render(<BrowserRouter><StepProfil onNext={() => {}} /></BrowserRouter>);
    expect(screen.getByPlaceholderText(/prénom/i)).toBeDefined();
  });

  it('should have a copropriété field', () => {
    render(<BrowserRouter><StepProfil onNext={() => {}} /></BrowserRouter>);
    expect(screen.getByPlaceholderText(/résidence/i)).toBeDefined();
  });

  it('should have a WhatsApp phone field', () => {
    render(<BrowserRouter><StepProfil onNext={() => {}} /></BrowserRouter>);
    expect(screen.getByPlaceholderText(/33/)).toBeDefined();
  });

  it('should have notification consent checkbox', () => {
    render(<BrowserRouter><StepProfil onNext={() => {}} /></BrowserRouter>);
    expect(screen.getByText(/j'accepte de recevoir/i)).toBeDefined();
  });

  it('should have a disabled submit button when fields are empty', () => {
    render(<BrowserRouter><StepProfil onNext={() => {}} /></BrowserRouter>);
    const button = screen.getByText('Suivant');
    expect(button).toBeDefined();
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('StepProfil file structure', () => {
  it('should use supabase client', () => {
    const content = readFileSync(resolve(__dirname, '../components/onboarding/StepProfil.tsx'), 'utf-8');
    expect(content).toContain('supabase');
  });

  it('should update profiles table', () => {
    const content = readFileSync(resolve(__dirname, '../components/onboarding/StepProfil.tsx'), 'utf-8');
    expect(content).toContain('profiles');
  });

  it('should create coproprietes entry', () => {
    const content = readFileSync(resolve(__dirname, '../components/onboarding/StepProfil.tsx'), 'utf-8');
    expect(content).toContain('coproprietes');
  });
});
