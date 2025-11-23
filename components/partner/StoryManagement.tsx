
import React, { useState } from 'react';
import { MimiStory, PartnerApplication } from '../../types';
import { PaperAirplaneIcon } from '../icons/PaperAirplaneIcon';

const timeSince = (date: number): string => {
  const seconds = Math.floor((Date.now() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + "년 전";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "달 전";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "일 전";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "시간 전";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "분 전";
  }
  return "방금 전";
};


interface StoryManagementProps {
    partnerApplication: PartnerApplication;
    myStories: MimiStory[];
    onNewStory: (content: string) => void;
}

const StoryManagement: React.FC<StoryManagementProps> = ({ partnerApplication, myStories, onNewStory }) => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isLoading) return;

        setIsLoading(true);
        // Simulate a short delay
        setTimeout(() => {
            onNewStory(content);
            setContent('');
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-accent-navy mb-2">스토리 작성하기</h1>
            <p className="text-gray-500 mb-6">고객들에게 데이트를 어필하는 짧은 글을 남겨보세요. 가장 최근 글이 홈 화면에 노출됩니다.</p>
            
            <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`${partnerApplication.formData.name}님의 스토리를 작성해주세요...\n예) 오늘 날씨 정말 좋네요! 같이 산책해요!`}
                    rows={4}
                    maxLength={150}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-pink"
                    disabled={isLoading}
                />
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">{content.length} / 150</p>
                    <button
                        type="submit"
                        disabled={isLoading || !content.trim()}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary-pink rounded-lg hover:bg-opacity-90 disabled:bg-gray-300"
                    >
                        <PaperAirplaneIcon className="w-4 h-4" />
                        <span>게시하기</span>
                    </button>
                </div>
            </form>

            <div>
                <h2 className="text-xl font-bold text-accent-navy mb-4">나의 스토리 내역</h2>
                {myStories.length > 0 ? (
                    <div className="space-y-4">
                        {myStories.map(story => (
                            <div key={story.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-700">{story.content}</p>
                                <p className="text-xs text-gray-400 text-right mt-2">{timeSince(story.createdAt)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>아직 작성한 스토리가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryManagement;
