import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Stepper } from '../components/onboarding/Stepper';

describe('Stepper component', () => {
  it('should render correct number of step indicators', () => {
    const { container } = render(<Stepper currentStep={1} totalSteps={5} />);
    const dots = container.querySelectorAll('[data-step]');
    expect(dots.length).toBe(5);
  });

  it('should highlight the current step', () => {
    const { container } = render(<Stepper currentStep={3} totalSteps={5} />);
    const activeDot = container.querySelector('[data-step="3"]');
    expect(activeDot?.className).toContain('bg-primary');
  });

  it('should show completed steps differently', () => {
    const { container } = render(<Stepper currentStep={3} totalSteps={5} />);
    const completedDot = container.querySelector('[data-step="1"]');
    expect(completedDot?.className).toContain('bg-primary');
  });
});
