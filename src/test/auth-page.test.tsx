import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Auth from '../pages/Auth';

const renderAuth = () =>
  render(
    <BrowserRouter>
      <Auth />
    </BrowserRouter>
  );

describe('Auth page', () => {
  it('should render the page', () => {
    renderAuth();
    expect(screen.getByText(/Septrion/i)).toBeDefined();
  });

  it('should have an email field', () => {
    renderAuth();
    expect(screen.getByPlaceholderText(/email/i)).toBeDefined();
  });

  it('should have a password field', () => {
    renderAuth();
    expect(screen.getByPlaceholderText(/mot de passe/i)).toBeDefined();
  });

  it('should have a submit button', () => {
    renderAuth();
    expect(screen.getByRole('button', { name: /créer mon compte/i })).toBeDefined();
  });

  it('should have a link to switch to login mode', () => {
    renderAuth();
    expect(screen.getByText(/déjà un compte/i)).toBeDefined();
  });
});
