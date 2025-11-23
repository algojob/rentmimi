
import React, { useState, useMemo } from 'react';
import { PartnerApplication, Booking } from '../../types';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface ScheduleProps {
    partnerApplication: PartnerApplication;
    bookings: Booking[];
    onUpdateAvailabilityDates: (applicationId: string, dates: string[]) => void;
}

const Schedule: React.FC<ScheduleProps> = ({ partnerApplication, bookings, onUpdateAvailabilityDates }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState<string[]>(partnerApplication.formData.availableDates || []);

    const bookedDates = useMemo(() => 
        new Set(bookings.filter(b => b.status === 'approved').map(b => b.date)), 
    [bookings]);

    const handleDateClick = (date: string) => {
        if (bookedDates.has(date)) return; // Cannot change availability on booked days

        const newSelectedDates = selectedDates.includes(date)
            ? selectedDates.filter(d => d !== date)
            : [...selectedDates, date];
        
        setSelectedDates(newSelectedDates);
        onUpdateAvailabilityDates(partnerApplication.id, newSelectedDates);
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`} className="w-full h-12"></div>);
        
        const days = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            const isBooked = bookedDates.has(dateStr);
            const isSelected = selectedDates.includes(dateStr);

            let classes = "w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-colors";
            if (isBooked) {
                classes += " bg-accent-navy text-white cursor-not-allowed";
            } else if (isSelected) {
                classes += " bg-primary-pink text-white cursor-pointer";
            } else if (isToday) {
                classes += " bg-primary-pink/20 text-primary-pink cursor-pointer";
            } else {
                 classes += " hover:bg-gray-100 cursor-pointer";
            }

            return (
                <div key={day} className="w-full flex justify-center py-1">
                    <button onClick={() => handleDateClick(dateStr)} className={classes} disabled={isBooked}>
                        {day}
                    </button>
                </div>
            );
        });

        return [...blanks, ...days];
    };

    const changeMonth = (delta: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-accent-navy mb-4">스케줄 관리</h1>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4 px-2">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">
                        <ChevronDownIcon className="w-5 h-5 rotate-90" />
                    </button>
                    <h2 className="text-lg font-bold text-accent-navy">
                        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">
                         <ChevronDownIcon className="w-5 h-5 -rotate-90" />
                    </button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-semibold mb-2">
                    {['일', '월', '화', '수', '목', '금', '토'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                    {renderCalendar()}
                </div>
                 <div className="mt-4 pt-4 border-t text-xs space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-primary-pink"></div>
                        <span>선택: 데이트 가능</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-accent-navy"></div>
                        <span>예약 완료 (변경 불가)</span>
                    </div>
                </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
                날짜를 클릭하여 데이트 가능 여부를 설정하세요.
            </p>
        </div>
    );
};

export default Schedule;