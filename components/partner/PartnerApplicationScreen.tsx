import React, { useState } from 'react';
import { PartnerApplicationData, StyleTag } from '../../types';

interface PartnerApplicationScreenProps {
  onBack: () => void;
  onFinish: (formData: PartnerApplicationData) => void;
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const STYLE_TAGS: StyleTag[] = ['청순', '섹시', '귀여움'];

const PartnerApplicationScreen: React.FC<PartnerApplicationScreenProps> = ({ onBack, onFinish }) => {
  const [formData, setFormData] = useState<Omit<PartnerApplicationData, 'latitude' | 'longitude'>>({
    name: '',
    age: '',
    contact: '',
    mbti: '',
    height: '',
    weight: '',
    kakaoId: '',
    region: '',
    rrn: '',
    accountNumber: '',
    sns: '',
    intro: '',
    facePhotoDataUrls: [],
    fullBodyPhotoDataUrls: [],
    availableDays: [],
    styles: [],
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target as { name: 'facePhotoDataUrls' | 'fullBodyPhotoDataUrls', files: FileList | null };
    if (files && files.length > 0) {
        const fileArray = Array.from(files);
        
        let processedCount = 0;
        const newUrls: string[] = [];

        fileArray.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newUrls.push(reader.result as string);
                processedCount++;
                if (processedCount === fileArray.length) {
                     setFormData(prev => ({
                        ...prev,
                        [name]: [...prev[name], ...newUrls],
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
        
        e.target.value = '';
    }
  };
  
  const handleRemovePhoto = (fieldName: 'facePhotoDataUrls' | 'fullBodyPhotoDataUrls', indexToRemove: number) => {
    setFormData(prev => ({
        ...prev,
        [fieldName]: prev[fieldName].filter((_, index) => index !== indexToRemove)
    }));
  };
  
  const handleDayToggle = (day: string) => {
    setFormData(prev => {
        const currentDays = prev.availableDays;
        if (currentDays.includes(day)) {
            return { ...prev, availableDays: currentDays.filter(d => d !== day) };
        } else {
            return { ...prev, availableDays: [...currentDays, day] };
        }
    });
  };

  const handleStyleToggle = (style: StyleTag) => {
    setFormData(prev => {
        const currentStyles = prev.styles;
        if (currentStyles.includes(style)) {
            return { ...prev, styles: currentStyles.filter(s => s !== style) };
        } else {
            return { ...prev, styles: [...currentStyles, style] };
        }
    });
  };

  const handleSetCurrentLocation = () => {
    setLocationStatus('위치 정보 확인 중...');
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            setLocationStatus(`위치가 설정되었습니다 (위도: ${position.coords.latitude.toFixed(4)}, 경도: ${position.coords.longitude.toFixed(4)})`);
        },
        (error) => {
            setLocationStatus('위치 정보를 가져올 수 없습니다. 권한을 확인해주세요.');
            console.error(error);
        }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const completeFormData: PartnerApplicationData = {
        ...formData,
        latitude: location?.latitude,
        longitude: location?.longitude,
    };
    onFinish(completeFormData);
  };
  
  const inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-accent-navy">미미 신청하기</h1>
            <button onClick={onBack} className="text-sm font-semibold text-gray-600 hover:text-gray-800">뒤로가기</button>
        </div>
        <p className="text-gray-600 mb-6">아래 정보를 정확하게 입력해주세요. 모든 정보는 안전하게 관리됩니다.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input type="text" id="name" name="name" onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">나이</label>
              <input type="number" id="age" name="age" onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <input type="tel" id="contact" name="contact" onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
              <label htmlFor="mbti" className="block text-sm font-medium text-gray-700 mb-1">MBTI</label>
              <input type="text" id="mbti" name="mbti" onChange={handleChange} required className={inputStyle} />
            </div>
             <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">키 (cm)</label>
              <input type="number" id="height" name="height" onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">몸무게 (kg)</label>
              <input type="number" id="weight" name="weight" onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
              <label htmlFor="kakaoId" className="block text-sm font-medium text-gray-700 mb-1">카톡 ID</label>
              <input type="text" id="kakaoId" name="kakaoId" onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">주요 활동 지역</label>
              <input type="text" id="region" name="region" placeholder="예: 서울 강남구" onChange={handleChange} required className={inputStyle} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">활동 지역 위치 설정</label>
            <button
                type="button"
                onClick={handleSetCurrentLocation}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl border border-gray-300 hover:bg-gray-200"
            >
                현재 위치로 활동 지역 설정
            </button>
            {locationStatus && <p className="text-xs text-gray-600 mt-2 text-center">{locationStatus}</p>}
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">나의 스타일 (중복선택 가능)</label>
            <div className="grid grid-cols-3 gap-2">
                {STYLE_TAGS.map(style => (
                    <button
                        type="button"
                        key={style}
                        onClick={() => handleStyleToggle(style)}
                        className={`px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-colors ${
                            formData.styles.includes(style)
                                ? 'bg-primary-pink text-white border-primary-pink'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary-pink/50'
                        }`}
                    >
                        #{style}
                    </button>
                ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">데이트 가능 요일 (중복선택 가능)</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {DAYS.map(day => (
                    <button
                        type="button"
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-colors ${
                            formData.availableDays.includes(day)
                                ? 'bg-primary-pink text-white border-primary-pink'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary-pink/50'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>
          </div>
          <div>
            <label htmlFor="rrn" className="block text-sm font-medium text-gray-700 mb-1">주민등록번호</label>
            <input type="text" id="rrn" name="rrn" placeholder="예: 990101-2000000" onChange={handleChange} required className={inputStyle} />
          </div>
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">계좌번호</label>
            <input type="text" id="accountNumber" name="accountNumber" placeholder="은행명 계좌번호 예금주" onChange={handleChange} required className={inputStyle} />
          </div>
          <div>
            <label htmlFor="sns" className="block text-sm font-medium text-gray-700 mb-1">SNS 주소 (선택)</label>
            <input type="text" id="sns" name="sns" placeholder="인스타그램, 페이스북 등" onChange={handleChange} className={inputStyle} />
          </div>
          <div>
            <label htmlFor="intro" className="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
            <textarea id="intro" name="intro" rows={5} placeholder="자신의 매력, 성격, 가능한 데이트 스타일 등을 자유롭게 어필해주세요." onChange={handleChange} required className={inputStyle}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">사진 첨부</label>
            <div className="space-y-4">
                 <div>
                    <label htmlFor="facePhotoDataUrls" className="block text-sm font-medium text-gray-700 mb-1">얼굴사진</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.facePhotoDataUrls.map((url, index) => (
                            <div key={index} className="relative">
                                <img src={url} alt={`얼굴 사진 ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhoto('facePhotoDataUrls', index)}
                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                                >&times;</button>
                            </div>
                        ))}
                    </div>
                    <input 
                        type="file" 
                        id="facePhotoDataUrls" 
                        name="facePhotoDataUrls" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        required={formData.facePhotoDataUrls.length === 0}
                        multiple
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-pink/10 file:text-primary-pink hover:file:bg-primary-pink/20" 
                    />
                    <p className="text-xs text-gray-500 mt-1">가장 자신있는 얼굴 사진을 여러장 첨부해주세요.</p>
                </div>
                <div>
                    <label htmlFor="fullBodyPhotoDataUrls" className="block text-sm font-medium text-gray-700 mb-1">전신사진</label>
                     <div className="flex flex-wrap gap-2 mb-2">
                        {formData.fullBodyPhotoDataUrls.map((url, index) => (
                            <div key={index} className="relative">
                                <img src={url} alt={`전신 사진 ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhoto('fullBodyPhotoDataUrls', index)}
                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                                >&times;</button>
                            </div>
                        ))}
                    </div>
                    <input 
                        type="file" 
                        id="fullBodyPhotoDataUrls" 
                        name="fullBodyPhotoDataUrls" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        required={formData.fullBodyPhotoDataUrls.length === 0}
                        multiple
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-pink/10 file:text-primary-pink hover:file:bg-primary-pink/20" 
                    />
                    <p className="text-xs text-gray-500 mt-1">본인의 매력을 가장 잘 나타내는 전신 사진을 여러장 첨부해주세요.</p>
                </div>
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-primary-pink text-white font-bold py-3 px-6 rounded-2xl transition-all transform hover:scale-105">
              신청서 제출하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerApplicationScreen;