import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getFaqAnswer } from '../services/geminiService';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { HeartIcon } from './icons/HeartIcon';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '안녕하세요, 미미입니다! 무엇을 도와드릴까요? 서비스에 대해 궁금한 점을 물어보세요 😉', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const botResponseText = await getFaqAnswer(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '죄송해요. 메시지를 처리하는 중에 오류가 발생했어요.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-128px)] bg-gray-50">
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-primary-pink flex-shrink-0 flex items-center justify-center">
                 <HeartIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                message.sender === 'user'
                  ? 'bg-primary-pink text-white rounded-br-none'
                  : 'bg-white text-accent-navy rounded-bl-none border border-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-primary-pink flex-shrink-0 flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-white" />
             </div>
             <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-white text-accent-navy rounded-bl-none border border-gray-200">
                <div className="flex items-center justify-center space-x-1 h-5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="미미에게 메시지 보내기..."
            className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-pink"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading || inputValue.trim() === ''}
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-primary-pink text-white disabled:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-pink"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;