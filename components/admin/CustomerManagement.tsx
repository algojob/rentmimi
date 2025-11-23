
import React, { useState, useMemo } from 'react';
import { User, Booking } from '../../types';
import { StarIcon } from '../icons/StarIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

// Re-using ToggleSwitch from MimiManagement
const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; label: string; }> = ({ checked, onChange, label }) => (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`block w-12 h-6 rounded-full ${checked ? 'bg-primary-pink' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
      </div>
      <div className="ml-3 text-sm font-medium text-gray-700">{label}</div>
    </label>
);

interface CustomerManagementProps {
  users: User[];
  bookings: Booking[];
  onToggleReviewFeature: (bookingId: string) => void;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ users, bookings, onToggleReviewFeature }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<User | null>(null);

    const clients = useMemo(() => 
        users.filter(user => 
            user.roles.includes('client') &&
            (user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm))
        ), 
    [users, searchTerm]);
    
    const selectedClientBookings = useMemo(() => 
        selectedClient ? bookings.filter(b => b.user.phone === selectedClient.phone).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [],
    [bookings, selectedClient]);
    
    const selectedClientReviews = useMemo(() =>
        selectedClientBookings.filter(b => b.review),
    [selectedClientBookings]);

    if (selectedClient) {
        return (
             <div className="container mx-auto px-4 py-6 space-y-6">
                <div>
                    <button onClick={() => setSelectedClient(null)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-accent-navy mb-4">
                        <ChevronDownIcon className="w-5 h-5 rotate-90" />
                        <span>전체 고객 목록으로 돌아가기</span>
                    </button>
                    <h1 className="text-2xl font-bold text-accent-navy">{selectedClient.nickname} 님의 정보</h1>
                    <p className="text-gray-500">{selectedClient.phone}</p>
                </div>

                 {/* Booking History */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-accent-navy mb-4">데이트 기록</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {selectedClientBookings.length > 0 ? selectedClientBookings.map(booking => (
                            <div key={booking.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{booking.date} @ {booking.time} (w/ {booking.mimi?.nickname || '미배정'})</p>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                        booking.status === 'completed' ? 'bg-gray-200 text-gray-800' :
                                        booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                    }`}>{booking.status}</span>
                                </div>
                                <p className="text-gray-600 mt-1">{booking.location} / {booking.plan} 플랜</p>
                                {booking.mimiReview && (
                                    <div className="border-t mt-2 pt-2 border-gray-200">
                                        <p className="text-xs font-bold text-gray-500">미미가 남긴 후기</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex">
                                                {[...Array(booking.mimiReview.rating)].map((_, i) => <StarIcon key={i} className="w-3 h-3 text-yellow-400"/>)}
                                            </div>
                                            <p className="text-xs text-gray-700 italic">"{booking.mimiReview.comment}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4">데이트 기록이 없습니다.</p>
                        )}
                    </div>
                </div>

                {/* Review Management */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-accent-navy mb-4">작성한 후기 관리</h2>
                    <div className="space-y-4">
                        {selectedClientReviews.length > 0 ? selectedClientReviews.map(booking => (
                            <div key={booking.id} className="border border-gray-200 rounded-xl p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[...Array(booking.review!.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-yellow-400"/>)}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2 italic">"{booking.review!.comment}"</p>
                                        <p className="text-xs text-gray-400 mt-2">{booking.date} 데이트</p>
                                    </div>
                                    <ToggleSwitch
                                        label="홈 화면에 표시"
                                        checked={!!booking.review!.isFeatured}
                                        onChange={() => onToggleReviewFeature(booking.id)}
                                    />
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500 text-center py-8">작성한 후기가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="container mx-auto px-4 py-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-accent-navy">고객 관리</h1>
                <p className="text-gray-500">고객을 검색하고, 데이트 기록 및 후기를 확인합니다.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <h2 className="text-xl font-bold text-accent-navy mb-4">고객 목록</h2>
                 <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="이름 또는 전화번호로 검색..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink mb-4"
                 />
                 <div className="space-y-3 max-h-96 overflow-y-auto">
                    {clients.map(client => (
                        <button 
                            key={client.phone} 
                            onClick={() => setSelectedClient(client)}
                            className="w-full flex justify-between items-center bg-gray-50 p-3 rounded-lg text-left hover:bg-gray-100 transition-colors"
                        >
                            <div>
                                <p className="font-semibold">{client.nickname}</p>
                                <p className="text-sm text-gray-500">{client.phone}</p>
                            </div>
                            <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                                {client.roles.join(', ')}
                            </span>
                        </button>
                    ))}
                    {clients.length === 0 && (
                        <p className="text-gray-500 text-center py-4">검색 결과가 없습니다.</p>
                    )}
                 </div>
            </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-accent-navy mb-4">전체 고객 후기</h2>
                <p className="text-sm text-gray-500 text-center py-8">고객 목록에서 특정 고객을 선택하여 후기를 관리하세요.</p>
            </div>
        </div>
    );
};

export default CustomerManagement;