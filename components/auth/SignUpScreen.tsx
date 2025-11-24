
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
          
          container.innerHTML = '';

          // 2. Create new verifier
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
          
          // 3. Render
          await verifier.render();
          
          // 4. Store
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
    setSuccessMessage(null);
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
        setSuccessMessage('인증번호가 발송되었습니다.');
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
            setError(`[설정 필요] Firebase 콘솔에 도메인(${domain})을 등록해주세요.`);
        } else if (error.code === 'auth/invalid-phone-number') {
            setError('전화번호 형식이 올바르지 않습니다.');
        } else if (error.code === 'auth/too-many-requests') {
            setError('너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.');
        } else {
            setError('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
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
        <div className="flex flex-col items-center mb-10 animate-fade-in">
          <div className="bg-white p-4 rounded-full shadow-md mb-4">
            <HeartIcon className="w-12 h-12 text-primary-pink" />
          </div>
          <h1 className="text-3xl font-bold text-accent-navy">Rent-Mimi</h1>
          <p className="text-gray-500 mt-2 text-sm">회원가입하고 시작해보세요</p>
        </div>

        <form onSubmit={handleSignUp} className="bg-white p-8 rounded-3xl shadow-xl space-y-6 animate-slide-in-up border border-gray-100">
          
          <div className="bg-gray-50 p-1 rounded-2xl flex border border-gray-200">
                <button type="button" onClick={() => setRoleType('client')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${roleType === 'client' ? 'bg-white text-primary-pink shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>고객</button>
                <button type="button" onClick={() => setRoleType('partner')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${roleType === 'partner' ? 'bg-white text-accent-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>미미 (파트너)</button>
          </div>

          <div className="space-y-1">
            <label htmlFor="phone-signup" className="block text-sm font-bold text-gray-700 ml-1">휴대폰 번호</label>
            <div className="flex gap-2">
              <input 
                type="tel" 
                id="phone-signup" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="01012345678" 
                className="flex-grow w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink transition-all text-gray-800 placeholder-gray-400 font-medium"
              />
              <button 
                type="button" 
                onClick={handleGetCode} 
                disabled={isLoading || confirmationResult !== null}
                className={`flex-shrink-0 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all shadow-sm
                    ${confirmationResult 
                        ? 'bg-green-50 text-green-600 border border-green-200' 
                        : 'bg-accent-navy text-white hover:bg-opacity-90 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed'
                    }`}
              >
                {isLoading ? '전송중..' : confirmationResult ? '전송됨' : '인증요청'}
              </button>
            </div>
            {successMessage && <p className="text-xs text-green-600 font-medium ml-1 mt-1 flex items-center gap-1">✅ {successMessage}</p>}
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden space-y-4 ${confirmationResult ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div>
              <label htmlFor="otp-signup" className="block text-sm font-bold text-gray-700 ml-1 mb-1">인증번호</label>
              <input type="number" id="otp-signup" value={otp} onChange={e => setOtp(e.target.value)} placeholder="인증번호 6자리" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink transition-all text-gray-800 font-medium tracking-widest text-center" />
            </div>
            <div>
                <label htmlFor="nickname" className="block text-sm font-bold text-gray-700 ml-1 mb-1">이름 (닉네임)</label>
                <input type="text" id="nickname" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="앱에서 사용할 이름" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink/50 focus:border-primary-pink transition-all text-gray-800 font-medium" />
            </div>
          </div>
          
           {error && (
               <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-500 font-medium break-keep text-center animate-fade-in">
                  {error}
               </div>
           )}
           
           <div id={containerId}></div>

          <button type="submit" disabled={!confirmationResult || isLoading} className="w-full bg-primary-pink text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary-pink/30 hover:shadow-primary-pink/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-300 disabled:shadow-none disabled:transform-none">
             {isLoading ? '처리중...' : '가입 완료'}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            이미 회원이신가요?{' '}
            <button onClick={onNavigateToLogin} className="font-bold text-primary-pink hover:underline ml-1">
              로그인 하기
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
