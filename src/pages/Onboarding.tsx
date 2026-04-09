import { useState } from "react";
import { Stepper } from "@/components/onboarding/Stepper";
import { StepExplication } from "@/components/onboarding/StepExplication";
import { StepProfil } from "@/components/onboarding/StepProfil";

const TOTAL_STEPS = 5;

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepExplication onNext={handleNext} />;
      case 2:
        return <StepProfil onNext={handleNext} />;
      case 3:
        return <div className="flex-1 flex items-center justify-center text-muted-foreground">Étape 3 — Installation PWA (Story 2.3)</div>;
      case 4:
        return <div className="flex-1 flex items-center justify-center text-muted-foreground">Étape 4 — WhatsApp (Story 2.4)</div>;
      case 5:
        return <div className="flex-1 flex items-center justify-center text-muted-foreground">Étape 5 — Premier document (Story 2.5)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
      <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      {renderStep()}
    </div>
  );
};

export default Onboarding;
