import React, { useState, useMemo } from 'react';
import { Booking } from '../../types';
import { ChartBarIcon } from '../icons/ChartBarIcon';

interface DashboardProps {
    bookings: Booking[];
}

const Dashboard: React.FC<DashboardProps> = ({ bookings }) => {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    });

    const monthlyStats = useMemo(() => {
        const completedBookings = bookings.filter(b => b.status === 'completed');
        
        const filteredByMonth = completedBookings.filter(b => {
            if (!b.date) return false;
            const bookingDate = new Date(b.date);
            const bookingMonth = `${bookingDate.getFullYear()}-${(bookingDate.getMonth() + 1).toString().padStart(2, '0')}`;
            return bookingMonth === selectedMonth;
        });

        const totalRevenue = filteredByMonth.reduce((sum, b) => sum + b.totalCost, 0);
        const mimiPayout = totalRevenue * 0.7; // 70% for mimi
        const netProfit = totalRevenue * 0.3; // 30% for platform

        return {
            totalRevenue,
            mimiPayout,
            netProfit,
            completedCount: filteredByMonth.length,
        };
    }, [bookings, selectedMonth]);

    const monthOptions = useMemo(() => {
        const options = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            const label = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
            options.push({ value, label });
        }
        return options;
    }, []);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-accent-navy">월별 실적</h1>
                    <p className="text-gray-500">완료된 데이트 기준 통계입니다.</p>
                </div>
                <select 
                    value={selectedMonth} 
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink bg-white appearance-none"
                >
                    {monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="총 매출" value={monthlyStats.totalRevenue} />
                <StatCard title="미미 정산액" value={monthlyStats.mimiPayout} />
                <StatCard title="플랫폼 순수익" value={monthlyStats.netProfit} highlight />
            </div>

            <div className="mt-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <p className="font-semibold text-gray-700">
                    <span className="text-primary-pink font-bold">{selectedMonth.split('-')[1]}월</span>에는 총 <span className="text-primary-pink font-bold">{monthlyStats.completedCount}건</span>의 데이트가 완료되었습니다.
                </p>
            </div>
            
             {monthlyStats.completedCount === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <ChartBarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>선택하신 월에 완료된 데이트 내역이 없습니다.</p>
                </div>
            )}
        </div>
    );
};

const StatCard: React.FC<{title: string, value: number, highlight?: boolean}> = ({ title, value, highlight = false }) => (
    <div className={`p-6 rounded-2xl shadow-sm border ${highlight ? 'bg-primary-pink/10 border-primary-pink/20' : 'bg-white border-gray-100'}`}>
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${highlight ? 'text-primary-pink' : 'text-accent-navy'}`}>
            {value.toLocaleString()}원
        </p>
    </div>
);

export default Dashboard;