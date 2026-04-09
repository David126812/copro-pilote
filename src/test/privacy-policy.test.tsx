import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrivacyPolicy from '../pages/PrivacyPolicy';

describe('Privacy Policy page', () => {
  it('should render the title', () => {
    render(<BrowserRouter><PrivacyPolicy /></BrowserRouter>);
    expect(screen.getByText('Politique de confidentialité')).toBeDefined();
  });

  it('should mention RGPD', () => {
    render(<BrowserRouter><PrivacyPolicy /></BrowserRouter>);
    expect(screen.getAllByText(/RGPD/).length).toBeGreaterThan(0);
  });

  it('should mention AI transparency', () => {
    render(<BrowserRouter><PrivacyPolicy /></BrowserRouter>);
    expect(screen.getAllByText(/intelligence artificielle/i).length).toBeGreaterThan(0);
  });

  it('should list sub-processors', () => {
    render(<BrowserRouter><PrivacyPolicy /></BrowserRouter>);
    expect(screen.getAllByText(/Supabase/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Anthropic/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Resend/).length).toBeGreaterThan(0);
  });
});
