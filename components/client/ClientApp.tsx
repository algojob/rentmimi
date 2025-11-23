
import React, { useState } from 'react';
import { ClientTab, User, Booking, PartnerApplication, PartnerApplicationData, OutfitInfo, MeetingAdjustment, MimiStory } from '../../types';
import Home from '../Home';
import Find, { MimiFilter } from '../Find';
import BookingComponent from '../Booking';
import Chat from '../Chat';
import MyPage from '../MyPage';
import ClientBottomNav from '../BottomNav';
import PartnerApplicationScreen from '../partner/PartnerApplicationScreen';
import MimiDetailScreen from '../MimiDetailScreen';
import TermsOfService from '../TermsOfService';
import PrivacyPolicy from '../PrivacyPolicy';
import SecureChatRoom from '../SecureChatRoom';

interface ClientAppProps {
    isLoading: boolean;
    user: User;
    onLogout: () => void;
    bookings: Booking[];
    onNewBooking: (bookingData: Omit<Booking, 'id' | 'user' | 'status' | 'mimi'>, mimi?: User) => void;
    onUpdateBooking: (updatedBooking: Booking) => void;
    onAddReview: (bookingId: string, review: { rating: number; comment: string }) => void;
    recommendedPartners: PartnerApplication[];
    partnerApplications: PartnerApplication[];
    onPartnerApplicationSubmit: (formData: PartnerApplicationData) => void;
    onOutfitInfoSubmit: (bookingId: string, userRole: 'client' | 'mimi', outfitInfo: OutfitInfo) => void;
    onMeetingAdjustmentRequest: (bookingId: string, request: Omit<MeetingAdjustment, 'status' | 'requestedAt'>) => void;
    onMeetingAdjustmentResponse: (bookingId: string, response: 'accepted' | 'rejected') => void;
    mimiStories: MimiStory[];
    onSendSecureMessage: (bookingId: string, text: string, sender: 'client' | 'mimi') => void;
}

const ClientApp: React.FC<ClientAppProps> = ({ 
    isLoading, user, onLogout, bookings, onNewBooking, onUpdateBooking, 
    onAddReview, recommendedPartners, partnerApplications, 
    onPartnerApplicationSubmit, onOutfitInfoSubmit, 
    onMeetingAdjustmentRequest, onMeetingAdjustmentResponse, mimiStories,
    onSendSecureMessage,
}) => {
  const [activeTab, setActiveTab] = useState<ClientTab>('home');
  const [findMimiFilter, setFindMimiFilter] = useState<MimiFilter | null>(null);
  const [showPartnerApplication, setShowPartnerApplication] = useState(false);
  
  // Store IDs instead of objects to ensure we always use the latest data from partnerApplications
  const [selectedMimiId, setSelectedMimiId] = useState<string | null>(null);
  const [mimiToBookId, setMimiToBookId] = useState<string | null>(null);
  
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [chattingBooking, setChattingBooking] = useState<Booking | null>(null);

  // Derive objects from the latest props
  const selectedMimi = partnerApplications.find(p => p.id === selectedMimiId) || null;
  const mimiToBook = partnerApplications.find(p => p.id === mimiToBookId) || null;

  const handleShowAvailableMimis = () => {
    setFindMimiFilter({ available: true });
    setActiveTab('find');
  };
  
  const userBookings = bookings.filter(b => b.user.phone === user.phone);

  const handleApplicationClose = () => {
    setShowPartnerApplication(false);
  };

  const handleApplicationSubmit = (formData: PartnerApplicationData) => {
    onPartnerApplicationSubmit(formData);
    handleApplicationClose();
  };

  const handleMimiSelect = (partner: PartnerApplication) => {
    setSelectedMimiId(partner.id);
  };

  const handleBookMimi = () => {
    if (selectedMimiId) {
        setMimiToBookId(selectedMimiId);
    }
    setSelectedMimiId(null);
    setActiveTab('booking');
  };
  
  const handleBookingFlowComplete = () => {
    setMimiToBookId(null);
  };

  const handleOpenChat = (booking: Booking) => {
    setChattingBooking(booking);
  };

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

  if (showTerms) {
    return <TermsOfService onClose={() => setShowTerms(false)} />;
  }
  
  if (showPrivacyPolicy) {
    return <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />;
  }

  if (showPartnerApplication) {
      return <PartnerApplicationScreen onBack={handleApplicationClose} onFinish={handleApplicationSubmit} />;
  }

  if (selectedMimi) {
    const mimiReviews = bookings.filter(b => 
        b.mimi?.phone === selectedMimi.applicant.phone && b.status === 'completed' && b.review
    );

    return (
        <MimiDetailScreen
            partner={selectedMimi}
            onBack={() => setSelectedMimiId(null)}
            onBook={handleBookMimi}
            reviews={mimiReviews}
        />
    );
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'find':
        return <Find isLoading={isLoading} partnerApplications={partnerApplications} initialFilter={findMimiFilter} setInitialFilter={setFindMimiFilter} onMimiSelect={handleMimiSelect} />;
      case 'booking':
        return <BookingComponent 
                    userBookings={userBookings} 
                    onNewBooking={onNewBooking}
                    onUpdateBooking={onUpdateBooking} 
                    onAddReview={onAddReview}
                    mimiToBook={mimiToBook} 
                    onBookingFlowComplete={handleBookingFlowComplete} 
                    onOutfitInfoSubmit={onOutfitInfoSubmit}
                    onMeetingAdjustmentRequest={onMeetingAdjustmentRequest}
                    onMeetingAdjustmentResponse={onMeetingAdjustmentResponse}
                    onOpenChat={handleOpenChat}
                />;
      case 'chat':
        return <Chat />;
      case 'mypage':
        return <MyPage user={user} onLogout={onLogout} onApplyForPartner={() => setShowPartnerApplication(true)} onShowTerms={() => setShowTerms(true)} onShowPrivacyPolicy={() => setShowPrivacyPolicy(true)} />;
      case 'home':
      default:
        return <Home 
                    isLoading={isLoading}
                    onShowAvailable={handleShowAvailableMimis} 
                    recommendedPartners={recommendedPartners} 
                    onMimiSelect={handleMimiSelect} 
                    bookings={bookings} 
                    mimiStories={mimiStories}
                    partnerApplications={partnerApplications}
                />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow pb-16">
        {renderContent()}
      </div>
      <ClientBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default ClientApp;
