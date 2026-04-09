import { useState } from "react";
import { Stepper } from "@/components/onboarding/Stepper";
import { StepExplication } from "@/components/onboarding/StepExplication";
import { StepProfil } from "@/components/onboarding/StepProfil";
import { StepInstallPWA } from "@/components/onboarding/StepInstallPWA";
import { StepWhatsApp } from "@/components/onboarding/StepWhatsApp";
import { StepPremierDoc } from "@/components/onboarding/StepPremierDoc";

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
        return <StepInstallPWA onNext={handleNext} />;
      case 4:
        return <StepWhatsApp onNext={handleNext} />;
      case 5:
        return <StepPremierDoc />;
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
