import React from 'react';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

const Step4_Contract: React.FC<StepProps> = ({ onNext, onBack }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-accent-navy mb-4">계약서 확인 및 동의</h1>
      <div className="h-64 border rounded-lg p-4 overflow-y-auto bg-gray-50 mb-4 text-sm text-gray-600">
        <p>제 1조 (목적) 본 계약은...</p>
        <p className="mt-2">제 2조 (서비스 내용)...</p>
        {/* ... more contract text ... */}
      </div>
      <label className="flex items-center mb-6">
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-pink focus:ring-primary-pink"/>
        <span className="ml-2 text-gray-700">위 계약서 내용을 모두 확인했으며, 이에 동의합니다.</span>
      </label>
      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 border rounded-2xl text-sm font-semibold">이전</button>
        <button onClick={onNext} className="px-6 py-3 bg-accent-navy text-white font-bold rounded-2xl">다음</button>
      </div>
    </div>
  );
};

export default Step4_Contract;
