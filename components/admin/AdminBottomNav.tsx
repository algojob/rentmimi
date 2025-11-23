import React from 'react';
import { AdminTab } from '../../types';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { StarIcon } from '../icons/StarIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { IdentificationIcon } from '../icons/IdentificationIcon';

interface AdminBottomNavProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const AdminBottomNav: React.FC<AdminBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: <ChartBarIcon className="w-6 h-6" /> },
    { id: 'bookings', label: '예약 관리', icon: <DocumentTextIcon className="w-6 h-6" /> },
    { id: 'mimis', label: '미미 관리', icon: <StarIcon className="w-6 h-6" /> },
    { id: 'payouts', label: '정산 관리', icon: <CreditCardIcon className="w-6 h-6" /> },
    { id: 'customermanagement', label: '고객 관리', icon: <IdentificationIcon className="w-6 h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around max-w-2xl mx-auto">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
                activeTab === item.id
                  ? 'text-gray-800'
                  : 'text-gray-500 hover:text-gray-800'
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

export default AdminBottomNav;