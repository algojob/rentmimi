
import React, { useState, useRef, useEffect } from 'react';
import { Booking, User } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { HeartIcon } from './icons/HeartIcon';

interface SecureChatRoomProps {
    user: User;
    booking: Booking;
    onBack: () => void;
    onSendMessage: (bookingId: string, text: string, sender: 'client' | 'mimi') => void;
}

const SecureChatRoom: React.FC<SecureChatRoomProps> = ({ user, booking, onBack, onSendMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const currentUserRole = user.roles.includes('partner') ? 'mimi' : 'client';
    const otherParty = currentUserRole === 'client' ? booking.mimi : booking.user;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [booking.secureChat?.messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '') return;
        onSendMessage(booking.id, inputValue, currentUserRole);
        setInputValue('');
    };
    
    // Simulate chat expiration
    const isChatExpired = false; // In a real app, this would be based on booking time.

    return (
        <div className="fixed inset-0 bg-gray-50 z-[100] flex flex-col animate-slide-in-up">
            <header className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-200 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <button onClick={onBack} className="flex items-center gap-2 p-2 -ml-2 text-gray-600 hover:text-accent-navy">
                            <ChevronDownIcon className="w-6 h-6 rotate-90" />
                        </button>
                        <div className="text-center">
                            <h1 className="text-lg font-bold text-accent-navy">
                                {otherParty?.nickname}님과의 안심채팅
                            </h1>
                            <p className="text-xs text-gray-500">데이트 전후 1시간 동안 활성화됩니다</p>
                        </div>
                        <div className="w-12"></div> {/* Spacer */}
                    </div>
                </div>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                {booking.secureChat?.messages && booking.secureChat.messages.length > 0 ? (
                    booking.secureChat.messages.map((message, index) => (
                      <div key={index} className={`flex items-start gap-3 ${message.sender === currentUserRole ? 'justify-end' : 'justify-start'}`}>
                        {message.sender !== currentUserRole && (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                             <HeartIcon className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                            message.sender === currentUserRole
                              ? 'bg-primary-pink text-white rounded-br-none'
                              : 'bg-white text-accent-navy rounded-bl-none border border-gray-200'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                    ))
                ) : (
                    <div className="text-center text-sm text-gray-400 py-10">
                        <p>아직 대화 내용이 없습니다.</p>
                        <p>만남 장소에서 서로를 찾기 위해 대화를 시작해보세요.</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 bg-white border-t border-gray-200">
                {isChatExpired ? (
                    <p className="text-center text-sm text-gray-500">이 채팅방은 만료되었습니다.</p>
                ) : (
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="메시지 보내기..."
                            className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-pink"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={inputValue.trim() === ''}
                            className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-primary-pink text-white disabled:bg-gray-300 transition-colors"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                )}
            </footer>
        </div>
    );
};

export default SecureChatRoom;
