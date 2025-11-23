export type Role = 'client' | 'partner' | 'admin';

export type ClientTab = 'home' | 'booking' | 'chat' | 'mypage' | 'find';
export type PartnerTab = 'dashboard' | 'reservations' | 'schedule' | 'analysis' | 'profile' | 'story' | 'guide';
export type AdminTab = 'dashboard' | 'bookings' | 'mimis' | 'payouts' | 'customermanagement';

export type MimiGrade = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export interface MimiProfile {
  id: number;
  name: string;
  age: number;
  description: string;
  tagline?: string;
  imgId: number;
  available: boolean;
  recommended: boolean;
  region: string;
  style: '청순' | '섹시' | '귀여움';
}

export interface User {
  phone: string;
  nickname: string;
  region: string;
  roles: Role[];
}

export interface OutfitInfo {
    description: string;
    photoUrl?: string;
}

export interface MeetingAdjustment {
    requester: 'client' | 'mimi';
    type: 'time' | 'location';
    status: 'pending' | 'accepted' | 'rejected';
    details: {
        time?: string; // e.g., '15' for 15 minutes late
        location?: string;
        reason?: string;
    };
    requestedAt: number; // timestamp
}

export interface Booking {
    id: string;
    user: User;
    date: string;
    time: string;
    duration: string;
    plan: string;
    location: string;
    details: string;
    options: {
        instantPhotos: boolean;
        handHolding: boolean;
        pool: boolean;
        outfit: boolean;
        drive: boolean;
    };
    totalCost: number;
    status: 'pending' | 'awaiting_payment' | 'approved' | 'rejected' | 'completed';
    mimi?: User;
    review?: {
        rating: number;
        comment: string;
        isFeatured?: boolean;
    };
    mimiReview?: {
        rating: number;
        comment: string;
    };
    payoutStatus?: 'none' | 'pending' | 'completed';
    outfitExchange?: {
        client?: OutfitInfo;
        mimi?: OutfitInfo;
    };
    meetingAdjustment?: MeetingAdjustment;
    secureChat?: {
        messages: {
            sender: 'client' | 'mimi';
            text: string;
            timestamp: number;
        }[];
    };
}

export type StyleTag = '청순' | '섹시' | '귀여움';

export interface PartnerApplicationData {
    name: string;
    age: string;
    contact: string;
    mbti: string;
    height: string;
    weight: string;
    kakaoId: string;
    region: string;
    rrn: string;
    accountNumber: string;
    sns: string;
    intro: string;
    facePhotoDataUrls: string[];
    fullBodyPhotoDataUrls: string[];
    availableDays: string[];
    availableDates?: string[];
    styles: StyleTag[];
    latitude?: number;
    longitude?: number;
    availableForBooking?: boolean;
    grade?: MimiGrade;
    qna?: {
        question: string;
        answer: string;
    }[];
}

export interface PublicMimiProfile {
    name: string;
    age: string;
    intro: string;
    facePhotoDataUrl: string | null;
    region: string;
}

export interface PartnerApplication {
    id: string;
    applicant: User;
    formData: PartnerApplicationData;
    isRecommended?: boolean;
    publicProfile?: PublicMimiProfile;
}

export interface MimiStory {
  id: string;
  mimiApplicationId: string;
  mimiName: string;
  mimiProfilePhotoUrl: string | null;
  content: string;
  createdAt: number;
}