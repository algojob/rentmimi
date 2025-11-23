import React from 'react';
import { LockClosedIcon } from '../icons/LockClosedIcon';

interface UnauthorizedScreenProps {
  onGoBack: () => void;
}

const UnauthorizedScreen: React.FC<UnauthorizedScreenProps> = ({ onGoBack }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-100 text-center p-4">
      <LockClosedIcon className="w-16 h-16 mb-4 text-gray-400" />
      <h1 className="text-2xl font-bold text-gray-800">이 기능은 현재 모드에서 이용할 수 없습니다.</h1>
      <p className="mt-2 text-gray-600">
        이용 가능한 다른 모드로 전환해주세요.
      </p>
      <button
        onClick={onGoBack}
        className="mt-6 bg-primary-pink text-white font-bold py-3 px-6 rounded-2xl transition-transform transform hover:scale-105"
      >
        이전 모드로 돌아가기
      </button>
    </div>
  );
};

export default UnauthorizedScreen;
