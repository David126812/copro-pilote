interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export const Stepper = ({ currentStep, totalSteps }: StepperProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div
            key={step}
            data-step={step}
            className={`rounded-full transition-all ${
              isActive
                ? "w-8 h-2 bg-primary"
                : isCompleted
                  ? "w-2 h-2 bg-primary opacity-60"
                  : "w-2 h-2 bg-muted-foreground/30"
            }`}
          />
        );
      })}
    </div>
  );
};
