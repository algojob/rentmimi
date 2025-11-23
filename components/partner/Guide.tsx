
import React from 'react';

interface GuideProps {
    onShowPrivacyPolicy: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-accent-navy mb-4">{title}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
            {children}
        </div>
    </div>
);

const InfoCard: React.FC<{ title: string; children: React.ReactNode; color: 'pink' | 'navy' | 'gray' }> = ({ title, children, color }) => {
    const colorClasses = {
        pink: 'bg-primary-pink/5 border-primary-pink/20 text-primary-pink',
        navy: 'bg-accent-navy/5 border-accent-navy/10 text-accent-navy',
        gray: 'bg-gray-50 border-gray-200 text-gray-700',
    };
    const titleColor = {
         pink: 'text-primary-pink',
         navy: 'text-accent-navy',
         gray: 'text-gray-800'
    }

    return (
        <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
            <h3 className={`font-bold text-base mb-1 ${titleColor[color]}`}>{title}</h3>
            <div className="space-y-1 text-xs sm:text-sm text-gray-600">{children}</div>
        </div>
    );
};

const PayItem: React.FC<{ num: string; text: string }> = ({ num, text }) => (
    <div className="flex items-center gap-3 p-2 border-b last:border-0 border-gray-100">
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary-pink text-white font-bold rounded-full text-xs">{num}</span>
        <p className="font-medium text-gray-800">{text}</p>
    </div>
);

const OptionCard: React.FC<{ title: string; price: string }> = ({ title, price }) => (
    <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-200">
        <p className="font-semibold text-gray-700 text-sm">{title}</p>
        <p className="text-base font-bold text-primary-pink mt-1">{price}</p>
    </div>
);

const TimelineStep: React.FC<{ title: string; description: string; isLast?: boolean }> = ({ title, description, isLast }) => (
    <div className="relative pl-6 pb-6 last:pb-0">
        {!isLast && <div className="absolute left-2.5 top-2 bottom-0 w-0.5 bg-gray-200"></div>}
        <div className="absolute left-0 top-1.5 h-5 w-5 rounded-full bg-white flex items-center justify-center border-2 border-primary-pink z-10">
             <div className="h-1.5 w-1.5 rounded-full bg-primary-pink"></div>
        </div>
        <div>
            <p className="font-bold text-sm text-accent-navy">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
    </div>
);


const GradeCard: React.FC<{ title: string; colorClasses: string; pay: string; criteria: string[] }> = ({ title, colorClasses, pay, criteria }) => (
    <div className={`p-4 rounded-xl border ${colorClasses}`}>
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-base">{title}</h3>
            <p className="font-bold text-sm">{pay}</p>
        </div>
        <ul className="list-disc list-inside text-xs space-y-1 opacity-90">
            {criteria.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <p className="font-bold text-primary-pink mb-2 text-sm">Q. {question}</p>
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">{children}</div>
    </div>
);

const WorkInfoItem: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-sm text-accent-navy mb-1">{title}</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{children}</p>
        </div>
    </div>
);

const RuleItem: React.FC<{ num: string; children: React.ReactNode }> = ({ num, children }) => (
     <div className="flex items-start gap-3 bg-red-50 p-3 rounded-xl border border-red-100">
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-red-500 text-white font-bold rounded-full text-xs mt-0.5">{num}</span>
        <div className="flex-grow text-xs sm:text-sm text-gray-800 font-medium">{children}</div>
    </div>
);


