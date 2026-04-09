import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import Onboarding from '../pages/Onboarding';

describe('Onboarding page', () => {
  it('should render the stepper', () => {
    const { container } = render(<BrowserRouter><Onboarding /></BrowserRouter>);
    const dots = container.querySelectorAll('[data-step]');
    expect(dots.length).toBe(5);
  });

  it('should show step 1 (explication) by default', () => {
    render(<BrowserRouter><Onboarding /></BrowserRouter>);
    expect(screen.getByText(/comment ça marche/i)).toBeDefined();
  });

  it('should have Suivant button on step 1', () => {
    render(<BrowserRouter><Onboarding /></BrowserRouter>);
    expect(screen.getByText('Suivant')).toBeDefined();
  });
});

describe('Onboarding route in App.tsx', () => {
  const appPath = resolve(__dirname, '../App.tsx');
  const appContent = readFileSync(appPath, 'utf-8');

  it('should have /onboarding route', () => {
    expect(appContent).toContain('path="/onboarding"');
  });

  it('should wrap onboarding with AuthGuard', () => {
    expect(appContent).toContain('<AuthGuard><Onboarding');
  });
});
