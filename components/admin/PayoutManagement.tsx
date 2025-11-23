
import React, { useMemo } from 'react';
import { Booking, PartnerApplication, MimiGrade } from '../../types';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { ClipboardCopyIcon } from '../icons/ClipboardCopyIcon';

interface PayoutManagementProps {
    bookings: Booking[];
    partnerApplications: PartnerApplication[];
    onUpdatePayoutStatus: (bookingId: string, status: 'completed') => void;
}

const GRADE_PAY_RATE: { [key in MimiGrade]: number } = {
    BRONZE: 30000,
    SILVER: 40000,
    GOLD: 50000,
    PLATINUM: 60000,
};

const DATE_OPTIONS = [
    { key: 'instantPhotos', price: 30000 },
    { key: 'handHolding', price: 50000 },
    { key: 'pool', price: 50000 },
    { key: 'outfit', price: 50000 },
    { key: 'drive', price: 50000 },
];

const calculatePayout = (booking: Booking, partnerApplication?: PartnerApplication): number => {
    if (!partnerApplication) return 0;

    const grade = partnerApplication.formData.grade || 'BRONZE';
    const hourlyRate = GRADE_PAY_RATE[grade];
    const durationHours = parseInt(booking.duration, 10) || 0;

    const optionsPrice = DATE_OPTIONS.reduce((total, option) => {
        const key = option.key as keyof typeof booking.options;
        if (booking.options[key]) {
            return total + option.price;
        }
        return total;
    }, 0);

    const transportFee = 10000;

    // Formula: {(Grade Rate * Hours) + Transport Fee + Options Price} * 0.967
    const basePayout = (hourlyRate * durationHours) + transportFee + optionsPrice;
    const finalPayout = Math.floor(basePayout * 0.967);

    return finalPayout > 0 ? finalPayout : 0;
};


const PayoutManagement: React.FC<PayoutManagementProps> = ({ bookings, partnerApplications, onUpdatePayoutStatus }) => {
    const pendingPayouts = useMemo(() => {
        return bookings
            .filter(b => b.status === 'completed' && b.payoutStatus === 'pending' && b.mimi)
            .map(booking => {
                const partnerApp = partnerApplications.find(app => app.applicant.phone === booking.mimi!.phone);
                return {
                    booking,
                    partnerApp,
                    payoutAmount: calculatePayout(booking, partnerApp)
                };
            })
            .sort((a, b) => new Date(a.booking.date).getTime() - new Date(b.booking.date).getTime());
    }, [bookings, partnerApplications]);

    const handleCopy = (accountNumber: string) => {
        navigator.clipboard.writeText(accountNumber).then(() => {
            alert('계좌번호가 복사되었습니다.');
        }, () => {
            alert('복사에 실패했습니다.');
        });
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-accent-navy">정산 관리</h1>
                <p className="text-gray-500">완료된 데이트에 대한 미미 정산 내역입니다.</p>
            </div>

            {pendingPayouts.length > 0 ? (
                <div className="space-y-4">
                    {pendingPayouts.map(({ booking, partnerApp, payoutAmount }) => (
                        <div key={booking.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold">{partnerApp?.formData.name || booking.mimi?.nickname} 미미</p>
                                    <p className="text-sm text-gray-600">{booking.date} 데이트</p>
                                </div>
                                <span className="text-lg font-bold text-primary-pink">{payoutAmount.toLocaleString()}원</span>
                            </div>

                            {partnerApp && (
                                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2 mb-3">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-600">계좌정보</p>
                                        <button onClick={() => handleCopy(partnerApp.formData.accountNumber)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-accent-navy">
                                            <ClipboardCopyIcon className="w-3 h-3" />
                                            복사
                                        </button>
                                    </div>
                                    <p className="text-gray-800 font-mono text-right">{partnerApp.formData.accountNumber}</p>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button 
                                    onClick={() => onUpdatePayoutStatus(booking.id, 'completed')}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
                                >
                                    정산 완료 처리
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500">
                    <CreditCardIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>정산 대기 중인 내역이 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default PayoutManagement;