const Guide: React.FC<GuideProps> = ({ onShowPrivacyPolicy }) => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-xl animate-fade-in">
            <div className="text-center mb-8">
                <div className="inline-block px-4 py-1 rounded-full bg-white border border-primary-pink text-primary-pink font-bold text-xs mb-2 shadow-sm">
                    일잘러 미미를 위한
                </div>
                <h2 className="text-2xl font-extrabold text-accent-navy">렌트미미 가이드</h2>
                <p className="mt-2 text-sm text-gray-500">새로운 여정의 시작, 환영합니다!</p>
            </div>
            
            <Section title="렌트미미가 궁금해요">
                <div className="space-y-3">
                    <InfoCard title="안심 데이트" color="pink">
                        <p>성적 서비스는 금지되어 있습니다.</p>
                        <p>일체의 불법행위는 절대 불가합니다.</p>
                    </InfoCard>
                    <InfoCard title="NO.1 보수" color="navy">
                        <p>일급 30만원 이상 가능합니다.</p>
                        <p>데이트 옵션에 따른 특별 수당이 지급됩니다.</p>
                    </InfoCard>
                    <InfoCard title="맞춤형 시스템" color="gray">
                        <p>고객 선별 및 매칭이 이루어집니다.</p>
                        <p>자신의 스케줄에 맞게 일할 수 있습니다.</p>
                    </InfoCard>
                </div>
            </Section>

            <Section title="렌트미미 급여">
                <div className="flex flex-col">
                    <PayItem num="01" text="시급 3~5만원 이상" />
                    <PayItem num="02" text="지명 시 2만원 추가" />
                    <PayItem num="03" text="기본 2시간 보장" />
                    <PayItem num="04" text="전화 및 온라인 데이트 가능" />
                    <PayItem num="05" text="등급 상승 시 시급 상승" />
                    <PayItem num="06" text="교통비 및 23시 이후 택시비 지급" />
                    <PayItem num="07" text="데이트 종료 후 즉시 지급" />
                </div>
            </Section>
            
            <Section title="데이트 옵션">
                <div className="grid grid-cols-2 gap-3">
                    <OptionCard title="즉석사진" price="+2만원" />
                    <OptionCard title="손잡기" price="+4만원" />
                    <OptionCard title="드라이브" price="+4만원" />
                    <OptionCard title="복장지정" price="+4만원" />
                </div>
            </Section>

            <Section title="데이트 진행">
                 <div className="space-y-2 mt-2">
                    <TimelineStep title="데이트 매칭" description="데이트 내용 및 고객 정보 확인" />
                    <TimelineStep title="데이트 예약 확정" description="고객 결제 후 예약 확정" />
                    <TimelineStep title="오늘의 의상 알려주기" description="만남 1시간 전 의상 확인" />
                    <TimelineStep title="만남 및 데이트 진행" description="데이트 장소에서 고객 만나기" />
                    <TimelineStep title="데이트 종료 및 급여 지급" description="데이트 종료 후 입금" isLast />
                </div>
            </Section>

            <Section title="일이 궁금해요 & 활동지수">
                <div className="space-y-6">
                    <WorkInfoItem icon="💬" title="대화">
                        미미는 고객과 친해져서 데이트나 대화를 리드하여 즐겁게 해주는 일입니다. 고객의 진심이나 마음을 헤아리고 친밀감을 증진시키도록 노력합니다.
                    </WorkInfoItem>
                    <WorkInfoItem icon="⭐" title="리뷰 시스템">
                        데이트가 끝나면 고객으로부터 미미 리뷰가 진행됩니다. 렌트미미 서비스 개선과 미미 등급에 반영되므로, 항상 고객 만족에 최선을 다합니다.
                    </WorkInfoItem>
                     <WorkInfoItem icon="✨" title="나를 어필하기">
                        렌트미미에서는 자신을 더 표현하는 방법이 있습니다. 성격, 외모, 자기 PR 등으로 고객에게 더 큰 관심을 불러일으키도록 합니다. 나만의 매력을 어필해 보세요!
                    </WorkInfoItem>
                     <WorkInfoItem icon="📊" title="미미 활동지수">
                        렌트미미와의 커뮤니케이션, 월별 데이팅 횟수, 데이트 만족도, 온라인 PR 지수 등에 따라 미미 등급을 측정하여 시급에 반영합니다.
                    </WorkInfoItem>
                </div>
            </Section>
            
            <Section title="등급별 시급 체계 & 전화/온라인">
                <div className="space-y-3">
                    <GradeCard title="베이직" colorClasses="bg-white border border-gray-300 text-gray-800" pay="3만원" criteria={['신규 입사자', '기본 데이트 시간, 매너, 복장 준수']} />
                    <GradeCard title="레귤러" colorClasses="bg-rose-50 border border-rose-200 text-rose-900" pay="4만원" criteria={['데이트 10회, 지명 5회 이상', '고객만족도 4.5 이상']} />
                    <GradeCard title="플레티넘" colorClasses="bg-accent-navy text-white border border-accent-navy" pay="5만원" criteria={['데이트 30회, 지명 15회 이상', '고정 지명 고객 5명 이상']} />
                    <GradeCard title="다이아몬드" colorClasses="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0" pay="5만원 + α" criteria={['모델, 미스코리아, 인플루언서', '고정 지명고객 10명 이상']} />
                </div>
                <div className="mt-6">
                    <h3 className="font-bold text-sm text-accent-navy mb-3">📞 전화 / 💻 온라인 데이트</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-sm">전화 데이트</h4>
                                <p className="text-xs text-gray-500 mt-0.5">*23# 누르고 통화</p>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-primary-pink">1만원</span>
                                <span className="text-xs text-gray-500">10분당</span>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-sm">온라인 데이트</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Zoom 화상 연결</p>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-primary-pink">3만원</span>
                                <span className="text-xs text-gray-500">1시간</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="FAQ & 행동수칙">
                <div className="space-y-3">
                    <FaqItem question="안전하게 데이트를 진행할 수 있나요?">
                        <p>안심할 수 있는 데이트 진행이 가장 중요합니다! 스타벅스와 같이 '사람들이 많고 공개적인 장소'에서 데이트를 진행하면 문제없이 가능합니다.</p>
                    </FaqItem>
                    <FaqItem question="고객이 드라이브를 하자고 하면요?">
                        <p>'드라이브 데이트'는 사전에 미리 안내해 드립니다! 데이트 도중 고객의 차량에 탑승하지 마세요. 장소 이동 시에는 택시, 대중교통, 도보를 이용하시면 됩니다.</p>
                    </FaqItem>
                    <FaqItem question="데이트 종료 후 연장은 어떻게 진행되나요?">
                        <p>데이트 종료 시간이 되면 고객에게 종료됨을 말씀드리고 마무리해주시면 됩니다. 만약 고객이 데이트 연장을 원하시면 렌트미미에 연장 여부를 '꼭' 말씀해주세요! (협의 없이 연장을 진행하면 비용이 지급되지 않습니다.)</p>
                    </FaqItem>
                    <FaqItem question="집이나 사무실을 구경시켜준다고 하는데 괜찮을까요?">
                        <p>안됩니다! 일반적인 카페나 식당이 아닌 폐쇄적인 공간에서의 데이트는 불가합니다.</p>
                    </FaqItem>
                     <FaqItem question="고객이 따로 돈을 줄 테니 몰래 연장하거나 따로 만나자고 하면 어떻게 해야 하나요?">
                        <p>안전한 데이트를 위해 사적인 만남은 단호하게 거절해주세요. 개인적으로 만날 경우, 약속된 돈을 받지 못하거나 무례한 언행 및 불쾌한 요구, 성추행 등의 문제가 발생할 수 있습니다. 반드시 거절 부탁드립니다.</p>
                    </FaqItem>
                    <FaqItem question="렌트미미 활동을 잘하는 방법이 있을까요?">
                        <p>고객과 함께하는 시간과 대화가 즐거우면 좋습니다. 다양하게 질문하며 서로를 알아가고, 함께 좋아하는 대화 주제를 찾아보세요. 공통점이 없다면 함께 즐길 수 있는 보드게임이나 오락실 데이트를 해보는 것도 좋은 방법입니다!</p>
                    </FaqItem>
                </div>
                
                <h4 className="font-bold text-base text-red-500 mt-8 mb-4">🚨 반드시 지켜주세요</h4>
                 <div className="space-y-2">
                    <RuleItem num="1">
                        <p>고객과 약속된 시간 10분 전에는 도착해주세요! 늦을 경우에는 고객에게 상황을 꼭 전달해주세요!</p>
                    </RuleItem>
                    <RuleItem num="2">
                        <p>처음 만났을 때, 밝은 인사와 미소로 긍정적인 에너지를 전달해주세요.</p>
                    </RuleItem>
                    <RuleItem num="3">
                        <p>스킨십 시도 / 성적 발언 / 불쾌한 제스처 / 몰래 촬영 / 음주 강요 / 차량 이동 중 이상한 경로 / 불법적인 제안 시 즉시 공유 부탁드립니다.</p>
                    </RuleItem>
                    <RuleItem num="4">
                        <p>고객이 연장을 원할 경우, 앱에서 연장을 선택해주시고 운영자 확인 후에 진행 부탁드립니다.</p>
                    </RuleItem>
                    <RuleItem num="5">
                        <p>고객에게 전화번호, 카카오톡 ID, 인스타그램 등 개인 연락처를 절대 제공해서는 안 됩니다.</p>
                    </RuleItem>
                    <RuleItem num="6">
                        <p>위급상황 시, 운영자 번호(010-5588-9566)로 즉시 연락해주세요.</p>
                    </RuleItem>
                 </div>
            </Section>

            <div className="text-center mt-8 pt-8 border-t border-gray-200">
                <button
                    onClick={onShowPrivacyPolicy}
                    className="text-xs text-gray-400 hover:text-primary-pink hover:underline"
                >
                    개인정보처리방침
                </button>
            </div>
        </div>
    );
};

export default Guide;
