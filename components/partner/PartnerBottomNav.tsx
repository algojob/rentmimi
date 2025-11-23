

import React from 'react';
import { PartnerTab } from '../../types';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import { DashboardIcon } from '../icons/DashboardIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { CalendarIcon } from '../icons/CalendarIcon';


interface PartnerBottomNavProps {
  activeTab: PartnerTab;
  setActiveTab: (tab: PartnerTab) => void;
}

const PartnerBottomNav: React.FC<PartnerBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'guide', label: '가이드', icon: <BookOpenIcon className="w-6 h-6" /> },
    { id: 'dashboard', label: '대시보드', icon: <DashboardIcon className="w-6 h-6" /> },
    { id: 'reservations', label: '예약관리', icon: <ClipboardListIcon className="w-6 h-6" /> },
    { id: 'schedule', label: '스케줄', icon: <CalendarIcon className="w-6 h-6" /> },
    { id: 'analysis', label: '활동분석', icon: <TrendingUpIcon className="w-6 h-6" /> },
    { id: 'profile', label: '프로필', icon: <UserCircleIcon className="w-6 h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around max-w-2xl mx-auto">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as PartnerTab)}
              className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
                activeTab === item.id
                  ? 'text-accent-navy'
                  : 'text-gray-500 hover:text-accent-navy'
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </button>
          ))}
      </div>
    </nav>
  );
};

export default PartnerBottomNav;