
import React, { useState } from 'react';
import { Booking, OutfitInfo } from '../../types';

interface OutfitExchangeModalProps {
  booking: Booking;
  userRole: 'client' | 'mimi';
  onClose: () => void;
  onSubmit: (outfitInfo: OutfitInfo) => void;
}

const OutfitExchangeModal: React.FC<OutfitExchangeModalProps> = ({ booking, userRole, onClose, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('의상에 대한 설명을 입력해주세요.');
      return;
    }
    onSubmit({
      description,
      photoUrl: photoPreview || undefined,
    });
  };

  const title = userRole === 'client' ? '나의 의상 정보 공유하기' : '미미 의상 정보 공유하기';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-accent-navy">{title}</h2>
            <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-800">닫기</button>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <p className="font-semibold text-accent-navy">서로를 쉽게 찾을 수 있도록</p>
            <p className="text-sm text-gray-600">오늘의 의상을 알려주세요.</p>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">의상 설명 (필수)</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="예: 파란색 맨투맨, 검정 슬랙스"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink"
            />
          </div>
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">사진 첨부 (선택)</label>
            {photoPreview && (
              <div className="mb-2">
                <img src={photoPreview} alt="의상 미리보기" className="w-24 h-24 object-cover rounded-lg" />
              </div>
            )}
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-pink/10 file:text-primary-pink hover:file:bg-primary-pink/20"
            />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-primary-pink text-white font-bold py-3 px-6 rounded-2xl transition-all transform hover:scale-105">
              정보 제출하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutfitExchangeModal;
