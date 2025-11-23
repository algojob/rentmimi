import React from 'react';
import { ClientTab } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { SearchIcon } from './icons/SearchIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { UserIcon } from './icons/UserIcon';

interface ClientBottomNavProps {
  activeTab: ClientTab;
  setActiveTab: (tab: ClientTab) => void;
}

const ClientBottomNav: React.FC<ClientBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: '홈', icon: <HomeIcon className="w-6 h-6" /> },
    { id: 'find', label: '미미 찾기', icon: <SearchIcon className="w-6 h-6" /> },
    { id: 'booking', label: '예약', icon: <CalendarIcon className="w-6 h-6" /> },
    { id: 'chat', label: '채팅', icon: <ChatBubbleIcon className="w-6 h-6" /> },
    { id: 'mypage', label: '마이페이지', icon: <UserIcon className="w-6 h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around max-w-2xl mx-auto">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ClientTab)}
              className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
                activeTab === item.id
                  ? 'text-primary-pink'
                  : 'text-gray-500 hover:text-primary-pink'
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

export default ClientBottomNav;