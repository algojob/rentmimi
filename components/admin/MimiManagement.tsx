

import React, { useState, useMemo } from 'react';
import { PartnerApplication, PublicMimiProfile, MimiGrade } from '../../types';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { UsersIcon } from '../icons/UsersIcon';

interface MimiManagementProps {
  applications: PartnerApplication[];
  onToggleRecommendation: (applicationId: string) => void;
  onUpdatePartnerPublicProfile: (applicationId: string, profileData: PublicMimiProfile) => void;
  onUpdateMimiGrade: (applicationId: string, grade: MimiGrade) => void;
}

const GRADES: MimiGrade[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; label: string; }> = ({ checked, onChange, label }) => (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`block w-12 h-6 rounded-full ${checked ? 'bg-primary-pink' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
      </div>
      <div className="ml-3 text-sm font-medium text-gray-700">{label}</div>
    </label>
);

const EditProfileModal: React.FC<{
    application: PartnerApplication;
    onSave: (data: PublicMimiProfile) => void;
    onClose: () => void;
}> = ({ application, onSave, onClose }) => {
    const [profile, setProfile] = useState<PublicMimiProfile>(() => ({
        name: application.publicProfile?.name || application.formData.name,
        age: application.publicProfile?.age || application.formData.age,
        intro: application.publicProfile?.intro || application.formData.intro,
        facePhotoDataUrl: application.publicProfile?.facePhotoDataUrl || (application.formData.facePhotoDataUrls && application.formData.facePhotoDataUrls[0]) || null,
        region: application.publicProfile?.region || application.formData.region,
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({...prev, [name]: reader.result as string}));
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(profile);
    };
    
    const inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-accent-navy">공개 프로필 수정</h2>
                        <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-800">닫기</button>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">활동명</label>
                        <input type="text" id="name" name="name" value={profile.name} onChange={handleChange} required className={inputStyle} />
                    </div>
                     <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">나이</label>
                        <input type="number" id="age" name="age" value={profile.age} onChange={handleChange} required className={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">활동 지역</label>
                        <input type="text" id="region" name="region" value={profile.region} onChange={handleChange} placeholder="예: 서울 강남" required className={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="intro" className="block text-sm font-medium text-gray-700 mb-1">한 줄 소개</label>
                        <textarea id="intro" name="intro" rows={3} value={profile.intro} onChange={handleChange} required className={inputStyle}></textarea>
                    </div>
                    <div>
                        <label htmlFor="facePhotoDataUrl" className="block text-sm font-medium text-gray-700 mb-1">대표 사진</label>
                        {profile.facePhotoDataUrl && <img src={profile.facePhotoDataUrl} alt="Current" className="w-24 h-24 object-cover rounded-lg mb-2" />}
                        <input 
                            type="file" 
                            id="facePhotoDataUrl" 
                            name="facePhotoDataUrl" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-pink/10 file:text-primary-pink hover:file:bg-primary-pink/20" 
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
                        <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-primary-pink rounded-lg hover:bg-opacity-90">저장하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MimiManagement: React.FC<MimiManagementProps> = ({ applications, onToggleRecommendation, onUpdatePartnerPublicProfile, onUpdateMimiGrade }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingApplication, setEditingApplication] = useState<PartnerApplication | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleExpand = (id: string) => {
        setExpandedId(prevId => (prevId === id ? null : id));
    };

    const filteredApplications = useMemo(() => {
        if (!searchTerm.trim()) {
            return applications;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return applications.filter(app => 
            app.formData.name.toLowerCase().includes(lowercasedTerm) ||
            app.formData.region.toLowerCase().includes(lowercasedTerm)
        );
    }, [applications, searchTerm]);
    
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-accent-navy">미미 관리</h1>
        <p className="text-gray-500">신청 완료된 미미의 목록 및 상세 정보를 확인합니다.</p>
      </div>

      <div className="mb-6">
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="이름 또는 지역으로 검색..."
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink"
        />
      </div>
      
      {applications.length > 0 ? (
        filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                   <button onClick={() => toggleExpand(app.id)} className="w-full flex justify-between items-center p-4 text-left">
                        <div>
                            <h3 className="font-bold text-lg">{app.formData.name} <span className="text-base font-normal">({app.applicant.nickname})</span></h3>
                            <p className="text-sm text-gray-500">{app.applicant.phone}</p>
                        </div>
                        <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform ${expandedId === app.id ? 'rotate-180' : ''}`} />
                   </button>

                   {expandedId === app.id && (
                     <div className="px-4 pb-4 border-t pt-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mb-4">
                           <p><strong>나이:</strong> {app.formData.age}</p>
                           <p><strong>키/몸무게:</strong> {app.formData.height}cm / {app.formData.weight}kg</p>
                           <p><strong>MBTI:</strong> {app.formData.mbti}</p>
                           <p><strong>지역:</strong> {app.formData.region}</p>
                           <p><strong>카톡 ID:</strong> {app.formData.kakaoId}</p>
                           <p><strong>연락처:</strong> {app.formData.contact}</p>
                           {app.formData.availableDays && app.formData.availableDays.length > 0 && (
                            <p className="col-span-2"><strong>가능 요일:</strong> {app.formData.availableDays.join(', ')}</p>
                           )}
                           <p className="col-span-2"><strong>주민번호:</strong> {app.formData.rrn}</p>
                           <p className="col-span-2"><strong>계좌번호:</strong> {app.formData.accountNumber}</p>
                           {app.formData.sns && <p className="col-span-2"><strong>SNS:</strong> {app.formData.sns}</p>}
                           <p className="col-span-2">
                               <strong>데이트 가능여부:</strong>
                               <span className={`font-bold ml-2 ${app.formData.availableForBooking ?? true ? 'text-green-600' : 'text-red-600'}`}>
                                   {app.formData.availableForBooking ?? true ? '가능' : '불가능'}
                               </span>
                           </p>
                        </div>

                        <div className="mb-4">
                            <label htmlFor={`grade-${app.id}`} className="block text-sm font-medium text-gray-700 mb-1">미미 등급</label>
                            <select
                                id={`grade-${app.id}`}
                                value={app.formData.grade || 'BRONZE'}
                                onChange={(e) => onUpdateMimiGrade(app.id, e.target.value as MimiGrade)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink bg-white appearance-none"
                            >
                                {GRADES.map(grade => (
                                    <option key={grade} value={grade}>{grade}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg text-sm mb-4">
                            <p className="font-semibold mb-1">자기소개</p>
                            <p className="text-gray-600 whitespace-pre-wrap">{app.formData.intro}</p>
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                             <div>
                                <p className="font-semibold mb-2">얼굴사진</p>
                                {app.formData.facePhotoDataUrls && app.formData.facePhotoDataUrls.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {app.formData.facePhotoDataUrls.map((url, index) => (
                                            <img key={index} src={url} alt={`얼굴사진 ${index + 1}`} className="w-24 h-24 object-cover rounded-lg shadow-md" />
                                        ))}
                                    </div>
                                 ) : (
                                    <p className="text-gray-500">없음</p>
                                )}
                             </div>
                             <div>
                                <p className="font-semibold mb-2">전신사진</p>
                                 {app.formData.fullBodyPhotoDataUrls && app.formData.fullBodyPhotoDataUrls.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {app.formData.fullBodyPhotoDataUrls.map((url, index) => (
                                            <img key={index} src={url} alt={`전신사진 ${index + 1}`} className="w-24 h-32 object-cover rounded-lg shadow-md" />
                                        ))}
                                    </div>
                                 ) : (
                                    <p className="text-gray-500">없음</p>
                                )}
                             </div>
                         </div>
                         <div className="border-t pt-4 mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-6 space-y-4 sm:space-y-0">
                            <ToggleSwitch
                                label="추천 미미로 설정"
                                checked={!!app.isRecommended}
                                onChange={() => onToggleRecommendation(app.id)}
                            />
                            {app.isRecommended && (
                                 <button 
                                    onClick={() => setEditingApplication(app)}
                                    className="px-4 py-2 text-sm font-semibold text-accent-navy bg-gray-200 rounded-lg hover:bg-gray-300"
                                 >
                                    공개 프로필 수정
                                </button>
                            )}
                        </div>
                     </div>
                   )}
                </div>
              ))}
            </div>
        ) : (
            <div className="text-center py-16 text-gray-500">
                <p>검색 조건에 맞는 미미가 없습니다.</p>
            </div>
        )
      ) : (
        <div className="text-center py-16 text-gray-500">
            <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>신청한 미미가 없습니다.</p>
        </div>
      )}
      {editingApplication && (
        <EditProfileModal
            application={editingApplication}
            onClose={() => setEditingApplication(null)}
            onSave={(updatedProfile) => {
                onUpdatePartnerPublicProfile(editingApplication.id, updatedProfile);
                setEditingApplication(null);
            }}
        />
      )}
    </div>
  );
};

export default MimiManagement;