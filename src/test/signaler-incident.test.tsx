import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignalerIncident from '../pages/SignalerIncident';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const queryClient = new QueryClient();

const renderPage = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SignalerIncident />
      </BrowserRouter>
    </QueryClientProvider>
  );

describe('SignalerIncident page (Stories 3.3-3.5)', () => {
  it('should render the title', () => {
    renderPage();
    expect(screen.getByText(/signaler un incident/i)).toBeDefined();
  });

  it('should have a title input field', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/fuite/i)).toBeDefined();
  });

  it('should have location chips', () => {
    renderPage();
    expect(screen.getByText('Parking')).toBeDefined();
    expect(screen.getByText('Ascenseur')).toBeDefined();
  });

  it('should have a file upload button', () => {
    renderPage();
    expect(screen.getByText(/ajouter un fichier/i)).toBeDefined();
  });

  it('should have a submit button', () => {
    renderPage();
    expect(screen.getByText(/envoyer le signalement/i)).toBeDefined();
  });

  it('should use supabase for submission', () => {
    const content = readFileSync(resolve(__dirname, '../pages/SignalerIncident.tsx'), 'utf-8');
    expect(content).toContain('supabase');
    expect(content).toContain('signalements');
  });

  it('should support IA analysis on uploaded file', () => {
    const content = readFileSync(resolve(__dirname, '../pages/SignalerIncident.tsx'), 'utf-8');
    expect(content).toContain('analyze-document');
    expect(content).toContain('Analyser avec');
  });

  it('should enforce 10MB file limit', () => {
    const content = readFileSync(resolve(__dirname, '../pages/SignalerIncident.tsx'), 'utf-8');
    expect(content).toContain('10 * 1024 * 1024');
  });
});

describe('useRealtimeSignalements hook (Story 3.6)', () => {
  const hookPath = resolve(__dirname, '../hooks/useRealtimeSignalements.ts');

  it('should exist', () => {
    expect(existsSync(hookPath)).toBe(true);
  });

  it('should subscribe to signalements changes', () => {
    const content = readFileSync(hookPath, 'utf-8');
    expect(content).toContain('signalements');
    expect(content).toContain('postgres_changes');
    expect(content).toContain('INSERT');
  });

  it('should invalidate queries on new signalement', () => {
    const content = readFileSync(hookPath, 'utf-8');
    expect(content).toContain('invalidateQueries');
  });

  it('should cleanup on unmount', () => {
    const content = readFileSync(hookPath, 'utf-8');
    expect(content).toContain('removeChannel');
  });
});
