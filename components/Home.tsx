
import React, { useMemo } from 'react';
import { StarIcon } from './icons/StarIcon';
import { PartnerApplication, Booking, MimiStory } from '../types';
import MimiCardSkeleton from './skeletons/MimiCardSkeleton';

interface HomeProps {
    isLoading: boolean;
    onShowAvailable: () => void;
    recommendedPartners: PartnerApplication[];
    onMimiSelect: (partner: PartnerApplication) => void;
    bookings: Booking[];
    mimiStories: MimiStory[];
    partnerApplications: PartnerApplication[];
}

const timeSince = (date: number): string => {
  const seconds = Math.floor((Date.now() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + "년 전";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "달 전";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "일 전";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "시간 전";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "분 전";
  }
  return "방금 전";
};


const Home: React.FC<HomeProps> = ({ isLoading, onShowAvailable, recommendedPartners, onMimiSelect, bookings, mimiStories, partnerApplications }) => {

    const reviews = bookings
        .filter(booking => booking.status === 'completed' && booking.review && booking.review.isFeatured)
        .map(booking => ({
            id: booking.id,
            name: `${booking.user.nickname.substring(0, 1)}*${booking.user.nickname.substring(booking.user.nickname.length - 1)}`,
            rating: booking.review!.rating,
            comment: booking.review!.comment,
        }))
        .reverse(); // Show latest reviews first

    const sortedStories = useMemo(() => 
        mimiStories.sort((a, b) => b.createdAt - a.createdAt), 
    [mimiStories]);

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      {/* Main Banner */}
      <div className="container mx-auto px-4">
        <div className="bg-primary-pink text-white rounded-2xl p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold mb-2">오늘, 운명의 상대를 만나보세요</h1>
          <p className="mb-4">지금 바로 만남 가능한 미미를 확인하고<br/>잊지 못할 순간을 만들어보세요.</p>
          <button 
            onClick={onShowAvailable}
            className="bg-white text-primary-pink font-bold py-3 px-6 rounded-2xl transition-transform transform hover:scale-105">
            오늘 가능한 미미 보기
          </button>
        </div>
      </div>

      {/* Recommended Mimis */}
      <div>
        <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-4">추천 미미 💕</h2>
        </div>
        <div className="flex justify-start md:justify-center overflow-x-auto space-x-4 px-4 scrollbar-hide">
            {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => <MimiCardSkeleton key={index} />)
            ) : recommendedPartners.length > 0 ? (
                recommendedPartners.map(partner => {
                    const displayName = partner.publicProfile?.name || partner.formData.name;
                    const displayAge = partner.publicProfile?.age || partner.formData.age;
                    const displayIntro = partner.publicProfile?.intro || partner.formData.intro;
                    const displayPhoto = partner.publicProfile?.facePhotoDataUrl || (partner.formData.facePhotoDataUrls && partner.formData.facePhotoDataUrls[0]) || null;
                    const displayRegion = partner.publicProfile?.region || partner.formData.region;

                    return (
                        <button
                            key={partner.id}
                            onClick={() => onMimiSelect(partner)}
                            className="flex-shrink-0 w-40 text-left"
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md transition-transform transform hover:scale-105">
                                <img src={displayPhoto || `https://picsum.photos/id/100/300/400`} alt={displayName} className="w-full h-full object-cover bg-gray-200"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-3 text-white w-full">
                                    <h3 className="font-bold">{displayName}, {displayAge}</h3>
                                    <p className="text-xs">{displayRegion}</p>
                                    <p className="text-xs truncate mt-1">{displayIntro}</p>
                                </div>
                            </div>
                        </button>
                    );
                })
            ) : (
                 <div className="w-full text-center text-sm text-gray-500 py-8">추천 미미가 없습니다.</div>
            )}
             <div className="flex-shrink-0 w-4"></div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-4">고객 후기 🌟</h2>
        <div className="space-y-4">
            {reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm">{review.name}</span>
                            <div className="flex">
                                {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-yellow-400"/>)}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">"{review.comment}"</p>
                    </div>
                ))
            ) : (
                 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-center text-sm text-gray-500">
                    <p>아직 표시할 후기가 없습니다.</p>
                </div>
            )}
        </div>
      </div>
      
       {/* Mimi Stories Section */}
       <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-4">미미들의 스토리 💌</h2>
            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="w-full flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"></div>
                            <div className="flex-grow space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            </div>
                        </div>
                    ))
                ) : sortedStories.length > 0 ? (
                    sortedStories.slice(0, 5).map(story => { // Show latest 5
                        const partner = partnerApplications.find(p => p.id === story.mimiApplicationId);
                        if (!partner) return null;

                        return (
                            <button 
                                key={story.id} 
                                onClick={() => onMimiSelect(partner)}
                                className="w-full flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
                            >
                                <img src={story.mimiProfilePhotoUrl || `https://picsum.photos/seed/${story.id}/150/150`} alt={story.mimiName} className="w-12 h-12 object-cover rounded-full flex-shrink-0" />
                                <div className="flex-grow">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-bold text-sm text-accent-navy">{story.mimiName}</p>
                                        <p className="text-xs text-gray-400">{timeSince(story.createdAt)}</p>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">{story.content}</p>
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center text-sm text-gray-500">
                        <p>아직 새로운 스토리가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>

    </div>
  );
};

export default Home;