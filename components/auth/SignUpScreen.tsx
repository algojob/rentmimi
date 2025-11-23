
import React, { useState, useEffect, useRef } from 'react';
import { HeartIcon } from '../icons/HeartIcon';
import { auth } from '../../services/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

interface SignUpScreenProps {
  onSignUp: (userData: { phone: string; nickname: string; region: string }, roleType: 'client' | 'partner') => boolean;
  onNavigateToLogin: () => void;
  checkUserExists: (phone: string) => boolean;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onNavigateToLogin, checkUserExists }) => {
  const [phone, setPhone] = useState('010');
  const [otp, setOtp] = useState('');
  const [nickname, setNickname] = useState('');
  const [roleType, setRoleType] = useState<'client' | 'partner'>('client');
  
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const containerId = 'recaptcha-container-signup';

  useEffect(() => {
    // Cleanup on unmount
    return () => {
        if (verifierRef.current) {
            try {
                verifierRef.current.clear();
            } catch (e) {}
            verifierRef.current = null;
        }
        if ((window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = null;
        }
    };
  }, []);

  const setupRecaptcha = async () => {
      const container = document.getElementById(containerId);
      if (!container) {
          console.error(`Recaptcha container not found`);
          return null;
      }

      try {
          // 1. Robust Cleanup
          if (verifierRef.current) {
              try { verifierRef.current.clear(); } catch(e) {}
              verifierRef.current = null;
          }
          if ((window as any).recaptchaVerifier) {
              try { (window as any).recaptchaVerifier.clear(); } catch(e) {}
              (window as any).recaptchaVerifier = null;
          }
          
          // 2. Clear DOM container
          container.innerHTML = '';

          // 3. Create new verifier
          const verifier = new RecaptchaVerifier(auth, containerId, {
              'size': 'invisible',
              'callback': () => {
                  console.log("reCAPTCHA solved");
              },
              'expired-callback': () => {
                   setError('보안 인증이 만료되었습니다. 다시 시도해주세요.');
                   setIsLoading(false);
                   verifierRef.current = null;
              }
          });
          
          // 4. Render
          await verifier.render();
          
          // 5. Store
          verifierRef.current = verifier;
          (window as any).recaptchaVerifier = verifier;
          
          return verifier;
      } catch (e) {
          console.error("Recaptcha init failed", e);
          verifierRef.current = null;
          container.innerHTML = '';
          return null;
      }
  };

  const formatPhoneNumber = (phone: string) => {
    let cleanPhone = phone.replace(/-/g, '').trim();
    if (cleanPhone.startsWith('0')) {
        return `+82${cleanPhone.substring(1)}`;
    }
    return `+82${cleanPhone}`;
  };

  const handleGetCode = async () => {
    setError(null);
    setIsLoading(true);

    const cleanPhone = phone.replace(/-/g, '').trim();

    if (!/^\d{10,11}$/.test(cleanPhone)) {
        setError('올바른 전화번호를 입력해주세요.');
        setIsLoading(false);
        return;
    }
    if (checkUserExists(cleanPhone)) {
        setError('이미 가입된 번호입니다. 로그인을 진행해주세요.');
        setIsLoading(false);
        return;
    }

    // Init Recaptcha Lazy/JIT
    const appVerifier = await setupRecaptcha();
    if (!appVerifier) {
         setError('보안 검증 시스템 초기화 실패. 새로고침 후 다시 시도해주세요.');
         setIsLoading(false);
         return;
    }

    const formattedPhone = formatPhoneNumber(cleanPhone);

    try {
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(confirmation);
    } catch (error: any) {
        console.error("Error sending SMS", error);
        
        // Cleanup on error
        if (verifierRef.current) {
            try { verifierRef.current.clear(); } catch(e) {}
            verifierRef.current = null;
            const container = document.getElementById(containerId);
            if (container) container.innerHTML = '';
        }

        if (error.code === 'auth/internal-error') {
            const domain = window.location.hostname;
            const msg = `⚠️ 도메인 승인 필요 ⚠️\n\n현재 도메인: ${domain}\n\nFirebase 콘솔 > Authentication > Settings > Authorized domains 에 위 도메인을 추가해주세요.`;
            alert(msg);
            setError(msg);
        } else if (error.code === 'auth/invalid-phone-number') {
            setError('전화번호 형식이 올바르지 않습니다.');
        } else if (error.code === 'auth/too-many-requests') {
            setError('너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.');
        } else {
            setError(`인증번호 전송에 실패했습니다: ${error.message}`);
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nickname) {
        setError('이름을 입력해주세요.');
        return;
    }
     if (!otp) {
        setError('인증번호를 입력해주세요.');
        return;
    }
    if (!confirmationResult) {
        setError('인증번호를 먼저 요청해주세요.');
        return;
    }

    setIsLoading(true);
    try {
        await confirmationResult.confirm(otp);
        const cleanPhone = phone.replace(/-/g, '').trim();
        const success = onSignUp({ phone: cleanPhone, nickname, region: '' }, roleType);
        if (!success) {
            setError('회원가입 처리 중 오류가 발생했습니다.');
        }
    } catch (error: any) {
        console.error("Error verifying OTP", error);
        if (error.code === 'auth/invalid-verification-code') {
            setError('인증번호가 올바르지 않습니다.');
        } else {
            setError('인증에 실패했습니다.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
          <HeartIcon className="w-16 h-16 text-primary-pink" />
          <h1 className="text-3xl font-bold text-primary-pink mt-2">Rent-Mimi</h1>
          <p className="text-gray-500">회원가입하고 미미를 만나보세요</p>
        </div>

        <form onSubmit={handleSignUp} className="bg-white p-8 rounded-2xl shadow-lg space-y-4">
          
          <div>
            <label className="text-sm font-medium text-gray-700">가입 유형</label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-2xl p-1">
                <button type="button" onClick={() => setRoleType('client')} className={`w-1/2 py-2 rounded-xl text-sm font-semibold transition-all ${roleType === 'client' ? 'bg-primary-pink text-white shadow' : 'text-gray-600'}`}>고객으로 가입</button>
                <button type="button" onClick={() => setRoleType('partner')} className={`w-1/2 py-2 rounded-xl text-sm font-semibold transition-all ${roleType === 'partner' ? 'bg-accent-navy text-white shadow' : 'text-gray-600'}`}>미미로 가입</button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {roleType === 'partner' ? '편리하게 미미 활동이 가능합니다' : '회원가입 후 데이트 신청이 가능합니다'}
            </p>
          </div>

          <div>
            <label htmlFor="phone-signup" className="text-sm font-medium text-gray-700">전화번호</label>
            <div className="flex items-center mt-1">
              <input 
                type="tel" 
                id="phone-signup" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="예: 01012345678" 
                className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-l-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink" 
              />
              <button 
                type="button" 
                onClick={handleGetCode} 
                disabled={isLoading || !!confirmationResult}
                className="flex-shrink-0 px-4 py-3 bg-gray-200 text-sm font-semibold text-gray-600 rounded-r-2xl hover:bg-gray-300 disabled:opacity-50"
              >
                {confirmationResult ? '전송됨' : '인증번호 받기'}
              </button>
            </div>
          </div>
          {confirmationResult && (
            <div>
              <label htmlFor="otp-signup" className="text-sm font-medium text-gray-700">인증번호</label>
              <input type="number" id="otp-signup" value={otp} onChange={e => setOtp(e.target.value)} placeholder="인증번호 6자리 입력" className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink" />
            </div>
          )}
           <div>
            <label htmlFor="nickname" className="text-sm font-medium text-gray-700">이름</label>
            <input type="text" id="nickname" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="이름을 적어주세요" className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink" />
           </div>
          
           {error && (
               <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 break-words whitespace-pre-wrap">
                  {error}
               </div>
           )}
           
           <div id={containerId}></div>

          <button type="submit" disabled={!confirmationResult || isLoading} className="w-full bg-primary-pink text-white font-bold py-3 px-6 rounded-2xl transition-transform transform hover:scale-105 disabled:bg-gray-300">
             {isLoading ? '처리중...' : '회원가입 완료'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          이미 회원이신가요?{' '}
          <button onClick={onNavigateToLogin} className="font-semibold text-primary-pink hover:underline">
            로그인하기
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;
