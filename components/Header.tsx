import React from 'react';
import { HeartIcon } from './icons/HeartIcon';
import { BellIcon } from './icons/BellIcon';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer">
             <HeartIcon className="w-8 h-8 text-primary-pink" />
            <span className="text-xl font-bold text-primary-pink">Rent-Mimi</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
                <BellIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
