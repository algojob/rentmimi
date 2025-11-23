import React from 'react';
import { MegaphoneIcon } from '../icons/MegaphoneIcon';

const Notifications: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-128px)] text-center text-gray-500 p-4">
      <MegaphoneIcon className="w-16 h-16 mb-4 text-gray-300" />
      <h2 className="text-xl font-bold text-gray-700">공지 발송</h2>
      <p className="mt-2">관리자 공지 발송 기능은 현재 준비 중입니다.</p>
    </div>
  );
};

export default Notifications;