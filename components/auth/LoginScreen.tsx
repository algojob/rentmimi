
import React, { useState, useEffect, useRef } from 'react';
import { HeartIcon } from '../icons/HeartIcon';
import { auth } from '../../services/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

interface LoginScreenProps {
  onLogin: (phone: string) => boolean;
  onNavigateToSignUp: () => void;
  checkUserExists: (phone: string) => boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToSignUp, checkUserExists }) => {
    const [phone, setPhone] = useState('010');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const verifierRef = useRef<RecaptchaVerifier | null>(null);
    const containerId = 'recaptcha-container-login';

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
            console.error("Recaptcha container not found");
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

            // 2. Create new verifier (Invisible)
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
            
            // 3. Render explicitly
            await verifier.render();
            
            // 4. Store references
            verifierRef.current = verifier;
            (window as any).recaptchaVerifier = verifier;
            
            return verifier;
        } catch (e) {
            console.error("Recaptcha init failed", e);
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
        
        if (!checkUserExists(cleanPhone)) {
            setError('가입되지 않은 번호입니다. 회원가입을 진행해주세요.');
            setIsLoading(false);
            return;
        }

        // Initialize Recaptcha Just-In-Time
        const appVerifier = await setupRecaptcha();
        
        if (!appVerifier) {
             setError('보안 시스템 초기화에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요.');
             setIsLoading(false);
             return;
        }

        const formattedPhone = formatPhoneNumber(cleanPhone);

        try {
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
            alert("✅ 인증번호 요청 성공!\n\n1. 문자가 안 오면 '스팸 메시지함'을 확인하세요.\n2. '테스트용 전화번호'로 등록하셨다면, 설정해둔 인증코드를 입력하세요.");
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
            } else if (error.code === 'auth/captcha-check-failed') {
                 setError('reCAPTCHA 검증에 실패했습니다. 다시 시도해주세요.');
            } else if (error.code === 'auth/billing-not-enabled') {
                 setError('Firebase 요금제 확인이 필요합니다. (무료 할당량 초과 가능성)');
            } else {
                setError(`인증번호 전송 실패 (${error.code}): ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!otp) {
            setError('인증번호를 입력해주세요.');
            return;
        }
        
        if (!confirmationResult) {
            setError('인증번호 요청을 먼저 해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            await confirmationResult.confirm(otp);
            const cleanPhone = phone.replace(/-/g, '').trim();
            const success = onLogin(cleanPhone);
            if (!success) {
                setError('가입 정보를 찾을 수 없습니다. 관리자에게 문의하세요.');
            }
        } catch (error: any) {
            console.error("Error verifying OTP", error);
            if (error.code === 'auth/invalid-verification-code') {
                setError('인증번호가 올바르지 않습니다.');
            } else {
                 setError('로그인 처리에 실패했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
          <HeartIcon className="w-16 h-16 text-primary-pink" />
          <h1 className="text-3xl font-bold text-primary-pink mt-2">Rent-Mimi</h1>
          <p className="text-gray-500">로그인하여 미미와 만나보세요</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">전화번호</label>
            <div className="flex items-center mt-1">
              <input
                type="tel"
                id="phone"
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
                {confirmationResult ? '재전송' : '인증요청'}
              </button>
            </div>
          </div>
          {confirmationResult && (
          <div className="animate-fade-in">
            <label htmlFor="otp" className="text-sm font-medium text-gray-700">인증번호</label>
            <input
              type="number"
              id="otp"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="인증번호 6자리 입력"
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink"
            />
          </div>
          )}

          {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 break-words whitespace-pre-wrap">
                  {error}
              </div>
          )}
          
          {/* Container ID for invisible reCAPTCHA */}
          <div id={containerId}></div>

          <button
            type="submit"
            disabled={!confirmationResult || isLoading}
            className="w-full bg-primary-pink text-white font-bold py-3 px-6 rounded-2xl transition-transform transform hover:scale-105 disabled:bg-gray-300"
          >
            {isLoading ? '처리중...' : '로그인'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          아직 회원이 아니신가요?{' '}
          <button onClick={onNavigateToSignUp} className="font-semibold text-primary-pink hover:underline">
            회원가입하기
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
