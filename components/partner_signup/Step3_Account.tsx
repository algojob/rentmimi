import React from 'react';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

const Step3_Account: React.FC<StepProps> = ({ onNext, onBack }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-accent-navy mb-4">정산 계좌 등록</h1>
       <p className="text-gray-500 mb-6">수익을 정산받을 계좌 정보를 입력해주세요.</p>
      {/* Placeholder for account form */}
      <div className="space-y-4 mb-6">
        <div>
            <label className="text-sm font-medium text-gray-700">은행</label>
            <input type="text" className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-2xl" />
        </div>
         <div>
            <label className="text-sm font-medium text-gray-700">계좌번호</label>
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

export default Step3_Account;
