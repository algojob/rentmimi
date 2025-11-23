
import React, { useState, useMemo, useEffect } from 'react';
import { Booking, PartnerApplication, User, OutfitInfo, MeetingAdjustment } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { ClipboardCopyIcon } from './icons/ClipboardCopyIcon';
import { StarIcon } from './icons/StarIcon';
import OutfitExchangeModal from './OutfitExchangeModal';
import MeetingAdjustmentModal from './MeetingAdjustmentModal';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';


interface BookingProps {
    userBookings: Booking[];
    onNewBooking: (bookingData: Omit<Booking, 'id' | 'user' | 'status' | 'mimi'>, mimi?: User) => void;
    onUpdateBooking: (updatedBooking: Booking) => void;
    onAddReview: (bookingId: string, review: { rating: number; comment: string }) => void;
    onOutfitInfoSubmit: (bookingId: string, userRole: 'client' | 'mimi', outfitInfo: OutfitInfo) => void;
    mimiToBook?: PartnerApplication | null;
    onBookingFlowComplete?: () => void;
    onMeetingAdjustmentRequest: (bookingId: string, request: Omit<MeetingAdjustment, 'status' | 'requestedAt'>) => void;
    onMeetingAdjustmentResponse: (bookingId: string, response: 'accepted' | 'rejected') => void;
    onOpenChat: (booking: Booking) => void;
}


const PLANS = [
  { key: 'FRESH', name: 'FRESH', price: 50000 },
  { key: 'SPECIAL', name: 'SPECIAL', price: 60000 },
  { key: 'PREMIUM', name: 'PREMIUM', price: 70000 },
  { key: 'THE_BLACK', name: 'THE BLACK', price: 150000 },
];

const DATE_OPTIONS = [
    { key: 'instantPhotos', label: '즉석사진 (인생네컷, 포토이즘 등)', price: 30000 },
    { key: 'handHolding', label: '데이트장소 이동시 손잡기 & 팔짱끼기', price: 50000 },
    { key: 'pool', label: '수영장', price: 50000 },
    { key: 'outfit', label: '복장지정', price: 50000 },
    { key: 'drive', label: '드라이브', price: 50000 },
];

const PaymentInstructions: React.FC<{ bookingData: Omit<Booking, 'id'|'user'|'status'>, onConfirm: () => void }> = ({ bookingData, onConfirm }) => {
    const [isCopied, setIsCopied] = useState(false);
    const accountNumber = '3333249339555';
    const bankName = '카카오뱅크';
    const accountHolder = '다잇당(강경환)';

    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }, () => {
            alert('계좌번호 복사에 실패했습니다.');
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center animate-fade-in">
            <h1 className="text-2xl font-bold text-accent-navy mb-4">입금 안내</h1>
            <p className="text-gray-600 mb-6 px-4">
                {`${accountNumber} ${bankName} ${accountHolder}`}으로 <strong className="text-primary-pink">{bookingData.totalCost.toLocaleString()}원</strong> 입금해주시면 예약확정 및 진행 도와드리겠습니다 😸
            </p>
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-500">입금 계좌</p>
                <p className="text-lg font-bold text-accent-navy my-1">{`${bankName} ${accountNumber}`}</p>
                <p className="text-sm text-gray-600">{`예금주: ${accountHolder}`}</p>
                <button
                    onClick={handleCopy}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    <ClipboardCopyIcon className="w-4 h-4" />
                    {isCopied ? '복사 완료!' : '계좌번호 복사'}
                </button>
            </div>
            <button
                onClick={onConfirm}
                className="w-full bg-primary-pink text-white font-bold py-3 px-6 rounded-2xl transition-all transform hover:scale-105"
            >
                확인
            </button>
        </div>
    );
};

