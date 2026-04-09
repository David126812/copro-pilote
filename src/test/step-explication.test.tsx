import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepExplication } from '../components/onboarding/StepExplication';

describe('StepExplication component', () => {
  it('should render the title', () => {
    render(<StepExplication onNext={() => {}} />);
    expect(screen.getByText(/comment ça marche/i)).toBeDefined();
  });

  it('should render the explanation text', () => {
    render(<StepExplication onNext={() => {}} />);
    expect(screen.getByText(/envoyez vos documents/i)).toBeDefined();
  });

  it('should have a Suivant button', () => {
    render(<StepExplication onNext={() => {}} />);
    expect(screen.getByText('Suivant')).toBeDefined();
  });

  it('should call onNext when Suivant is clicked', () => {
    const onNext = vi.fn();
    render(<StepExplication onNext={onNext} />);
    fireEvent.click(screen.getByText('Suivant'));
    expect(onNext).toHaveBeenCalledOnce();
  });
});
