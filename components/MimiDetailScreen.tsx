
import React from 'react';
import { PartnerApplication, Booking } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { StarIcon } from './icons/StarIcon';

interface MimiDetailScreenProps {
    partner: PartnerApplication;
    onBack: () => void;
    onBook: () => void;
    reviews: Booking[];
}

const MimiDetailScreen: React.FC<MimiDetailScreenProps> = ({ partner, onBack, onBook, reviews }) => {
    const { formData } = partner;
    const allPhotos = [...formData.facePhotoDataUrls, ...formData.fullBodyPhotoDataUrls];

    const todayStr = new Date().toISOString().split('T')[0];
    const sortedAvailableDates = formData.availableDates 
        ? formData.availableDates
            .filter(date => date >= todayStr)
            .sort()
        : [];

    return (
        <div className="bg-white min-h-screen">
            <div className="relative">
                {/* Photo Carousel */}
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {allPhotos.length > 0 ? (
                        allPhotos.map((photo, index) => (
                            <div key={index} className="flex-shrink-0 w-full h-96 snap-center">
                                <img src={photo} alt={`${formData.name} photo ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))
                    ) : (
                        <div className="flex-shrink-0 w-full h-96 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No Photo Available</span>
                        </div>
                    )}
                </div>
                {/* Back Button */}
                <button onClick={onBack} className="absolute top-4 left-4 bg-black/50 text-white rounded-full p-2">
                    <ChevronDownIcon className="w-6 h-6 rotate-90" />
                </button>
            </div>

            <div className="p-6 space-y-6 pb-24">
                {/* Header Info */}
                <div>
                    <h1 className="text-3xl font-bold text-accent-navy">{formData.name}, {formData.age}</h1>
                    <p className="text-gray-600 mt-1">{formData.region}</p>
                </div>

                {/* Intro Section */}
                <div className="border-t pt-4">
                    <h2 className="text-lg font-semibold text-accent-navy mb-2">자기소개</h2>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {formData.intro}
                    </p>
                </div>
                
                {/* Q&A Section */}
                {formData.qna && formData.qna.length > 0 && (
                    <div className="border-t pt-4">
                        <h2 className="text-lg font-semibold text-accent-navy mb-3">{formData.name}님과의 Q&A 💬</h2>
                        <div className="space-y-3">
                            {formData.qna.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                    <p className="font-bold text-sm text-primary-pink">Q. {item.question}</p>
                                    <p className="text-sm text-gray-700 mt-1">A. {item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Reviews Section */}
                <div className="border-t pt-4">
                    <h2 className="text-lg font-semibold text-accent-navy mb-3">고객 후기 🌟</h2>
                     {reviews.length > 0 ? (
                        <div className="space-y-3">
                            {reviews.slice(0, 3).map(booking => ( // Show latest 3 reviews
                                <div key={booking.id} className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm">{`${booking.user.nickname.substring(0, 1)}*${booking.user.nickname.substring(booking.user.nickname.length - 1)}`}</span>
                                        <div className="flex">
                                            {[...Array(booking.review!.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-yellow-400"/>)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">"{booking.review!.comment}"</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">아직 작성된 후기가 없습니다.</p>
                    )}
                </div>


                {/* Details Section */}
                <div className="border-t pt-4">
                    <h2 className="text-lg font-semibold text-accent-navy mb-3">미미 정보</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <InfoItem label="MBTI" value={formData.mbti} />
                        <InfoItem label="키" value={`${formData.height} cm`} />
                        <InfoItem label="몸무게" value={`${formData.weight} kg`} />
                    </div>
                </div>

                {/* Available Dates (Specific Schedule) */}
                {sortedAvailableDates.length > 0 && (
                    <div className="border-t pt-4">
                        <h2 className="text-lg font-semibold text-accent-navy mb-3">📅 지정 예약 가능일</h2>
                        <div className="flex flex-wrap gap-2">
                            {sortedAvailableDates.map(date => (
                                <span
                                    key={date}
                                    className="px-3 py-1.5 text-sm font-semibold rounded-full bg-primary-pink text-white shadow-sm"
                                >
                                    {date}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">위 날짜에는 확실하게 만남이 가능합니다.</p>
                    </div>
                )}

                {/* Available Days (General) */}
                 {formData.availableDays && formData.availableDays.length > 0 && (
                    <div className="border-t pt-4">
                        <h2 className="text-lg font-semibold text-accent-navy mb-3">활동 요일</h2>
                        <div className="flex flex-wrap gap-2">
                            {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                                <span
                                    key={day}
                                    className={`px-3 py-1.5 text-sm font-semibold rounded-full ${
                                        formData.availableDays.includes(day)
                                            ? 'bg-gray-700 text-white'
                                            : 'bg-gray-200 text-gray-400'
                                    }`}
                                >
                                    {day}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">기본 활동 요일입니다. 구체적인 일정은 예약 시 확인해주세요.</p>
                    </div>
                 )}
            </div>

            {/* Sticky Footer for Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t p-4 z-10">
                <div className="container mx-auto max-w-2xl">
                     <button
                        onClick={onBook}
                        className="w-full bg-primary-pink text-white font-bold py-4 px-6 rounded-2xl transition-transform transform hover:scale-105"
                    >
                        데이트 신청하기
                    </button>
                </div>
            </div>
        </div>
    );
};

const InfoItem: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-xs text-gray-500 font-semibold">{label}</p>
        <p className="text-gray-800 font-medium mt-0.5">{value}</p>
    </div>
);


export default MimiDetailScreen;
