import React from 'react';

interface StepProps {
  onNext: () => void;
}

const Step1_Intro: React.FC<StepProps> = ({ onNext }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-accent-navy mb-2">미미 되기</h1>
      <p className="text-gray-600 mb-6">Rent-Mimi의 미미가 되어 새로운 기회를 만들어보세요. 간단한 절차를 통해 등록을 완료할 수 있습니다.</p>
      <button
        onClick={onNext}
        className="w-full bg-accent-navy text-white font-bold py-3 px-6 rounded-2xl"
      >
        시작하기
      </button>
    </div>
  );
};

export default Step1_Intro;