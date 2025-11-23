

import React, { useState, useEffect } from 'react';
import { Booking, PartnerApplication, MimiGrade, OutfitInfo, MeetingAdjustment } from '../../types';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';
import { StarIcon } from '../icons/StarIcon';
import OutfitExchangeModal from '../OutfitExchangeModal';
import MeetingAdjustmentModal from '../MeetingAdjustmentModal';
import { ChatBubbleIcon } from '../icons/ChatBubbleIcon';

interface ReservationManagementProps {
    bookings: Booking[];
    partnerApplication?: PartnerApplication;
    onUpdateBookingStatus: (bookingId: string, status: 'awaiting_payment' | 'approved' | 'rejected') => void;
    onToggleAvailability: (applicationId: string) => void;
    onAddMimiReview: (bookingId: string, mimiReview: { rating: number; comment: string }) => void;
    onOutfitInfoSubmit: (bookingId: string, userRole: 'client' | 'mimi', outfitInfo: OutfitInfo) => void;
    onMeetingAdjustmentRequest: (bookingId: string, request: Omit<MeetingAdjustment, 'status' | 'requestedAt'>) => void;
    onMeetingAdjustmentResponse: (bookingId: string, response: 'accepted' | 'rejected') => void;
    onOpenChat: (booking: Booking) => void;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; label: string; }> = ({ checked, onChange, label }) => (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`block w-12 h-6 rounded-full ${checked ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
      </div>
      <div className="ml-3 text-sm font-medium text-gray-700">{label}</div>
    </label>
);

const DATE_OPTIONS_MAP: { [key: string]: string } = {
    instantPhotos: '즉석사진',
    handHolding: '손잡기&팔짱',
    pool: '수영장',
    outfit: '복장지정',
    drive: '드라이브',
};

const GRADE_PAY_RATE: { [key in MimiGrade]: number } = {
    BRONZE: 30000,
    SILVER: 40000,
    GOLD: 50000,
    PLATINUM: 60000,
};

const DATE_OPTIONS = [
    { key: 'instantPhotos', price: 30000 },
    { key: 'handHolding', price: 50000 },
    { key: 'pool', price: 50000 },
    { key: 'outfit', price: 50000 },
    { key: 'drive', price: 50000 },
];

const calculatePayout = (booking: Booking, partnerApplication?: PartnerApplication): number => {
    if (!partnerApplication) return 0;

    const grade = partnerApplication.formData.grade || 'BRONZE';
    const hourlyRate = GRADE_PAY_RATE[grade];
    const durationHours = parseInt(booking.duration, 10) || 0;

    const optionsPrice = DATE_OPTIONS.reduce((total, option) => {
        const key = option.key as keyof typeof booking.options;
        if (booking.options[key]) {
            return total + option.price;
        }
        return total;
    }, 0);
    
    const transportFee = 10000;

    // Formula: {(Grade Rate * Hours) + Transport Fee + Options Price} * 0.967
    const basePayout = (hourlyRate * durationHours) + transportFee + optionsPrice;
    const finalPayout = Math.floor(basePayout * 0.967);

    return finalPayout > 0 ? finalPayout : 0;
};

const InfoRow: React.FC<{label: string, value: string, isAmount?: boolean}> = ({ label, value, isAmount }) => (
    <div className="flex justify-between items-start">
        <p className="font-semibold flex-shrink-0 text-gray-600">{label}</p>
        <p className={`text-right ${isAmount ? 'font-bold text-lg text-primary-pink' : 'text-gray-800'}`}>{value}</p>
    </div>
);

const MimiReviewModal: React.FC<{
    booking: Booking;
    onClose: () => void;
    onSubmit: (review: { rating: number; comment: string }) => void;
}> = ({ booking, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('별점을 선택해주세요.');
            return;
        }
        onSubmit({ rating, comment });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-accent-navy">고객 후기 남기기</h2>
                        <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-800">닫기</button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <p className="font-semibold text-accent-navy">{booking.user.nickname}님과의 {booking.date} 데이트</p>
                        <p className="text-sm text-gray-600">고객과의 데이트는 어떠셨나요?</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">별점</label>
                        <div className="flex justify-center items-center gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button type="button" key={star} onClick={() => setRating(star)}>
                                    <StarIcon className={`w-8 h-8 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">코멘트</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            rows={4}
                            placeholder="고객에 대한 솔직한 후기를 남겨주세요."
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink"
                        />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-primary-pink text-white font-bold py-3 px-6 rounded-2xl transition-all transform hover:scale-105">
                            후기 제출하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ReservationManagement: React.FC<ReservationManagementProps> = ({ 
    bookings, partnerApplication, onUpdateBookingStatus, onToggleAvailability, 
    onAddMimiReview, onOutfitInfoSubmit, onMeetingAdjustmentRequest, onMeetingAdjustmentResponse,
    onOpenChat,
}) => {
    const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
    const [outfitExchangeBooking, setOutfitExchangeBooking] = useState<Booking | null>(null);
    const [adjustmentBooking, setAdjustmentBooking] = useState<Booking | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date().getTime());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().getTime()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const getStatusBadge = (status: Booking['status']) => {
        switch (status) {
            case 'pending':
                return <span className="text-xs font-semibold text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full">대기중</span>;
            case 'awaiting_payment':
                return <span className="text-xs font-semibold text-blue-800 bg-blue-200 px-2 py-1 rounded-full">확인중</span>;
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

    const calculateEndTime = (startTime: string, duration: string): string => {
        const [hour, minute] = startTime.split(':').map(Number);
        const durationHours = parseInt(duration, 10) || 0;
        const totalMinutes = hour * 60 + minute + durationHours * 60;
        const endHour = Math.floor(totalMinutes / 60) % 24;
        const endMinute = totalMinutes % 60;
        return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    };

    const handleReviewSubmit = (review: { rating: number; comment: string }) => {
        if (reviewingBooking) {
            onAddMimiReview(reviewingBooking.id, review);
            setReviewingBooking(null);
        }
    };
    
    const handleOutfitSubmit = (outfitInfo: OutfitInfo) => {
        if (outfitExchangeBooking) {
            onOutfitInfoSubmit(outfitExchangeBooking.id, 'mimi', outfitInfo);
            setOutfitExchangeBooking(null);
        }
    };

    const handleAdjustmentRequestSubmit = (request: Omit<MeetingAdjustment, 'status' | 'requestedAt' | 'requester'>) => {
        if(adjustmentBooking) {
            onMeetingAdjustmentRequest(adjustmentBooking.id, { ...request, requester: 'mimi' });
            setAdjustmentBooking(null);
        }
    };

    const isAvailable = partnerApplication?.formData.availableForBooking ?? true;

    const MeetingPrepCard: React.FC<{ booking: Booking }> = ({ booking }) => {
        const clientInfo = booking.outfitExchange?.client;
        const mimiInfo = booking.outfitExchange?.mimi;
        const adjustment = booking.meetingAdjustment;
        
        const renderAdjustmentStatus = () => {
            if (!adjustment) return null;
            
            if (adjustment.requester === 'mimi') {
                if (adjustment.status === 'pending') {
                    return <div className="mt-2 text-center text-xs font-semibold text-yellow-600 bg-yellow-100 p-2 rounded-lg">변경 요청을 보내고 고객님의 응답을 기다리는 중입니다.</div>;
                }
                if (adjustment.status === 'accepted') {
                     return <div className="mt-2 text-center text-xs font-semibold text-green-600 bg-green-100 p-2 rounded-lg">✅ 변경이 수락되었습니다.</div>;
                }
                 if (adjustment.status === 'rejected') {
                     return <div className="mt-2 text-center text-xs font-semibold text-red-600 bg-red-100 p-2 rounded-lg">❌ 변경이 거절되었습니다.</div>;
                }
            }

            if (adjustment.requester === 'client' && adjustment.status === 'pending') {
                const { type, details } = adjustment;
                let requestDetails = '';
                if (type === 'time' && details.time) {
                    requestDetails = `만남 시간에 ${details.time}분 늦는다고 합니다.`;
                } else if (type === 'location' && details.location) {
                    requestDetails = `만남 장소를 "${details.location}"(으)로 변경 요청했습니다.`;
                }

                 return (
                    <div className="mt-2 text-center text-xs font-bold text-yellow-800 bg-yellow-200 p-3 rounded-lg space-y-2">
                        <p>🚨 고객님이 시간/장소 변경을 요청했습니다.</p>
                        <div className="bg-yellow-100 p-2 rounded">
                            <p className="font-semibold">{requestDetails}</p>
                            {details.reason && <p className="text-xs mt-1">사유: {details.reason}</p>}
                        </div>
                        <div className="flex justify-center gap-2">
                            <button onClick={() => onMeetingAdjustmentResponse(booking.id, 'rejected')} className="px-3 py-1 bg-red-500 text-white rounded">거절</button>
                            <button onClick={() => onMeetingAdjustmentResponse(booking.id, 'accepted')} className="px-3 py-1 bg-green-500 text-white rounded">수락</button>
                        </div>
                    </div>
                );
            }

            return null;
        };
        
        return (
            <div className="bg-primary-pink/10 p-4 rounded-2xl shadow-sm border border-primary-pink/30">
                <div className="text-center mb-4">
                    <p className="font-bold text-lg text-primary-pink">💌 만남 준비!</p>
                    <p className="text-sm text-primary-pink/80">{booking.date} ({booking.time}) @ {booking.location}</p>
                </div>

                {renderAdjustmentStatus()}
                
                <div className="space-y-3 mt-3">
                    {/* Outfit Exchange */}
                    <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm font-bold text-accent-navy mb-2">🤝 의상 정보 교환</p>
                        {clientInfo && mimiInfo ? (
                             <div className="text-center text-xs font-semibold text-green-600 bg-green-100 p-2 rounded-lg">모든 정보가 교환되었습니다!</div>
                        ): (
                            <div className="grid grid-cols-2 gap-2">
                                {mimiInfo ? (
                                    <div className="text-center text-xs p-2 bg-gray-100 rounded">나의 정보 전송 완료</div>
                                ) : (
                                    <button onClick={() => setOutfitExchangeBooking(booking)} className="w-full text-xs font-semibold text-primary-pink bg-primary-pink/10 py-2 rounded-lg hover:bg-primary-pink/20">나의 의상 공유</button>
                                )}
                                {clientInfo ? (
                                     <div className="text-center text-xs p-2 bg-gray-100 rounded">고객 정보 도착!</div>
                                ) : (
                                     <div className="text-center text-xs p-2 bg-gray-100 rounded text-gray-500">고객 정보 대기중...</div>
                                )}
                            </div>
                        )}
                         {(clientInfo || mimiInfo) && (
                            <div className="mt-2 space-y-2 border-t pt-2">
                                {mimiInfo && (
                                    <div className="flex gap-2 items-start text-xs">
                                        <strong className="flex-shrink-0">나:</strong>
                                        <div className="flex-grow">
                                            <p>{mimiInfo.description}</p>
                                            {mimiInfo.photoUrl && <img src={mimiInfo.photoUrl} alt="나의 의상" className="mt-1 w-16 h-16 object-cover rounded-md" />}
                                        </div>
                                    </div>
                                )}
                                {clientInfo && (
                                    <div className="flex gap-2 items-start text-xs">
                                        <strong className="flex-shrink-0">고객:</strong>
                                        <div className="flex-grow">
                                            <p>{clientInfo.description}</p>
                                            {clientInfo.photoUrl && <img src={clientInfo.photoUrl} alt="고객 의상" className="mt-1 w-16 h-16 object-cover rounded-md" />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Meeting Adjustment */}
                     <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm font-bold text-accent-navy mb-2">⏱️ 시간/장소 조정</p>
                        <button 
                            onClick={() => setAdjustmentBooking(booking)}
                            disabled={!!adjustment && adjustment.status === 'pending'}
                            className="w-full text-xs font-semibold text-accent-navy bg-gray-200 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                            {adjustment && adjustment.status === 'pending' ? '응답 대기중...' : '변경 요청하기'}
                        </button>
                    </div>
                </div>
                 <div className="mt-3">
                    <button onClick={() => onOpenChat(booking)} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-800 text-sm font-bold rounded-lg hover:bg-green-200">
                        <ChatBubbleIcon className="w-4 h-4" /> 안심채팅방 입장
                    </button>
                </div>
            </div>
        );
    };
    
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-accent-navy">예약 관리</h1>
                <p className="text-gray-500">고객님들의 데이트 신청 내역입니다.</p>
            </div>

            <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <h2 className="text-base font-bold text-accent-navy">데이트 가능 여부 설정</h2>
                <ToggleSwitch
                    checked={isAvailable}
                    onChange={() => partnerApplication && onToggleAvailability(partnerApplication.id)}
                    label={isAvailable ? '가능' : '불가능'}
                />
            </div>
            
            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map(booking => {
                        const bookingTime = new Date(`${booking.date}T${booking.time}`).getTime();
                        const isMeetingPrepTime = booking.status === 'approved' && bookingTime > currentTime && (bookingTime - currentTime) < 3600 * 1000 * 24; // 24 hours
                        
                        if (isMeetingPrepTime) {
                           return <MeetingPrepCard key={booking.id} booking={booking} />;
                        }

                        const endTime = calculateEndTime(booking.time, booking.duration);
                        const selectedOptions = Object.entries(booking.options)
                            .filter(([, value]) => value)
                            .map(([key]) => DATE_OPTIONS_MAP[key])
                            .join(', ');
                        const payout = calculatePayout(booking, partnerApplication);

                        return (
                            <div key={booking.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold">{booking.user.nickname} 고객님</p>
                                        <p className="text-sm text-gray-600">{booking.date}</p>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
                                    <InfoRow label="만남 시간" value={`${booking.time} ~ ${endTime} (${booking.duration}시간)`} />
                                    <InfoRow label="만남 장소" value={booking.location} />
                                    <InfoRow label="데이트 옵션" value={selectedOptions || '없음'} />
                                    <InfoRow label="요청사항" value={booking.details || '없음'} />
                                    <div className="border-t my-2 border-gray-200"></div>
                                    <InfoRow label="예상 정산액" value={`${payout.toLocaleString()}원`} isAmount />
                                </div>
                                
                                {booking.mimiReview && (
                                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm mt-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-blue-800">작성한 고객 후기</span>
                                            <div className="flex">
                                                {[...Array(booking.mimiReview.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-yellow-400" />)}
                                            </div>
                                        </div>
                                        <p className="text-blue-700 italic">"{booking.mimiReview.comment}"</p>
                                    </div>
                                )}


                                <div className="flex justify-end gap-2 mt-3">
                                    {booking.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => onUpdateBookingStatus(booking.id, 'rejected')}
                                                className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
                                            >
                                                거절
                                            </button>
                                            <button
                                                onClick={() => onUpdateBookingStatus(booking.id, 'awaiting_payment')}
                                                className="px-4 py-2 text-sm font-semibold text-white bg-primary-pink rounded-lg hover:opacity-90"
                                            >
                                                일정 승인
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'completed' && !booking.mimiReview && (
                                        <button
                                            onClick={() => setReviewingBooking(booking)}
                                            className="px-4 py-2 text-sm font-semibold text-white bg-accent-navy rounded-lg hover:opacity-90"
                                        >
                                            고객 후기 남기기
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500">
                    <ClipboardListIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>아직 받은 예약 요청이 없습니다.</p>
                </div>
            )}
            {reviewingBooking && (
                <MimiReviewModal
                    booking={reviewingBooking}
                    onClose={() => setReviewingBooking(null)}
                    onSubmit={handleReviewSubmit}
                />
            )}
            {outfitExchangeBooking && (
                <OutfitExchangeModal
                    booking={outfitExchangeBooking}
                    userRole="mimi"
                    onClose={() => setOutfitExchangeBooking(null)}
                    onSubmit={handleOutfitSubmit}
                />
            )}
             {adjustmentBooking && (
                <MeetingAdjustmentModal
                    booking={adjustmentBooking}
                    userRole="mimi"
                    onClose={() => setAdjustmentBooking(null)}
                    onSubmit={handleAdjustmentRequestSubmit}
                />
            )}
        </div>
    );
};

export default ReservationManagement;