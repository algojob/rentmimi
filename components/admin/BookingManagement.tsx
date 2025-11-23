
import React, { useState, useMemo } from 'react';
import { Booking, PartnerApplication } from '../../types';
import { UsersIcon } from '../icons/UsersIcon';

interface BookingManagementProps {
    bookings: Booking[];
    onUpdateStatus: (bookingId: string, status: 'awaiting_payment' | 'approved' | 'rejected' | 'completed') => void;
    partnerApplications: PartnerApplication[];
    onAssignMimi: (bookingId: string, partnerId: string) => void;
}

const DATE_OPTIONS_MAP: { [key: string]: string } = {
    instantPhotos: '즉석사진',
    handHolding: '손잡기&팔짱',
    pool: '수영장',
    outfit: '복장지정',
    drive: '드라이브',
};

const BookingManagement: React.FC<BookingManagementProps> = ({ bookings, onUpdateStatus, partnerApplications, onAssignMimi }) => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [showCompleted, setShowCompleted] = useState<boolean>(false);
    const [assigningBookingId, setAssigningBookingId] = useState<string | null>(null);
    const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');

    const getStatusBadge = (status: Booking['status']) => {
        switch (status) {
            case 'pending':
                return <span className="text-xs font-semibold text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full">미미 승인대기</span>;
            case 'awaiting_payment':
                return <span className="text-xs font-semibold text-blue-800 bg-blue-200 px-2 py-1 rounded-full">일정 조율중 (입금대기)</span>;
            case 'approved':
                return <span className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full">예약 확정</span>;
            case 'rejected':
                return <span className="text-xs font-semibold text-red-800 bg-red-200 px-2 py-1 rounded-full">거절됨</span>;
            case 'completed':
                 return <span className="text-xs font-semibold text-gray-800 bg-gray-200 px-2 py-1 rounded-full">완료됨</span>;
            default:
                return null;
        }
    };

    const filteredBookings = useMemo(() => {
        return bookings
            .filter(b => {
                const dateMatch = !selectedDate || b.date === selectedDate;
                const statusMatch = showCompleted || b.status !== 'completed';
                return dateMatch && statusMatch;
            })
            .sort((a, b) => {
                const aDateTime = new Date(`${a.date}T${a.time}`);
                const bDateTime = new Date(`${b.date}T${b.time}`);
                return aDateTime.getTime() - bDateTime.getTime();
            });
    }, [bookings, selectedDate, showCompleted]);

    const handleAssignSubmit = (bookingId: string) => {
        if (!selectedPartnerId) return;
        onAssignMimi(bookingId, selectedPartnerId);
        setAssigningBookingId(null);
        setSelectedPartnerId('');
    };

    const availablePartners = partnerApplications.filter(app => app.formData.availableForBooking);
    
  return (
    <div className="container mx-auto px-4 py-6">
       <div className="mb-6">
        <h1 className="text-2xl font-bold text-accent-navy">예약 관리</h1>
        <p className="text-gray-500">일자별 예약을 확인하고 필터링합니다.</p>
      </div>

       <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-end sm:justify-between sm:gap-4">
            <div className="flex-grow">
                <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">날짜 선택</label>
                <div className="flex">
                    <input 
                        type="date"
                        id="date-filter"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-pink"
                    />
                    <button
                        onClick={() => setSelectedDate('')}
                        className="px-4 py-2 bg-gray-200 text-sm font-semibold text-gray-600 rounded-r-lg hover:bg-gray-300"
                    >
                        전체보기
                    </button>
                </div>
            </div>
            <div className="flex items-center">
                <label className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input 
                        type="checkbox" 
                        checked={showCompleted}
                        onChange={e => setShowCompleted(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-pink focus:ring-primary-pink"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-600">완료된 예약 포함</span>
                </label>
            </div>
        </div>

      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
            {filteredBookings.map(booking => {
                const selectedOptions = Object.entries(booking.options)
                    .filter(([, value]) => value)
                    .map(([key]) => DATE_OPTIONS_MAP[key])
                    .join(', ');

                return (
                <div key={booking.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <p className="font-bold">{booking.user.nickname} <span className="text-sm font-normal text-gray-500">({booking.user.phone})</span></p>
                            <p className="text-sm text-gray-600">{booking.date} @ {booking.time}</p>
                        </div>
                        {getStatusBadge(booking.status)}
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                        <p><span className="font-semibold">장소:</span> {booking.location}</p>
                        <p><span className="font-semibold">요금제:</span> {booking.plan} ({booking.duration}시간)</p>
                        <p><span className="font-semibold">옵션:</span> {selectedOptions || '없음'}</p>
                        <p><span className="font-semibold">총액:</span> {booking.totalCost.toLocaleString()}원</p>
                        {booking.details && <p><span className="font-semibold">내용:</span> {booking.details}</p>}
                        {booking.mimi ? (
                            <p className="mt-2 pt-2 border-t border-gray-200"><span className="font-semibold text-primary-pink">배정된 미미:</span> {booking.mimi.nickname}</p>
                        ) : (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg flex items-center justify-between">
                                    <span className="font-bold text-xs">⚠️ 미미 미지정 예약</span>
                                    {assigningBookingId !== booking.id && (
                                        <button 
                                            onClick={() => setAssigningBookingId(booking.id)}
                                            className="text-xs bg-white border border-red-200 px-2 py-1 rounded shadow-sm hover:bg-red-50"
                                        >
                                            배정하기
                                        </button>
                                    )}
                                </div>
                                {assigningBookingId === booking.id && (
                                    <div className="mt-2 flex gap-2">
                                        <select 
                                            className="flex-grow px-2 py-1.5 border border-gray-300 rounded text-sm"
                                            value={selectedPartnerId}
                                            onChange={e => setSelectedPartnerId(e.target.value)}
                                        >
                                            <option value="">미미 선택...</option>
                                            {availablePartners.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.formData.name} ({p.formData.region})
                                                </option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={() => handleAssignSubmit(booking.id)}
                                            disabled={!selectedPartnerId}
                                            className="px-3 py-1.5 bg-accent-navy text-white text-xs font-bold rounded disabled:bg-gray-300"
                                        >
                                            확인
                                        </button>
                                        <button 
                                            onClick={() => setAssigningBookingId(null)}
                                            className="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-bold rounded"
                                        >
                                            취소
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                   <div className="flex justify-end gap-2 mt-3">
                        {/* Only allow approval/payment request if Mimi is assigned */}
                        {booking.status === 'pending' && booking.mimi && (
                             <button 
                                onClick={() => onUpdateStatus(booking.id, 'awaiting_payment')}
                                className="px-4 py-1.5 text-sm font-semibold text-white bg-primary-pink rounded-lg hover:opacity-90"
                            >
                                일정 승인 (입금요청)
                            </button>
                        )}
                        {booking.status === 'awaiting_payment' && (
                            <button 
                                onClick={() => onUpdateStatus(booking.id, 'approved')}
                                className="px-4 py-1.5 text-sm font-semibold text-green-600 bg-green-100 rounded-lg hover:bg-green-200"
                            >
                                결제 확인
                            </button>
                        )}
                         {booking.status === 'approved' && (
                            <button 
                                onClick={() => onUpdateStatus(booking.id, 'completed')}
                                className="px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200"
                            >
                                데이트 종료
                            </button>
                        )}
                   </div>
                </div>
            )})}
        </div>
      ) : (
         <div className="text-center py-16 text-gray-500">
            <p>선택한 조건에 해당하는 예약이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