const ExtensionForm: React.FC<{
    booking: Booking;
    onSubmit: (data: { extensionHours: number; totalCost: number }) => void;
    onCancel: () => void;
}> = ({ booking, onSubmit, onCancel }) => {
    const [extensionHours, setExtensionHours] = useState<number>(0);

    const originalPlan = useMemo(() => PLANS.find(p => p.key === booking.plan), [booking.plan]);
    const hourlyRate = originalPlan ? originalPlan.price : 0;
    const totalCost = extensionHours * hourlyRate;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (extensionHours > 0) {
            onSubmit({ extensionHours, totalCost });
        } else {
            alert('연장 시간을 선택해주세요.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-bold text-accent-navy">데이트 연장하기</h1>
                 <button type="button" onClick={onCancel} className="text-sm font-semibold text-gray-600 hover:text-gray-800">취소</button>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">기존 예약 정보</p>
                <p className="font-semibold text-accent-navy mt-1">{booking.date} @ {booking.time} / {booking.location}</p>
                <p className="text-sm text-gray-600">{booking.plan} 플랜 ({hourlyRate.toLocaleString()}원/시간)</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연장 시간 선택</label>
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(hour => (
                        <button
                            type="button"
                            key={hour}
                            onClick={() => setExtensionHours(hour)}
                            className={`text-center p-4 rounded-xl border-2 transition-all ${extensionHours === hour ? 'border-primary-pink bg-primary-pink/10 ring-2 ring-primary-pink' : 'border-gray-200 hover:border-primary-pink/50'}`}
                        >
                            <p className="font-bold text-lg text-accent-navy">{hour}시간</p>
                        </button>
                    ))}
                </div>
            </div>
             <div className="border-t pt-6">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-700">연장 예상 금액</span>
                    <span className="text-primary-pink">{totalCost.toLocaleString()}원</span>
                </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={extensionHours === 0}
                className="w-full bg-primary-pink text-white font-bold py-3 px-6 rounded-2xl transition-all transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                연장 요청하기
              </button>
            </div>
        </form>
    );
};

