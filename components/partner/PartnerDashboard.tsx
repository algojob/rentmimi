
import React from 'react';
import { Booking } from '../../types';
import { CalendarIcon } from '../icons/CalendarIcon';
import { BanknotesIcon } from '../icons/BanknotesIcon';
import { BellIcon } from '../icons/BellIcon';

interface PartnerDashboardProps {
    bookings: Booking[];
    onNavigateToReservations: () => void;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ bookings, onNavigateToReservations }) => {
    const today = new Date().toISOString().split('T')[0];

    const upcomingBookings = bookings.filter(b => b.date >= today && (b.status === 'approved' || b.status === 'pending'));
    const todayBookings = upcomingBookings.filter(b => b.date === today && b.status === 'approved');
    const newRequests = bookings.filter(b => b.status === 'pending');
    
    // Simple weekly earnings estimate - sum of completed bookings in the last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const weeklyEarnings = bookings
        .filter(b => b.status === 'completed' && new Date(b.date) >= lastWeek)
        .reduce((sum, b) => sum + (b.totalCost * 0.7), 0); // Assuming 70% payout

    return (
        <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-accent-navy">대시보드</h1>
                <p className="text-gray-500">오늘의 활동을 한눈에 확인하세요.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoCard 
                    icon={<CalendarIcon className="w-6 h-6 text-white"/>} 
                    title="오늘의 데이트" 
                    value={todayBookings.length.toString()} 
                    unit="건" 
                    color="bg-primary-pink" 
                />
                <InfoCard 
                    icon={<BellIcon className="w-6 h-6 text-white"/>} 
                    title="새로운 요청" 
                    value={newRequests.length.toString()} 
                    unit="건" 
                    color="bg-yellow-500" 
                    onClick={onNavigateToReservations}
                />
                <InfoCard 
                    icon={<BanknotesIcon className="w-6 h-6 text-white"/>} 
                    title="주간 예상 수익" 
                    value={weeklyEarnings.toLocaleString()} 
                    unit="원" 
                    color="bg-green-500" 
                />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-accent-navy mb-4">오늘의 일정 ({todayBookings.length}건)</h2>
                {todayBookings.length > 0 ? (
                    <div className="space-y-3">
                        {todayBookings.map(b => (
                            <div key={b.id} className="bg-gray-50 p-3 rounded-lg">
                                <p className="font-semibold text-sm">{b.time} - {b.user.nickname}님</p>
                                <p className="text-xs text-gray-600">{b.location}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">오늘 예정된 데이트가 없습니다.</p>
                )}
            </div>

             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-accent-navy">새로운 예약 요청 ({newRequests.length}건)</h2>
                    <button onClick={onNavigateToReservations} className="text-sm font-semibold text-primary-pink hover:underline">
                        전체보기
                    </button>
                </div>
                {newRequests.length > 0 ? (
                    <div className="space-y-3">
                        {newRequests.slice(0, 3).map(b => ( // Show latest 3
                            <div key={b.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                                <p className="font-semibold text-sm">{b.date} {b.time} - {b.user.nickname}님</p>
                                <p className="text-xs text-gray-600">{b.location}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">새로운 예약 요청이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    unit: string;
    color: string;
    onClick?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value, unit, color, onClick }) => {
    const content = (
        <div className={`p-4 rounded-2xl shadow-sm text-white ${color}`}>
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">{icon}</div>
                <p className="text-sm font-semibold">{title}</p>
            </div>
            <p className="text-right mt-2">
                <span className="text-3xl font-bold">{value}</span>
                <span className="text-sm ml-1">{unit}</span>
            </p>
        </div>
    );

    if (onClick) {
        return <button onClick={onClick} className="w-full text-left">{content}</button>;
    }
    return content;
};

export default PartnerDashboard;
