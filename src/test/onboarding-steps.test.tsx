import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StepInstallPWA } from '../components/onboarding/StepInstallPWA';
import { StepWhatsApp } from '../components/onboarding/StepWhatsApp';
import { StepPremierDoc } from '../components/onboarding/StepPremierDoc';

describe('StepInstallPWA', () => {
  it('should render install instructions', () => {
    render(<StepInstallPWA onNext={() => {}} />);
    expect(screen.getAllByText(/installer/i).length).toBeGreaterThan(0);
  });

  it('should show iOS instructions', () => {
    render(<StepInstallPWA onNext={() => {}} />);
    expect(screen.getByText(/iphone/i)).toBeDefined();
  });

  it('should show Android instructions', () => {
    render(<StepInstallPWA onNext={() => {}} />);
    expect(screen.getByText(/android/i)).toBeDefined();
  });

  it('should call onNext on button click', () => {
    const onNext = vi.fn();
    render(<StepInstallPWA onNext={onNext} />);
    fireEvent.click(screen.getByText("C'est fait"));
    expect(onNext).toHaveBeenCalledOnce();
  });
});

describe('StepWhatsApp', () => {
  it('should render WhatsApp instructions', () => {
    render(<BrowserRouter><StepWhatsApp onNext={() => {}} /></BrowserRouter>);
    expect(screen.getByText(/connecter whatsapp/i)).toBeDefined();
  });

  it('should display the WhatsApp number', () => {
    render(<BrowserRouter><StepWhatsApp onNext={() => {}} /></BrowserRouter>);
    expect(screen.getByText(/\+15551852563/)).toBeDefined();
  });

  it('should have a copy button', () => {
    render(<BrowserRouter><StepWhatsApp onNext={() => {}} /></BrowserRouter>);
    expect(screen.getByText('Copier')).toBeDefined();
  });

  it('should have Suivant button', () => {
    render(<BrowserRouter><StepWhatsApp onNext={() => {}} /></BrowserRouter>);
    expect(screen.getByText('Suivant')).toBeDefined();
  });
});

describe('StepPremierDoc', () => {
  it('should render the title', () => {
    render(<BrowserRouter><StepPremierDoc /></BrowserRouter>);
    expect(screen.getByText(/votre premier document/i)).toBeDefined();
  });

  it('should have upload option', () => {
    render(<BrowserRouter><StepPremierDoc /></BrowserRouter>);
    expect(screen.getByText(/uploader un document/i)).toBeDefined();
  });

  it('should have example option', () => {
    render(<BrowserRouter><StepPremierDoc /></BrowserRouter>);
    expect(screen.getByText(/utiliser un document exemple/i)).toBeDefined();
  });

  it('should have explore option', () => {
    render(<BrowserRouter><StepPremierDoc /></BrowserRouter>);
    expect(screen.getByText(/explorer d'abord/i)).toBeDefined();
  });
});
