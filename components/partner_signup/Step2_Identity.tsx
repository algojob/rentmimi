import React from 'react';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

const Step2_Identity: React.FC<StepProps> = ({ onNext, onBack }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-accent-navy mb-4">본인 인증</h1>
      <p className="text-gray-500 mb-6">안전한 서비스 제공을 위해 본인 인증을 진행합니다.</p>
      {/* Placeholder for identity verification form */}
      <div className="space-y-4 mb-6">
        <div>
            <label className="text-sm font-medium text-gray-700">이름</label>
            <input type="text" className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-2xl" />
        </div>
         <div>
            <label className="text-sm font-medium text-gray-700">주민등록번호</label>
            <input type="text" className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-2xl" />
        </div>
      </div>
      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 border rounded-2xl text-sm font-semibold">이전</button>
        <button onClick={onNext} className="px-6 py-3 bg-accent-navy text-white font-bold rounded-2xl">다음</button>
      </div>
    </div>
  );
};

export default Step2_Identity;
