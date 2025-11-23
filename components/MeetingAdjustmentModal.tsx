
import React, { useState } from 'react';
import { Booking, MeetingAdjustment } from '../../types';

interface MeetingAdjustmentModalProps {
  booking: Booking;
  userRole: 'client' | 'mimi';
  onClose: () => void;
  onSubmit: (request: Omit<MeetingAdjustment, 'status' | 'requestedAt' | 'requester'>) => void;
}

const MeetingAdjustmentModal: React.FC<MeetingAdjustmentModalProps> = ({ booking, userRole, onClose, onSubmit }) => {
  const [type, setType] = useState<'time' | 'location' | null>(null);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) {
        alert('요청 유형을 선택해주세요.');
        return;
    }
    if (type === 'time' && !time) {
        alert('예상 지각 시간을 선택해주세요.');
        return;
    }
    if (type === 'location' && !location.trim()) {
        alert('변경할 장소를 입력해주세요.');
        return;
    }
    onSubmit({
      type,
      details: {
        time: type === 'time' ? time : undefined,
        location: type === 'location' ? location : undefined,
        reason,
      },
    });
  };

  const renderFormContent = () => {
    if (!type) {
      return (
        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => setType('time')} className="p-4 border-2 rounded-xl text-center font-semibold hover:border-primary-pink">
            ⏰ 늦을 것 같아요
          </button>
          <button type="button" onClick={() => setType('location')} className="p-4 border-2 rounded-xl text-center font-semibold hover:border-primary-pink">
            📍 장소 변경이 필요해요
          </button>
        </div>
      );
    }

    if (type === 'time') {
      return (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 text-center">예상 지각 시간</label>
          <div className="grid grid-cols-4 gap-2">
            {['5', '10', '15', '30'].map(min => (
              <button
                type="button"
                key={min}
                onClick={() => setTime(min)}
                className={`p-2 text-sm border-2 rounded-lg ${time === min ? 'border-primary-pink bg-primary-pink/10' : 'border-gray-200'}`}
              >
                {min}분
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (type === 'location') {
      return (
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">변경할 만남 장소</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="새로운 장소를 정확히 입력해주세요"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink"
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-accent-navy">시간/장소 변경 요청</h2>
            <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-800">닫기</button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <p className="font-semibold text-accent-navy">변경할 내용을 선택하고</p>
            <p className="text-sm text-gray-600">상대방의 동의를 얻어주세요.</p>
          </div>
          
          {renderFormContent()}
          
          {type && (
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">간단한 사유 (선택)</label>
              <input
                id="reason"
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="예: 차가 많이 막혀요."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink"
              />
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            {type && <button type="button" onClick={() => setType(null)} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">이전</button>}
            <button 
                type="submit" 
                disabled={!type}
                className="px-4 py-2 text-sm font-bold text-white bg-primary-pink rounded-lg hover:bg-opacity-90 disabled:bg-gray-300"
            >
              요청 보내기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingAdjustmentModal;