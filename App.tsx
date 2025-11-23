
import React, { useState, useEffect } from 'react';
import MainApp from './MainApp';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import { User, Role, Booking, PartnerApplication, PartnerApplicationData, PublicMimiProfile, MimiGrade, OutfitInfo, MeetingAdjustment, MimiStory } from './types';
import Header from './components/Header';
import PartnerApplicationScreen from './components/partner/PartnerApplicationScreen';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

type AuthScreen = 'login' | 'signup';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const initialUsers: User[] = [
    { phone: '01012345678', nickname: '김미미', region: '서울', roles: ['client', 'partner'] },
    { phone: '01055889566', nickname: '관리자', region: '서울', roles: ['client', 'partner', 'admin'] },
    { phone: '01050507776', nickname: '테스트고객', region: '경기', roles: ['client'] },
    { phone: '01088552741', nickname: '테스트미미', region: '인천', roles: ['client', 'partner'] },
  ];
  
  const initialPartnerApplications: PartnerApplication[] = [
    {
        id: '1',
        applicant: initialUsers[0], // 김미미
        formData: {
            name: '유나',
            age: '24',
            contact: '01012345678',
            mbti: 'ENFP',
            height: '165',
            weight: '50',
            kakaoId: 'yunalee',
            region: '서울 강남',
            rrn: '990101-2000000',
            accountNumber: '카카오뱅크 3333-01-1234567',
            sns: 'instagram.com/yuna',
            intro: '햇살 좋은 날, 카페에서 책 읽는 걸 좋아해요. 같이 맛있는 거 먹어요!',
            facePhotoDataUrls: [`https://picsum.photos/id/101/400/600`],
            fullBodyPhotoDataUrls: [`https://picsum.photos/id/1011/400/600`],
            availableDays: ['월', '수', '금'],
            availableDates: ['2024-07-25', '2024-07-27'],
            styles: ['청순', '귀여움'],
            latitude: 37.4979,
            longitude: 127.0276,
            availableForBooking: true,
            grade: 'GOLD',
            qna: [
                { question: '유나님은 어떤 데이트를 좋아하세요?', answer: '저는 조용한 카페에서 대화 나누는 걸 좋아해요. 맛있는 디저트는 필수! 🍰' },
                { question: '유나님의 매력 포인트는 무엇인가요?', answer: '음... 잘 웃는 거요! 같이 있으면 긍정적인 에너지를 받으실 수 있을 거예요! 😊' }
            ]
        },
        isRecommended: true,
        publicProfile: {
            name: '유나',
            age: '24',
            intro: '햇살 좋은 날, 카페에서 책 읽는 걸 좋아해요.',
            facePhotoDataUrl: `https://picsum.photos/id/101/400/600`,
            region: '서울 강남',
        }
    },
    {
        id: '2',
        applicant: initialUsers[3], // 테스트미미
        formData: {
            name: '서아',
            age: '22',
            contact: '01088552741',
            mbti: 'ISFP',
            height: '162',
            weight: '48',
            kakaoId: 'seoah',
            region: '서울 홍대',
            rrn: '010101-2000000',
            accountNumber: '신한은행 110-123-456789',
            sns: 'instagram.com/seoah',
            intro: '음악과 함께하는 산책이 취미예요. 영화 좋아하세요?',
            facePhotoDataUrls: [`https://picsum.photos/id/102/400/600`],
            fullBodyPhotoDataUrls: [`https://picsum.photos/id/1012/400/600`],
            availableDays: ['화', '목', '토'],
            styles: ['섹시'],
            latitude: 37.5559,
            longitude: 126.9238,
            availableForBooking: true,
            grade: 'BRONZE',
            qna: [
                { question: '서아님은 주로 어디서 데이트하세요?', answer: '홍대나 연남동에서 자주 놀아요! 아기자기한 소품샵 구경하는 걸 좋아하거든요.' }
            ]
        },
        isRecommended: false,
    }
  ];

  const initialMimiStories: MimiStory[] = [
    {
        id: 'story-1',
        mimiApplicationId: '1', // Corresponds to 유나
        mimiName: '유나',
        mimiProfilePhotoUrl: `https://picsum.photos/id/101/400/600`,
        content: '오늘 날씨 정말 좋네요! 강남에서 같이 산책하고 맛있는 파스타 먹고 싶어요. 저랑 데이트 하실 분? 🥰',
        createdAt: Date.now() - 1000 * 60 * 15, // 15 minutes ago
    },
    {
        id: 'story-2',
        mimiApplicationId: '2', // Corresponds to 서아
        mimiName: '서아',
        mimiProfilePhotoUrl: `https://picsum.photos/id/102/400/600`,
        content: '홍대에 새로 생긴 소품샵 같이 구경가요! 귀여운 거 보면 기분이 좋아지잖아요~ ✨',
        createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    }
  ];

  // Initialize users from localStorage
  const [users, setUsers] = useState<User[]>(() => {
    try {
        const savedUsers = window.localStorage.getItem('rent-mimi-users');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
    }
    return initialUsers;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [pendingPartnerApplication, setPendingPartnerApplication] = useState(false);
  
  // Initialize bookings from localStorage
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
        const savedBookings = window.localStorage.getItem('rent-mimi-bookings');
        return savedBookings ? JSON.parse(savedBookings) : [
            {
                id: 'review-1',
                user: initialUsers[2],
                date: '2024-07-20',
                time: '18:00',
                duration: '2',
                plan: 'PREMIUM',
                location: '서울 강남',
                details: '저녁 식사 데이트',
                options: { instantPhotos: false, handHolding: true, pool: false, outfit: false, drive: false },
                totalCost: 190000,
                status: 'completed',
                mimi: initialUsers[0],
                review: {
                    rating: 5,
                    comment: '정말 즐거운 시간이었어요! 유나님 최고!',
                    isFeatured: true,
                },
                payoutStatus: 'completed'
            }
        ];
    } catch (error) {
        console.error("Failed to parse bookings from localStorage", error);
        return [];
    }
  });
  
  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>(() => {
    try {
        const savedApps = window.localStorage.getItem('rent-mimi-partner-applications');
        if (savedApps) {
            const parsedApps = JSON.parse(savedApps);
            return Array.isArray(parsedApps) ? parsedApps : initialPartnerApplications;
        }
    } catch (error) {
        console.error("Failed to parse partner applications from localStorage", error);
    }
    return initialPartnerApplications;
  });

  const [mimiStories, setMimiStories] = useState<MimiStory[]>(() => {
    try {
        const savedStories = window.localStorage.getItem('rent-mimi-stories');
        return savedStories ? JSON.parse(savedStories) : initialMimiStories;
    } catch (error) {
        console.error("Failed to parse mimi stories from localStorage", error);
        return initialMimiStories;
    }
  });

  // Persist data to localStorage whenever they change
  useEffect(() => {
    try {
        window.localStorage.setItem('rent-mimi-users', JSON.stringify(users));
        window.localStorage.setItem('rent-mimi-bookings', JSON.stringify(bookings));
        window.localStorage.setItem('rent-mimi-partner-applications', JSON.stringify(partnerApplications));
        window.localStorage.setItem('rent-mimi-stories', JSON.stringify(mimiStories));

    } catch (error) {
        console.error("Failed to save data to localStorage", error);
    }
  }, [users, bookings, partnerApplications, mimiStories]);

  useEffect(() => {
    // Simulate initial data loading for skeleton UI
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auth Persistence Check (Mock + Firebase)
  useEffect(() => {
    // 1. Check Local Storage for mock session
    const storedPhone = window.localStorage.getItem('rent-mimi-logged-in-user');
    if (storedPhone) {
        const user = users.find(u => u.phone === storedPhone);
        if (user) {
            setCurrentUser(user);
            return;
        }
    }

    // 2. Fallback to Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const phoneNumber = firebaseUser.phoneNumber?.replace('+82', '010').replace(/\s/g, '') || '';
        // Try to match with local users loosely
        const foundUser = users.find(u => u.phone.endsWith(phoneNumber.slice(-8))); 
        if (foundUser) {
            setCurrentUser(foundUser);
            window.localStorage.setItem('rent-mimi-logged-in-user', foundUser.phone);
        }
      }
    });
    return () => unsubscribe();
  }, [users]);


  const handleLoginSuccess = (phone: string) => {
      const user = users.find(u => u.phone === phone);
      if (user) {
        setCurrentUser(user);
        window.localStorage.setItem('rent-mimi-logged-in-user', user.phone);
        return true;
      }
      return false;
  };
  
  const handleSignUpSuccess = (userData: Omit<User, 'roles'>, roleType: 'client' | 'partner') => {
      const newUser: User = {
          ...userData,
          roles: ['client'], 
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      window.localStorage.setItem('rent-mimi-logged-in-user', newUser.phone);
      
      if (roleType === 'partner') {
          setPendingPartnerApplication(true);
      }
      return true;
  }

  const handleLogout = async () => {
    await signOut(auth);
    window.localStorage.removeItem('rent-mimi-logged-in-user');
    setCurrentUser(null);
    setAuthScreen('login');
  };
  
  const checkUserExists = (phone: string): boolean => {
      return users.some(u => u.phone === phone);
  }

  const handleNewBooking = (newBookingData: Omit<Booking, 'id' | 'user' | 'status' | 'mimi'>, mimi?: User) => {
    if (currentUser) {
      const newBooking: Booking = {
        id: Date.now().toString(),
        user: currentUser,
        ...newBookingData,
        status: 'pending',
        mimi: mimi,
        payoutStatus: 'none',
      };
      setBookings(prev => [...prev, newBooking]);
    }
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
    setBookings(prev =>
      prev.map(b => (b.id === updatedBooking.id ? updatedBooking : b))
    );
  };

  const handleUpdateBookingStatus = (bookingId: string, status: 'awaiting_payment' | 'approved' | 'rejected' | 'completed') => {
    setBookings(prev => 
      prev.map(b => {
        if (b.id === bookingId) {
          const updatedBooking = { ...b, status };
          if (status === 'completed') {
            updatedBooking.payoutStatus = 'pending';
            if (!updatedBooking.mimi) {
              const partners = users.filter(u => u.roles.includes('partner'));
              if (partners.length > 0) {
                updatedBooking.mimi = partners[Math.floor(Math.random() * partners.length)];
              }
            }
          }
          return updatedBooking;
        }
        return b;
      })
    );
  };

  const handleAssignMimi = (bookingId: string, partnerId: string) => {
    const partnerApp = partnerApplications.find(app => app.id === partnerId);
    if (partnerApp) {
        setBookings(prev =>
            prev.map(b =>
                b.id === bookingId
                    ? { ...b, mimi: partnerApp.applicant }
                    : b
            )
        );
        alert(`${partnerApp.formData.name} 미미가 배정되었습니다.`);
    }
  };

  const handleAddReview = (bookingId: string, review: { rating: number; comment: string }) => {
    setBookings(prev =>
        prev.map(b =>
            b.id === bookingId ? { ...b, review: { ...review, isFeatured: false } } : b
        )
    );
  };

  const handleAddMimiReview = (bookingId: string, mimiReview: { rating: number; comment: string }) => {
    setBookings(prev =>
        prev.map(b =>
            b.id === bookingId ? { ...b, mimiReview } : b
        )
    );
  };

  const handleToggleReviewFeature = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId && b.review) {
          return {
            ...b,
            review: { ...b.review, isFeatured: !b.review.isFeatured }
          };
        }
        return b;
      })
    );
  };

  const handleUpdatePayoutStatus = (bookingId: string, payoutStatus: 'pending' | 'completed') => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, payoutStatus } : b))
    );
  };
  
  const handleFinishPartnerApplication = () => {
    setPendingPartnerApplication(false);
  };

  const handlePartnerApplicationSubmit = (formData: PartnerApplicationData) => {
    if (!currentUser) return;

    const newApplication: PartnerApplication = {
        id: Date.now().toString(),
        applicant: currentUser,
        formData: { ...formData, availableForBooking: true, grade: 'BRONZE' },
        isRecommended: false,
    };
    setPartnerApplications(prev => [...prev, newApplication]);
    
    // FIX: Correctly add 'partner' role to the current user state after a successful application.
    const updatedUser = {
        ...currentUser,
        roles: [...new Set([...currentUser.roles, 'partner'])] as Role[]
    };
    setCurrentUser(updatedUser);
    setUsers(prevUsers => 
        prevUsers.map(u => u.phone === currentUser.phone ? updatedUser : u)
    );

    alert('미미 신청이 완료되었습니다. 지금부터 미미로 활동할 수 있습니다.');
    handleFinishPartnerApplication();
  };
  
  const handleTogglePartnerRecommendation = (applicationId: string) => {
    setPartnerApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? { ...app, isRecommended: !app.isRecommended }
          : app
      )
    );
  };

  const handleUpdatePartnerPublicProfile = (applicationId: string, publicProfile: PublicMimiProfile) => {
    setPartnerApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? { ...app, publicProfile }
          : app
      )
    );
  };

  const handleUpdatePartnerProfile = (applicationId: string, formData: PartnerApplicationData) => {
    setPartnerApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? { ...app, formData }
          : app
      )
    );
  };
  
  const handleTogglePartnerAvailability = (applicationId: string) => {
    setPartnerApplications(prev =>
        prev.map(app =>
            app.id === applicationId
                ? {
                    ...app,
                    formData: {
                        ...app.formData,
                        availableForBooking: !(app.formData.availableForBooking ?? true)
                    }
                  }
                : app
        )
    );
  };

  const handleUpdateMimiGrade = (applicationId: string, grade: MimiGrade) => {
    setPartnerApplications(prev =>
      prev.map(app =>
        app.id === applicationId ? { ...app, formData: { ...app.formData, grade } } : app
      )
    );
  };

  const handleOutfitInfoSubmit = (bookingId: string, userRole: 'client' | 'mimi', outfitInfo: OutfitInfo) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          const roleKey = userRole === 'client' ? 'client' : 'mimi';
          return {
            ...b,
            outfitExchange: {
              ...b.outfitExchange,
              [roleKey]: outfitInfo,
            },
          };
        }
        return b;
      })
    );
  };

  const handleMeetingAdjustmentRequest = (bookingId: string, request: Omit<MeetingAdjustment, 'status' | 'requestedAt'>) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              meetingAdjustment: {
                ...request,
                status: 'pending',
                requestedAt: Date.now(),
              },
            }
          : b
      )
    );
  };

  const handleMeetingAdjustmentResponse = (bookingId: string, response: 'accepted' | 'rejected') => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId && b.meetingAdjustment) {
          const updatedBooking = { ...b, meetingAdjustment: { ...b.meetingAdjustment, status: response } };
          if (response === 'accepted') {
            if (updatedBooking.meetingAdjustment.type === 'time' && updatedBooking.meetingAdjustment.details.time) {
              const [hour, minute] = updatedBooking.time.split(':').map(Number);
              const delayMinutes = parseInt(updatedBooking.meetingAdjustment.details.time, 10);
              const newTime = new Date();
              newTime.setHours(hour, minute + delayMinutes, 0, 0);
              updatedBooking.time = `${newTime.getHours().toString().padStart(2, '0')}:${newTime.getMinutes().toString().padStart(2, '0')}`;
            } else if (updatedBooking.meetingAdjustment.type === 'location' && updatedBooking.meetingAdjustment.details.location) {
              updatedBooking.location = updatedBooking.meetingAdjustment.details.location;
            }
          }
          return updatedBooking;
        }
        return b;
      })
    );
  };

  const handleNewMimiStory = (content: string) => {
    if (!currentUser || !currentUser.roles.includes('partner')) return;
    
    const mimiApp = partnerApplications.find(app => app.applicant.phone === currentUser.phone);
    if (!mimiApp) return;

    const newStory: MimiStory = {
        id: Date.now().toString(),
        mimiApplicationId: mimiApp.id,
        mimiName: mimiApp.publicProfile?.name || mimiApp.formData.name,
        mimiProfilePhotoUrl: mimiApp.publicProfile?.facePhotoDataUrl || (mimiApp.formData.facePhotoDataUrls && mimiApp.formData.facePhotoDataUrls[0]) || null,
        content,
        createdAt: Date.now(),
    };

    setMimiStories(prev => [newStory, ...prev]);
  };

   const handleSendSecureMessage = (bookingId: string, text: string, sender: 'client' | 'mimi') => {
        setBookings(prev =>
            prev.map(b => {
                if (b.id === bookingId) {
                    const newMessage = { sender, text, timestamp: Date.now() };
                    const existingMessages = b.secureChat?.messages || [];
                    return {
                        ...b,
                        secureChat: {
                            messages: [...existingMessages, newMessage]
                        }
                    };
                }
                return b;
            })
        );
    };

    const handleUpdatePartnerAvailabilityDates = (applicationId: string, availableDates: string[]) => {
        setPartnerApplications(prev =>
            prev.map(app =>
                app.id === applicationId
                    ? {
                        ...app,
                        formData: {
                            ...app.formData,
                            availableDates,
                        }
                    }
                    : app
            )
        );
    };


  if (pendingPartnerApplication && currentUser) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main>
          <PartnerApplicationScreen
            onBack={handleFinishPartnerApplication}
            onFinish={handlePartnerApplicationSubmit}
          />
        </main>
      </div>
    );
  }

  if (!currentUser) {
    if (authScreen === 'signup') {
      return <SignUpScreen 
        onSignUp={handleSignUpSuccess}
        onNavigateToLogin={() => setAuthScreen('login')} 
        checkUserExists={checkUserExists}
      />;
    }
    return <LoginScreen 
        onLogin={handleLoginSuccess} 
        onNavigateToSignUp={() => setAuthScreen('signup')} 
        checkUserExists={checkUserExists}
    />;
  }

  return <MainApp 
            isLoading={isLoading}
            user={currentUser} 
            users={users}
            onLogout={handleLogout}
            bookings={bookings}
            onNewBooking={handleNewBooking}
            onUpdateBooking={handleUpdateBooking}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onAddReview={handleAddReview}
            onAddMimiReview={handleAddMimiReview}
            onToggleReviewFeature={handleToggleReviewFeature}
            onUpdatePayoutStatus={handleUpdatePayoutStatus}
            partnerApplications={partnerApplications}
            onTogglePartnerRecommendation={handleTogglePartnerRecommendation}
            onUpdatePartnerPublicProfile={handleUpdatePartnerPublicProfile}
            onPartnerApplicationSubmit={handlePartnerApplicationSubmit}
            onUpdatePartnerProfile={handleUpdatePartnerProfile}
            onTogglePartnerAvailability={handleTogglePartnerAvailability}
            onUpdateMimiGrade={handleUpdateMimiGrade}
            onOutfitInfoSubmit={handleOutfitInfoSubmit}
            onMeetingAdjustmentRequest={handleMeetingAdjustmentRequest}
            onMeetingAdjustmentResponse={handleMeetingAdjustmentResponse}
            mimiStories={mimiStories}
            onNewMimiStory={handleNewMimiStory}
            onSendSecureMessage={handleSendSecureMessage}
            onUpdatePartnerAvailabilityDates={handleUpdatePartnerAvailabilityDates}
            onAssignMimi={handleAssignMimi}
         />;
};

export default App;
