

import React from 'react';
import { Role, User, Booking, PartnerApplication, PublicMimiProfile, PartnerApplicationData, MimiGrade, OutfitInfo, MeetingAdjustment, MimiStory } from './types';
import Header from './components/Header';
import ClientApp from './components/client/ClientApp';
import PartnerApp from './components/partner/PartnerApp';
import AdminApp from './components/admin/AdminApp';
import UnauthorizedScreen from './components/auth/UnauthorizedScreen';

interface MainAppProps {
  isLoading: boolean;
  user: User;
  users: User[];
  onLogout: () => void;
  bookings: Booking[];
  onNewBooking: (bookingData: Omit<Booking, 'id' | 'user' | 'status' | 'mimi'>, mimi?: User) => void;
  onUpdateBooking: (updatedBooking: Booking) => void;
  onUpdateBookingStatus: (bookingId: string, status: 'awaiting_payment' | 'approved' | 'rejected' | 'completed') => void;
  onAddReview: (bookingId: string, review: { rating: number; comment: string }) => void;
  onAddMimiReview: (bookingId: string, mimiReview: { rating: number; comment: string }) => void;
  onToggleReviewFeature: (bookingId: string) => void;
  onUpdatePayoutStatus: (bookingId: string, payoutStatus: 'pending' | 'completed') => void;
  partnerApplications: PartnerApplication[];
  onTogglePartnerRecommendation: (applicationId: string) => void;
  onUpdatePartnerPublicProfile: (applicationId: string, publicProfile: PublicMimiProfile) => void;
  onPartnerApplicationSubmit: (formData: PartnerApplicationData) => void;
  onUpdatePartnerProfile: (applicationId: string, formData: PartnerApplicationData) => void;
  onTogglePartnerAvailability: (applicationId: string) => void;
  onUpdateMimiGrade: (applicationId: string, grade: MimiGrade) => void;
  onOutfitInfoSubmit: (bookingId: string, userRole: 'client' | 'mimi', outfitInfo: OutfitInfo) => void;
  onMeetingAdjustmentRequest: (bookingId: string, request: Omit<MeetingAdjustment, 'status' | 'requestedAt'>) => void;
  onMeetingAdjustmentResponse: (bookingId: string, response: 'accepted' | 'rejected') => void;
  mimiStories: MimiStory[];
  onNewMimiStory: (content: string) => void;
  onSendSecureMessage: (bookingId: string, text: string, sender: 'client' | 'mimi') => void;
  onUpdatePartnerAvailabilityDates: (applicationId: string, availableDates: string[]) => void;
  onAssignMimi: (bookingId: string, partnerId: string) => void;
}

const MainApp: React.FC<MainAppProps> = (props) => {
  const { 
    user, 
    onLogout, 
    bookings, 
    partnerApplications,
  } = props;

  const currentRole: Role = user.roles.includes('admin')
    ? 'admin'
    : user.roles.includes('partner')
    ? 'partner'
    : 'client';

  if (!user.roles.includes(currentRole)) {
    return <UnauthorizedScreen onGoBack={() => { /* No-op, can't go back */ }} />;
  }
  
  const recommendedPartners = partnerApplications.filter(app => app.isRecommended);
  const partnerApplicationForUser = partnerApplications.find(app => app.applicant.phone === user.phone);

  const renderAppForRole = () => {
    switch (currentRole) {
      case 'client':
        return <ClientApp 
                    {...props}
                    recommendedPartners={recommendedPartners}
                />;
      case 'partner':
        return <PartnerApp 
                  {...props}
                  partnerApplication={partnerApplicationForUser}
                  onUpdateProfile={props.onUpdatePartnerProfile}
                  onToggleAvailability={props.onTogglePartnerAvailability}
                  onUpdateAvailabilityDates={props.onUpdatePartnerAvailabilityDates}
                />;
      case 'admin':
        return <AdminApp 
                  {...props}
                  onAssignMimi={props.onAssignMimi}
                />;
      default:
        return <ClientApp 
                    {...props}
                    recommendedPartners={recommendedPartners}
                />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main>
        {renderAppForRole()}
      </main>
    </div>
  );
};

export default MainApp;