import React from 'react';

interface StepProps {
  onBack: () => void;
  onFinish: () => void;
}

const Step5_Review: React.FC<StepProps> = ({ onBack, onFinish }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-accent-navy mb-4">제출 및 검토</h1>
      <p className="text-gray-600 mb-6">파트너 신청서가 제출되었습니다. 관리자 검토 후 승인 여부가 결정되며, 영업일 기준 1~2일 소요될 수 있습니다. 검토가 완료되면 알려드리겠습니다.</p>
      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 border rounded-2xl text-sm font-semibold">이전</button>
        <button 
            onClick={onFinish} 
            className="px-6 py-3 bg-accent-navy text-white font-bold rounded-2xl">
            홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default Step5_Review;
