import React from 'react';
import { MimiProfile } from '../types';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`block w-12 h-6 rounded-full ${checked ? 'bg-primary-pink' : 'bg-gray-300'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
    </div>
    <div className="ml-3 text-sm font-medium text-gray-700">{label}</div>
  </label>
);


interface AdminProps {
  profiles: MimiProfile[];
  onToggle: (id: number, key: 'available' | 'recommended') => void;
}

const Admin: React.FC<AdminProps> = ({ profiles, onToggle }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-accent-navy">미미 관리</h1>
        <p className="text-gray-500">'예약 가능' 및 '추천' 상태를 변경하세요.</p>
      </div>
      
      <div className="space-y-4">
        {profiles.map((mimi) => (
          <div key={mimi.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <img
              src={`https://picsum.photos/id/${mimi.imgId}/150/150`}
              alt={mimi.name}
              className="w-20 h-20 object-cover rounded-2xl"
            />
            <div className="flex-grow">
              <h3 className="font-bold text-lg">{mimi.name}, {mimi.age}</h3>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <ToggleSwitch 
                  checked={mimi.available}
                  onChange={() => onToggle(mimi.id, 'available')}
                  label="예약 가능"
                />
                <ToggleSwitch 
                  checked={mimi.recommended}
                  onChange={() => onToggle(mimi.id, 'recommended')}
                  label="추천"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