const ReviewModal: React.FC<{
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-accent-navy">후기 남기기</h2>
                        <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-800">닫기</button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <p className="font-semibold text-accent-navy">{booking.date} 데이트</p>
                        <p className="text-sm text-gray-600">미미와의 데이트는 어떠셨나요?</p>
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
                            placeholder="솔직한 후기를 남겨주세요."
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


const BookingForm: React.FC<{ 
    onSubmit: (data: Omit<Booking, 'id' | 'user' | 'status' | 'mimi'>) => void, 
    onCancel: () => void, 
    mimiToBook?: PartnerApplication | null, 
    initialData?: Booking | null 
}> = ({ onSubmit, onCancel, mimiToBook, initialData }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const getInitialFormData = () => ({
        date: '',
        time: '14:00',
        duration: '2',
        plan: 'PREMIUM', // Default plan
        location: '',
        details: '',
        options: {
            instantPhotos: false, handHolding: false, pool: false, outfit: false, drive: false,
        },
        agreeToTerms: false,
    });
    
    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (initialData) {
            setFormData({
                date: initialData.date,
                time: initialData.time,
                duration: initialData.duration,
                plan: initialData.plan,
                location: initialData.location,
                details: initialData.details,
                options: { ...initialData.options },
                agreeToTerms: true,
            });
        } else if (mimiToBook) {
            // Pre-fill defaults or specific partner requirements if any, but allow changes
            setFormData(prev => ({ ...prev, plan: 'PREMIUM' }));
        } else {
            setFormData(getInitialFormData());
        }
    }, [initialData, mimiToBook]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, options: { ...prev.options, [name]: checked } }));
    };

    const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }));
    };

    const handlePlanChange = (planKey: string) => {
        setFormData(prev => ({ ...prev, plan: planKey }));
    };

    const totalCost = useMemo(() => {
        const selectedPlan = PLANS.find(p => p.key === formData.plan);
        const planPrice = selectedPlan ? selectedPlan.price : 0;
        const durationHours = parseInt(formData.duration, 10) || 0;

        const baseCost = planPrice * durationHours;

        const optionsPrice = DATE_OPTIONS.reduce((total, option) => {
            if (formData.options[option.key as keyof typeof formData.options]) {
                return total + option.price;
            }
            return total;
        }, 0);

        return baseCost + optionsPrice;
    }, [formData.plan, formData.duration, formData.options]);
    
    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.agreeToTerms) {
            alert('이용규약에 동의해야 예약이 가능합니다.');
            return;
        }

        // Schedule Validation
        if (mimiToBook && mimiToBook.formData.availableDates && mimiToBook.formData.availableDates.length > 0) {
            if (!mimiToBook.formData.availableDates.includes(formData.date)) {
                alert(`선택하신 날짜(${formData.date})는 미미님의 지정된 일정에 포함되지 않습니다. 프로필의 예약 가능일을 확인해주세요.`);
                return;
            }
        }

        onSubmit({ ...formData, totalCost });
    };

    const isStep1Valid = formData.date && formData.time && formData.duration && formData.location;
    const isStep2Valid = formData.plan;

    const renderStepContent = () => {
        switch (step) {
            case 1: // Date, Time, Location
                return (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-accent-navy">1. 날짜 및 장소 선택</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                                <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                                <input type="time" id="time" name="time" value={formData.time} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-lg" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">데이트 시간</label>
                            <select id="duration" name="duration" value={formData.duration} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-lg">
                                {[...Array(7)].map((_, i) => <option key={i+2} value={i+2}>{i+2}시간</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">만남 장소</label>
                            <input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="예: 강남역 11번 출구" required className="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>
                );
            case 2: // Plan and Options
                return (
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg text-accent-navy">2. 플랜 및 옵션 선택</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">플랜 선택</label>
                            <div className="grid grid-cols-2 gap-2">
                                {PLANS.map(plan => (
                                    <button type="button" key={plan.key} onClick={() => handlePlanChange(plan.key)}
                                        className={`p-3 border-2 rounded-lg text-left ${formData.plan === plan.key ? 'border-primary-pink bg-primary-pink/10' : 'border-gray-200'}`}>
                                        <p className="font-bold">{plan.name}</p>
                                        <p className="text-xs">{plan.price.toLocaleString()}원/시간</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">데이트 옵션</label>
                            <div className="space-y-2">
                                {DATE_OPTIONS.map(option => (
                                    <label key={option.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <span className="text-sm font-medium text-gray-800">{option.label}</span>
                                            <span className="text-xs text-primary-pink ml-2">+{option.price.toLocaleString()}원</span>
                                        </div>
                                        <input type="checkbox" name={option.key} checked={formData.options[option.key as keyof typeof formData.options]} onChange={handleCheckboxChange} className="h-5 w-5 rounded border-gray-300 text-primary-pink focus:ring-primary-pink" />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 3: // Details and Confirmation
                 return (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-accent-navy">3. 세부 정보 및 확인</h3>
                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">요청사항</label>
                            <textarea id="details" name="details" value={formData.details} onChange={handleInputChange} rows={3} placeholder="원하는 데이트 컨셉이나 미미에게 바라는 점을 자유롭게 적어주세요." className="w-full p-2 border border-gray-300 rounded-lg"></textarea>
                        </div>
                        <div className="p-4 bg-primary-pink/10 rounded-lg space-y-2">
                            <div className="flex justify-between font-semibold">
                                <span>예상 결제 금액</span>
                                <span className="text-primary-pink text-xl font-bold">{totalCost.toLocaleString()}원</span>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-start">
                                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleTermsChange} className="h-4 w-4 mt-1 rounded border-gray-300 text-primary-pink focus:ring-primary-pink" />
                                <span className="ml-2 text-sm text-gray-600">모든 이용규약을 확인했으며, 불법적이거나 비매너적인 행위 시 서비스 이용이 제한될 수 있음에 동의합니다.</span>
                            </label>
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    return (
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-accent-navy">
            {initialData ? '예약 수정하기' : mimiToBook ? `${mimiToBook.formData.name}님과 데이트 신청` : '데이트 신청하기'}
          </h2>
          <button type="button" onClick={onCancel} className="text-sm font-semibold text-gray-600 hover:text-gray-800">닫기</button>
        </div>
        
        {/* Progress Bar */}
        <div>
            <div className="relative h-2 bg-gray-200 rounded-full">
                <div className="absolute top-0 left-0 h-2 bg-primary-pink rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
                <span className={step >= 1 ? 'text-primary-pink' : 'text-gray-400'}>날짜/장소</span>
                <span className={step >= 2 ? 'text-primary-pink' : 'text-gray-400'}>플랜/옵션</span>
                <span className={step >= 3 ? 'text-primary-pink' : 'text-gray-400'}>최종 확인</span>
            </div>
        </div>

        <div>{renderStepContent()}</div>

        <div className="flex justify-between items-center pt-4 border-t">
          <button type="button" onClick={prevStep} disabled={step === 1} className="px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50">
            이전
          </button>
          
          {step < totalSteps && (
            <button type="button" onClick={nextStep} disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)} className="px-6 py-2 text-sm font-bold text-white bg-primary-pink rounded-lg hover:opacity-90 disabled:bg-gray-300">
              다음
            </button>
          )}
          {step === totalSteps && (
            <button type="submit" disabled={!formData.agreeToTerms} className="px-6 py-2 text-sm font-bold text-white bg-primary-pink rounded-lg hover:opacity-90 disabled:bg-gray-300">
              {initialData ? '수정 완료' : '신청 완료'}
            </button>
          )}
        </div>
      </form>
    );
};


const BookingComponent: React.FC<BookingProps> = (props) => {
    const { userBookings, onNewBooking, onUpdateBooking, onAddReview, mimiToBook, onBookingFlowComplete, onOutfitInfoSubmit, onMeetingAdjustmentRequest, onMeetingAdjustmentResponse, onOpenChat } = props;
    const [view, setView] = useState<'list' | 'form' | 'payment' | 'extension'>(mimiToBook ? 'form' : 'list');
    const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
    const [bookingForPayment, setBookingForPayment] = useState<Omit<Booking, 'id' | 'user' | 'status'> | null>(null);
    const [bookingForExtension, setBookingForExtension] = useState<Booking | null>(null);
    const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
    const [outfitExchangeBooking, setOutfitExchangeBooking] = useState<Booking | null>(null);
    const [adjustmentBooking, setAdjustmentBooking] = useState<Booking | null>(null);

    useEffect(() => {
        if (mimiToBook) {
            setView('form');
        }
    }, [mimiToBook]);

    const handleNewBookingSubmit = (bookingData: Omit<Booking, 'id' | 'user' | 'status' | 'mimi'>) => {
        onNewBooking(bookingData, mimiToBook?.applicant);
        setBookingForPayment(bookingData);
        setView('payment');
    };

    const handleUpdateBookingSubmit = (bookingData: Omit<Booking, 'id' | 'user' | 'status' | 'mimi'>) => {
        if (bookingToEdit) {
            onUpdateBooking({ ...bookingToEdit, ...bookingData });
            setBookingToEdit(null);
            setView('list');
        }
    };

    const handlePaymentConfirm = () => {
        setBookingForPayment(null);
        setView('list');
        if (onBookingFlowComplete) onBookingFlowComplete();
    };

    const handleReviewSubmit = (review: { rating: number; comment: string }) => {
        if (reviewingBooking) {
            onAddReview(reviewingBooking.id, review);
            setReviewingBooking(null);
        }
    };

    const handleExtendSubmit = (data: { extensionHours: number; totalCost: number }) => {
        if (bookingForExtension) {
            alert(`연장 요청이 접수되었습니다. ${data.extensionHours}시간, ${data.totalCost.toLocaleString()}원`);
            setBookingForExtension(null);
            setView('list');
        }
    };

    const handleOutfitSubmit = (outfitInfo: OutfitInfo) => {
        if (outfitExchangeBooking) {
            onOutfitInfoSubmit(outfitExchangeBooking.id, 'client', outfitInfo);
            setOutfitExchangeBooking(null);
        }
    };
    
    const handleAdjustmentRequestSubmit = (request: Omit<MeetingAdjustment, 'status' | 'requestedAt' | 'requester'>) => {
        if(adjustmentBooking) {
            onMeetingAdjustmentRequest(adjustmentBooking.id, { ...request, requester: 'client' });
            setAdjustmentBooking(null);
        }
    };

    const getStatusBadge = (status: Booking['status']) => {
        switch (status) {
            case 'pending': return <span className="text-xs font-semibold text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full">미미 승인대기</span>;
            case 'awaiting_payment': return <span className="text-xs font-semibold text-blue-800 bg-blue-200 px-2 py-1 rounded-full">입금대기</span>;
            case 'approved': return <span className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full">예약 확정</span>;
            case 'rejected': return <span className="text-xs font-semibold text-red-800 bg-red-200 px-2 py-1 rounded-full">거절됨</span>;
            case 'completed': return <span className="text-xs font-semibold text-gray-800 bg-gray-200 px-2 py-1 rounded-full">완료됨</span>;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 animate-fade-in space-y-6">
            {view === 'payment' && bookingForPayment ? (
                <PaymentInstructions bookingData={bookingForPayment} onConfirm={handlePaymentConfirm} />
            ) : view === 'form' ? (
                <BookingForm
                    onSubmit={bookingToEdit ? handleUpdateBookingSubmit : handleNewBookingSubmit}
                    onCancel={() => {
                        setView('list');
                        setBookingToEdit(null);
                        if (onBookingFlowComplete) onBookingFlowComplete();
                    }}
                    mimiToBook={mimiToBook}
                    initialData={bookingToEdit}
                />
            ) : view === 'extension' && bookingForExtension ? (
                <ExtensionForm
                    booking={bookingForExtension}
                    onSubmit={handleExtendSubmit}
                    onCancel={() => {
                        setBookingForExtension(null);
                        setView('list');
                    }}
                />
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-accent-navy">나의 예약 내역</h1>
                        <button
                            onClick={() => {
                                setBookingToEdit(null);
                                setView('form');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-pink text-white font-bold rounded-xl shadow-md hover:scale-105 transition-transform"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span>새 예약</span>
                        </button>
                    </div>
                    
                    {userBookings.length > 0 ? (
                        <div className="space-y-4">
                            {userBookings
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map(booking => (
                                    <div key={booking.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-bold text-lg">{booking.date} @ {booking.time}</p>
                                                <p className="text-sm text-gray-600">{booking.location}</p>
                                                {booking.mimi && <p className="text-sm font-semibold text-primary-pink mt-1">w/ {booking.mimi.nickname} 미미</p>}
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        <div className="flex justify-end gap-2 mt-3 text-sm font-semibold">
                                            {booking.status === 'approved' && (
                                                <>
                                                    <button onClick={() => setOutfitExchangeBooking(booking)} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">의상 공유</button>
                                                    <button onClick={() => setAdjustmentBooking(booking)} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">시간/장소 변경</button>
                                                    <button onClick={() => onOpenChat(booking)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                                                        <ChatBubbleIcon className="w-4 h-4" /> 안심채팅
                                                    </button>
                                                    <button onClick={() => setBookingForExtension(booking)} className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200">연장</button>
                                                </>
                                            )}
                                            {booking.status === 'completed' && !booking.review && (
                                                <button onClick={() => setReviewingBooking(booking)} className="px-3 py-1.5 bg-primary-pink text-white rounded-lg hover:opacity-90">후기 남기기</button>
                                            )}
                                            {booking.status === 'pending' && (
                                                 <button onClick={() => { setBookingToEdit(booking); setView('form'); }} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">수정</button>
                                            )}
                                        </div>
                                        {booking.review && (
                                            <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">내가 남긴 후기:</p>
                                                    <div className="flex">
                                                        {[...Array(booking.review.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-yellow-400"/>)}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 mt-1 italic">"{booking.review.comment}"</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                            <p>예약 내역이 없습니다.</p>
                        </div>
                    )}
                </>
            )}
            {reviewingBooking && <ReviewModal booking={reviewingBooking} onClose={() => setReviewingBooking(null)} onSubmit={handleReviewSubmit} />}
            {outfitExchangeBooking && <OutfitExchangeModal booking={outfitExchangeBooking} userRole="client" onClose={() => setOutfitExchangeBooking(null)} onSubmit={handleOutfitSubmit} />}
            {adjustmentBooking && <MeetingAdjustmentModal booking={adjustmentBooking} userRole="client" onClose={() => setAdjustmentBooking(null)} onSubmit={handleAdjustmentRequestSubmit}/>}
        </div>
    );
};

export default BookingComponent;
