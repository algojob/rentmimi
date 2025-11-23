import React from 'react';

interface MimiCardSkeletonProps {
  type?: 'list' | 'card';
}

const MimiCardSkeleton: React.FC<MimiCardSkeletonProps> = ({ type = 'card' }) => {
  if (type === 'list') {
    return (
      <div className="w-full flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
        <div className="w-24 h-24 bg-gray-200 rounded-2xl flex-shrink-0"></div>
        <div className="flex-grow space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-40 animate-pulse">
      <div className="relative aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden shadow-md"></div>
    </div>
  );
};

export default MimiCardSkeleton;