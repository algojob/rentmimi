import React, { useState } from 'react';
import Step1_Intro from './Step1_Intro';
import Step2_Identity from './Step2_Identity';
import Step3_Account from './Step3_Account';
import Step4_Contract from './Step4_Contract';
import Step5_Review from './Step5_Review';

interface PartnerSignupFlowProps {
  onFinish: () => void;
}

const PartnerSignupFlow: React.FC<PartnerSignupFlowProps> = ({ onFinish }) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch(step) {
      case 1:
        return <Step1_Intro onNext={nextStep} />;
      case 2:
        return <Step2_Identity onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3_Account onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <Step4_Contract onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <Step5_Review onBack={prevStep} onFinish={onFinish} />;
      default:
        return <Step1_Intro onNext={nextStep} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {renderStep()}
      </div>
    </div>
  );
};

export default PartnerSignupFlow;
