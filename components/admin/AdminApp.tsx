

import React, { useState } from 'react';
import { AdminTab, MimiProfile, Booking, PartnerApplication, PublicMimiProfile, User, MimiGrade } from '../../types';
import AdminBottomNav from './AdminBottomNav';
import Dashboard from './Dashboard';
import BookingManagement from './BookingManagement';
import MimiManagement from './MimiManagement';
import PayoutManagement from './PayoutManagement';
import CustomerManagement from './CustomerManagement';

interface AdminAppProps {
    users: User[];
    bookings: Booking[];
    onUpdateBookingStatus: (bookingId: string, status: 'awaiting_payment' | 'approved' | 'rejected' | 'completed') => void;
    partnerApplications: PartnerApplication[];
    onTogglePartnerRecommendation: (applicationId: string) => void;
    onUpdatePartnerPublicProfile: (applicationId: string, publicProfile: PublicMimiProfile) => void;
    onToggleReviewFeature: (bookingId: string) => void;
    onUpdateMimiGrade: (applicationId: string, grade: MimiGrade) => void;
    onUpdatePayoutStatus: (bookingId: string, payoutStatus: 'pending' | 'completed') => void;
    onAssignMimi: (bookingId: string, partnerId: string) => void;
}


const AdminApp: React.FC<AdminAppProps> = ({ 
    users, bookings, onUpdateBookingStatus, partnerApplications, 
    onTogglePartnerRecommendation, onUpdatePartnerPublicProfile, onToggleReviewFeature,
    onUpdateMimiGrade, onUpdatePayoutStatus, onAssignMimi
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <BookingManagement 
                  bookings={bookings} 
                  onUpdateStatus={onUpdateBookingStatus} 
                  partnerApplications={partnerApplications}
                  onAssignMimi={onAssignMimi}
                />;
      case 'mimis':
        return <MimiManagement 
                    applications={partnerApplications} 
                    onToggleRecommendation={onTogglePartnerRecommendation} 
                    onUpdatePartnerPublicProfile={onUpdatePartnerPublicProfile}
                    onUpdateMimiGrade={onUpdateMimiGrade}
                />;
      case 'payouts':
        return <PayoutManagement 
                    bookings={bookings} 
                    partnerApplications={partnerApplications} 
                    onUpdatePayoutStatus={onUpdatePayoutStatus} 
                />;
      case 'customermanagement':
        return <CustomerManagement users={users} bookings={bookings} onToggleReviewFeature={onToggleReviewFeature} />;
      case 'dashboard':
      default:
        return <Dashboard bookings={bookings} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow pb-16">
        {renderContent()}
      </div>
      <AdminBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default AdminApp;