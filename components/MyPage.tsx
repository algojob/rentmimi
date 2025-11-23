
import React from 'react';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { User } from '../types';

interface MyPageProps {
  user: User;
  onLogout: () => void;
  onApplyForPartner: () => void;
  onShowTerms: () => void;
  onShowPrivacyPolicy: () => void;
}

const MyPage: React.FC<MyPageProps> = ({ user, onLogout, onApplyForPartner, onShowTerms, onShowPrivacyPolicy }) => {
  const settingItems = [
    { label: '알림 설정', action: () => alert('알림 설정 기능은 준비 중입니다.') },
    { label: '이용규약', action: onShowTerms },
    { label: '개인정보처리방침', action: onShowPrivacyPolicy },
  ];

  const MenuItem: React.FC<{label: string, onClick: () => void}> = ({label, onClick}) => (
     <button
        onClick={onClick}
        className="w-full flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50"
      >
        <span className="font-medium text-gray-700">{label}</span>
        <ChevronDownIcon className="w-5 h-5 text-gray-400 -rotate-90" />
      </button>
  )

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Profile Header */}
      <div>
        <div className="flex items-center gap-4 mb-2">
            <UserCircleIcon className="w-20 h-20 text-gray-400" />
            <div>
              <h2 className="text-2xl font-bold">{user.nickname} 님</h2>
              <p className="text-gray-500">{user.phone}</p>
            </div>
        </div>
      </div>
      
      {/* Menu Sections */}
      <div className="space-y-6">
        <div className="space-y-2">
            <h3 className="px-4 text-sm font-semibold text-gray-500">고객 지원</h3>
             <a href="tel:010-5588-9566" className="w-full flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50">
                <span className="font-medium text-gray-700">전화 상담</span>
                <ChevronDownIcon className="w-5 h-5 text-gray-400 -rotate-90" />
            </a>
            <a href="http://qr.kakao.com/talk/TChR89h3cHVh.vin2b6Nk1sNw98-" target="_blank" rel="noopener noreferrer" className="w-full flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50">
                <span className="font-medium text-gray-700">카톡 상담하기</span>
                <ChevronDownIcon className="w-5 h-5 text-gray-400 -rotate-90" />
            </a>
        </div>

        <div className="space-y-2">
            <h3 className="px-4 text-sm font-semibold text-gray-500">설정</h3>
            {settingItems.map((item) => (
                <MenuItem key={item.label} label={item.label} onClick={item.action} />
            ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="pt-4 text-center">
        <button
            onClick={onLogout}
            className="text-sm text-gray-500 hover:text-primary-pink hover:underline"
         >
            로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;
