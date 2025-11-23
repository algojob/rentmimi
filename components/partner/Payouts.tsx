
import React from 'react';
import { BanknotesIcon } from '../icons/BanknotesIcon';

const Payouts: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-128px)] text-center text-gray-500 p-4">
      <BanknotesIcon className="w-16 h-16 mb-4 text-gray-300" />
      <h2 className="text-xl font-bold text-gray-700">정산</h2>
      <p className="mt-2">미미 정산 관리 기능은 현재 준비 중입니다.</p>
    </div>
  );
};

export default Payouts;