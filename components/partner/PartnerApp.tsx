
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PartnerTab, User, Booking, PartnerApplication, PartnerApplicationData, OutfitInfo, MeetingAdjustment, MimiStory } from '../../types';
import PartnerBottomNav from './PartnerBottomNav';
import ReservationManagement from './ReservationManagement';
import Chat from '../Chat'; // Reusing client chat for now
import Profile from './Profile';
import StoryManagement from './StoryManagement';
import Guide from './Guide';
import PrivacyPolicy from '../PrivacyPolicy';
import PartnerDashboard from './PartnerDashboard';
import ActivityAnalysis from './ActivityAnalysis';
import Schedule from './Schedule';
import SecureChatRoom from '../SecureChatRoom';

interface PartnerAppProps {
    user: User;
    bookings: Booking[];
    partnerApplication?: PartnerApplication;
    onUpdateProfile: (applicationId: string, formData: PartnerApplicationData) => void;
    onUpdateBookingStatus: (bookingId: string, status: 'awaiting_payment' | 'approved' | 'rejected' | 'completed') => void;
    onToggleAvailability: (applicationId: string) => void;
    onAddMimiReview: (bookingId: string, mimiReview: { rating: number; comment: string }) => void;
    onOutfitInfoSubmit: (bookingId: string, userRole: 'client' | 'mimi', outfitInfo: OutfitInfo) => void;
    onMeetingAdjustmentRequest: (bookingId: string, request: Omit<MeetingAdjustment, 'status' | 'requestedAt'>) => void;
    onMeetingAdjustmentResponse: (bookingId: string, response: 'accepted' | 'rejected') => void;
    mimiStories: MimiStory[];
    onNewMimiStory: (content: string) => void;
    onSendSecureMessage: (bookingId: string, text: string, sender: 'client' | 'mimi') => void;
    onUpdateAvailabilityDates: (applicationId: string, availableDates: string[]) => void;
}

const PartnerApp: React.FC<PartnerAppProps> = ({ 
    user, bookings, partnerApplication, onUpdateProfile, 
    onUpdateBookingStatus, onToggleAvailability, onAddMimiReview, 
    onOutfitInfoSubmit, onMeetingAdjustmentRequest, onMeetingAdjustmentResponse,
    mimiStories, onNewMimiStory, onSendSecureMessage, onUpdateAvailabilityDates
}) => {
  const [hasViewedGuide, setHasViewedGuide] = useState(() => {
    try {
      // Use a user-specific key to track if THIS specific user has seen the guide
      return window.localStorage.getItem(`rent-mimi-guide-viewed-${user.phone}`) === 'true';
    } catch (e) {
      console.error("Failed to read from localStorage", e);
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<PartnerTab>(hasViewedGuide ? 'dashboard' : 'guide');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [chattingBooking, setChattingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // When the guide is viewed (either initially or by clicking the tab), set the flag in localStorage for this user.
    if (activeTab === 'guide' && !hasViewedGuide) {
        try {
            window.localStorage.setItem(`rent-mimi-guide-viewed-${user.phone}`, 'true');
            setHasViewedGuide(true);
        } catch (e) {
            console.error("Failed to save guide viewed status to localStorage", e);
        }
    }
  }, [activeTab, hasViewedGuide, user.phone]);


  const mimiBookings = useMemo(() =>
    bookings.filter(b => b.mimi?.phone === user.phone)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [bookings, user.phone]);
  
  const myStories = useMemo(() => 
    mimiStories.filter(s => s.mimiApplicationId === partnerApplication?.id),
  [mimiStories, partnerApplication]);

  const prevBookingCount = useRef(mimiBookings.length);

  useEffect(() => {
    if (mimiBookings.length > prevBookingCount.current) {
        const newBooking = mimiBookings[0];
        alert(
`💌 새로운 예약 요청!
고객: ${newBooking.user.nickname}
일시: ${newBooking.date} ${newBooking.time}
장소: ${newBooking.location}
예약 관리 탭에서 확인해주세요.`
        );
    }
    prevBookingCount.current = mimiBookings.length;
  }, [mimiBookings]);
  
  if (showPrivacyPolicy) {
    return <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />;
  }
  
  if (chattingBooking) {
    return (
        <SecureChatRoom
            user={user}
            booking={chattingBooking}
            onBack={() => setChattingBooking(null)}
            onSendMessage={onSendSecureMessage}
        />
    );
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'guide':
        return <Guide onShowPrivacyPolicy={() => setShowPrivacyPolicy(true)} />;
      case 'dashboard':
        return <PartnerDashboard bookings={mimiBookings} onNavigateToReservations={() => setActiveTab('reservations')} />;
      case 'reservations':
        return <ReservationManagement 
                    bookings={mimiBookings} 
                    onUpdateBookingStatus={onUpdateBookingStatus}
                    partnerApplication={partnerApplication}
                    onToggleAvailability={onToggleAvailability}
                    onAddMimiReview={onAddMimiReview}
                    onOutfitInfoSubmit={onOutfitInfoSubmit}
                    onMeetingAdjustmentRequest={onMeetingAdjustmentRequest}
                    onMeetingAdjustmentResponse={onMeetingAdjustmentResponse}
                    onOpenChat={setChattingBooking}
                />;
      case 'schedule':
        if (!partnerApplication) return <div className="text-center p-8">프로필 정보를 불러올 수 없습니다.</div>;
        return <Schedule 
                    partnerApplication={partnerApplication}
                    bookings={mimiBookings}
                    onUpdateAvailabilityDates={onUpdateAvailabilityDates}
                />;
      case 'analysis':
         if (!partnerApplication) return <div className="text-center p-8">프로필 정보를 불러올 수 없습니다.</div>;
        return <ActivityAnalysis partnerApplication={partnerApplication} bookings={mimiBookings} />;
      case 'story':
        if (!partnerApplication) {
          return <div className="text-center p-8">프로필 정보를 불러올 수 없습니다.</div>;
        }
        return <StoryManagement 
                  partnerApplication={partnerApplication}
                  myStories={myStories}
                  onNewStory={onNewMimiStory}
                />;
      case 'profile':
        if (!partnerApplication) {
          return <div className="text-center p-8">프로필 정보를 불러올 수 없습니다.</div>;
        }
        return <Profile partnerApplication={partnerApplication} onUpdateProfile={onUpdateProfile} />;
      default:
        return <PartnerDashboard bookings={mimiBookings} onNavigateToReservations={() => setActiveTab('reservations')} />;
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-grow pb-16">
        {renderContent()}
      </div>
      <PartnerBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default PartnerApp;
