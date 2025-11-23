
import React, { useMemo } from 'react';
import { PartnerApplication, Booking, MimiGrade } from '../../types';
import { StarIcon } from '../icons/StarIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';

interface ActivityAnalysisProps {
    partnerApplication: PartnerApplication;
    bookings: Booking[];
}

const GRADE_HIERARCHY: MimiGrade[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];

const GRADE_REQUIREMENTS: { [key in MimiGrade]?: { dates: number; rating: number } } = {
    SILVER: { dates: 10, rating: 4.5 },
    GOLD: { dates: 30, rating: 4.7 },
    PLATINUM: { dates: 50, rating: 4.8 },
};

const ActivityAnalysis: React.FC<ActivityAnalysisProps> = ({ partnerApplication, bookings }) => {
    const completedBookings = useMemo(() => 
        bookings.filter(b => b.status === 'completed'),
    [bookings]);

    const stats = useMemo(() => {
        const totalDates = completedBookings.length;
        const reviews = completedBookings.map(b => b.review).filter(Boolean);
        const averageRating = reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r!.rating, 0) / reviews.length 
            : 0;

        const monthlyCounts: { [key: string]: number } = {};
        completedBookings.forEach(b => {
            const monthKey = b.date.substring(0, 7); // YYYY-MM
            monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
        });
        
        return { totalDates, averageRating, monthlyCounts };
    }, [completedBookings]);
    
    const currentGrade = partnerApplication.formData.grade || 'BRONZE';
    const currentGradeIndex = GRADE_HIERARCHY.indexOf(currentGrade);
    const nextGrade = currentGradeIndex < GRADE_HIERARCHY.length - 1 ? GRADE_HIERARCHY[currentGradeIndex + 1] : null;
    const nextGradeRequirements = nextGrade ? GRADE_REQUIREMENTS[nextGrade] : null;

    const renderProgressBar = (value: number, total: number) => {
        const percentage = Math.min((value / total) * 100, 100);
        return (
            <div className="relative h-2.5 w-full bg-gray-200 rounded-full">
                <div 
                    className="absolute top-0 left-0 h-2.5 rounded-full bg-green-500" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
             <div>
                <h1 className="text-2xl font-bold text-accent-navy">활동 분석</h1>
                <p className="text-gray-500">나의 활동 데이터를 확인하고 성장하세요.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-sm font-semibold text-gray-500">총 데이트</p>
                    <p className="text-3xl font-bold text-accent-navy mt-1">{stats.totalDates}</p>
                </div>
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-sm font-semibold text-gray-500">평균 만족도</p>
                    <div className="flex items-center justify-center mt-1">
                        <StarIcon className="w-6 h-6 text-yellow-400 mr-1"/>
                        <p className="text-3xl font-bold text-accent-navy">{stats.averageRating.toFixed(1)}</p>
                    </div>
                </div>
            </div>

            {nextGrade && nextGradeRequirements && (
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                     <h2 className="text-lg font-bold text-accent-navy mb-4">다음 등급 <span className="text-primary-pink">{nextGrade}</span>까지</h2>
                     <div className="space-y-4 text-sm">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="font-semibold">누적 데이트</span>
                                <span>{stats.totalDates} / {nextGradeRequirements.dates}</span>
                            </div>
                            {renderProgressBar(stats.totalDates, nextGradeRequirements.dates)}
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="font-semibold">평균 만족도</span>
                                <span>{stats.averageRating.toFixed(1)} / {nextGradeRequirements.rating.toFixed(1)}</span>
                            </div>
                            {renderProgressBar(stats.averageRating, nextGradeRequirements.rating)}
                        </div>
                     </div>
                </div>
            )}

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                 <h2 className="text-lg font-bold text-accent-navy mb-4">월별 데이트 횟수</h2>
                 {Object.keys(stats.monthlyCounts).length > 0 ? (
                    <div className="space-y-3">
                        {Object.entries(stats.monthlyCounts)
                            .sort(([a], [b]) => b.localeCompare(a))
                            .map(([month, count]) => (
                                <div key={month} className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-gray-600">{month}</span>
                                    <span className="font-bold text-accent-navy">{count}회</span>
                                </div>
                            ))}
                    </div>
                 ) : (
                    <p className="text-sm text-gray-500 text-center py-8">아직 완료된 데이트가 없습니다.</p>
                 )}
            </div>
        </div>
    );
};

export default ActivityAnalysis;
