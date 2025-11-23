
import React, { useState, useEffect, useMemo } from 'react';
import { PartnerApplication, StyleTag } from '../types';
import MimiCardSkeleton from './skeletons/MimiCardSkeleton';


export interface MimiFilter {
    available?: boolean;
}

interface FindProps {
    isLoading: boolean;
    partnerApplications: PartnerApplication[];
    initialFilter: MimiFilter | null;
    setInitialFilter: (filter: MimiFilter | null) => void;
    onMimiSelect: (partner: PartnerApplication) => void;
}

const haversineDistance = (
    coords1: { lat: number; lon: number },
    coords2: { lat: number; lon: number }
): number => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lon - coords1.lon);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // in km
};

const STYLE_TAGS: StyleTag[] = ['청순', '섹시', '귀여움'];

const Find: React.FC<FindProps> = ({ isLoading, partnerApplications, initialFilter, setInitialFilter, onMimiSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>([]);
    const [sortByDistance, setSortByDistance] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<string | null>(null);
    

    const todayDay = new Date().toLocaleString('ko-KR', { weekday: 'short' });
    const todayDate = new Date();
    const todayString = `${todayDate.getFullYear()}-${(todayDate.getMonth() + 1).toString().padStart(2, '0')}-${todayDate.getDate().toString().padStart(2, '0')}`;

    useEffect(() => {
        if (initialFilter?.available) {
            setAvailableOnly(true);
            setInitialFilter(null);
        }
    }, [initialFilter, setInitialFilter]);

    const handleStyleToggle = (style: StyleTag) => {
        setSelectedStyles(prev =>
            prev.includes(style)
                ? prev.filter(s => s !== style)
                : [...prev, style]
        );
    };
    
    const handleSortByDistanceToggle = () => {
        const newSortByDistance = !sortByDistance;
        setSortByDistance(newSortByDistance);

        if (newSortByDistance && !userLocation) {
            setLocationStatus('위치 정보 확인 중...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                    setLocationStatus('가까운 순으로 정렬되었습니다.');
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setLocationStatus('위치 정보를 가져올 수 없습니다. 권한을 확인해주세요.');
                    setSortByDistance(false);
                }
            );
        } else if (!newSortByDistance) {
            setLocationStatus(null);
        }
    };

    
    const displayedMimis = useMemo(() => {
        const filtered = partnerApplications.filter(app => {
            const mimi = app.formData;
            const publicProfile = app.publicProfile;

            const name = publicProfile?.name || mimi.name;
            const region = publicProfile?.region || mimi.region;
            
            // Check general day availability OR specific date availability
            const availableByDay = mimi.availableDays?.includes(todayDay);
            const availableByDate = mimi.availableDates?.includes(todayString);
            const isAvailableToday = availableByDay || availableByDate;

            const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || region.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesAvailability = !availableOnly || (isAvailableToday ?? false);
            const matchesStyle = selectedStyles.length === 0 || selectedStyles.some(style => mimi.styles?.includes(style));

            return matchesSearch && matchesAvailability && matchesStyle;
        });
        
        if (sortByDistance && userLocation) {
            return filtered
                .map(app => {
                    const distance = app.formData.latitude && app.formData.longitude
                        ? haversineDistance(userLocation, { lat: app.formData.latitude, lon: app.formData.longitude })
                        : Infinity;
                    return { ...app, distance };
                })
                .sort((a, b) => a.distance - b.distance);
        }

        return filtered;
    }, [partnerApplications, searchTerm, availableOnly, selectedStyles, sortByDistance, userLocation, todayDay, todayString]);

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      {/* Search and Filters */}
      <div className="sticky top-16 bg-white/95 backdrop-blur-sm py-4 z-40">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="이름 또는 지역으로 검색"
          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-pink"
        />
        <div className="flex space-x-2 mt-3 overflow-x-auto scrollbar-hide">
            <button onClick={() => setAvailableOnly(!availableOnly)} className={`flex-shrink-0 px-4 py-1.5 text-sm border rounded-2xl font-semibold transition-colors ${availableOnly ? 'bg-primary-pink text-white border-primary-pink' : 'bg-white hover:bg-gray-100'}`}>오늘 ({todayDay}) 가능</button>
            <button onClick={handleSortByDistanceToggle} className={`flex-shrink-0 px-4 py-1.5 text-sm border rounded-2xl font-semibold transition-colors ${sortByDistance ? 'bg-primary-pink text-white border-primary-pink' : 'bg-white hover:bg-gray-100'}`}>가까운 순</button>
            {STYLE_TAGS.map(style => (
                <button 
                    key={style}
                    onClick={() => handleStyleToggle(style)} 
                    className={`flex-shrink-0 px-4 py-1.5 text-sm border rounded-2xl font-semibold transition-colors ${selectedStyles.includes(style) ? 'bg-primary-pink text-white border-primary-pink' : 'bg-white hover:bg-gray-100'}`}
                >
                    #{style}
                </button>
            ))}
        </div>
        {locationStatus && <p className="text-xs text-center mt-2 text-gray-500">{locationStatus}</p>}
      </div>
      
      {/* Mimi List */}
      <div className="space-y-4">
        {isLoading ? (
             Array.from({ length: 5 }).map((_, index) => <MimiCardSkeleton key={index} type="list" />)
        ) : displayedMimis.length > 0 ? (
            displayedMimis.map((app) => {
                const mimi = app.formData;
                const publicProfile = app.publicProfile;
                const name = publicProfile?.name || mimi.name;
                const age = publicProfile?.age || mimi.age;
                const region = publicProfile?.region || mimi.region;
                const photo = publicProfile?.facePhotoDataUrl || (mimi.facePhotoDataUrls && mimi.facePhotoDataUrls[0]) || `https://picsum.photos/seed/${app.id}/150/150`;
                
                const availableByDay = mimi.availableDays?.includes(todayDay);
                const availableByDate = mimi.availableDates?.includes(todayString);
                const isAvailableToday = availableByDay || availableByDate;
                
                const distance = (app as any).distance;

                return (
                <button key={app.id} onClick={() => onMimiSelect(app)} className="w-full flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow text-left">
                <img
                  src={photo}
                  alt={name}
                  className="w-24 h-24 object-cover rounded-2xl"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{name}, {age}</h3>
                        <p className="text-sm text-gray-600 mt-1">{region}</p>
                         {distance !== undefined && distance !== Infinity && (
                            <p className="text-sm font-bold text-primary-pink mt-1">
                                약 {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                            </p>
                        )}
                      </div>
                      {isAvailableToday && (
                        <span className="flex-shrink-0 text-xs bg-primary-pink/20 text-primary-pink font-bold py-1 px-2 rounded-full">
                          오늘가능
                        </span>
                      )}
                  </div>
                </div>
              </button>
            )})
        ) : (
            <div className="text-center py-16 text-gray-500">
                <p>조건에 맞는 미미가 없습니다.</p>
                <p className="text-sm">다른 필터를 선택해보세요.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Find;
