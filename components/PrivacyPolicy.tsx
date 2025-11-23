import React from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold text-accent-navy mb-3">{title}</h3>
        <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
            {children}
        </div>
    </div>
);

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-50 z-[100] flex flex-col animate-slide-in-up">
      <header className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-200 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <button onClick={onClose} className="flex items-center gap-2 p-2 -ml-2 text-gray-600 hover:text-accent-navy">
                <ChevronDownIcon className="w-6 h-6 rotate-90" />
                <span className="font-semibold">뒤로가기</span>
            </button>
            <h1 className="text-lg font-bold text-accent-navy">개인정보처리방침</h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-none">
            <h2 className="text-2xl font-bold text-accent-navy text-center mb-6">개인정보처리방침</h2>
            
            <Section title="제 1조 (개인정보의 처리 목적)">
                <p>렌트미미는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>홈페이지 회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리시 법정대리인의 동의여부 확인, 각종 고지·통지, 고충처리 등을 목적으로 개인정보를 처리합니다.</li>
                    <li>재화 또는 서비스 제공: 물품배송, 서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금결제·정산, 채권추심 등을 목적으로 개인정보를 처리합니다.</li>
                    <li>고충처리: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 등의 목적으로 개인정보를 처리합니다.</li>
                </ol>
            </Section>
            
            <Section title="제 2조 (개인정보의 처리 및 보유 기간)">
                <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                <p>각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
                 <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>홈페이지 회원 가입 및 관리 : 홈페이지 탈퇴시까지. 다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료시까지.
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                           <li>관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료시까지</li>
                           <li>홈페이지 이용에 따른 채권·채무관계 잔존시에는 해당 채권·채무관계 정산시까지</li>
                        </ul>
                    </li>
                    <li>재화 또는 서비스 제공 : 재화·서비스 공급완료 및 요금결제·정산 완료시까지.</li>
                </ol>
            </Section>
            
            <Section title="제 3조 (개인정보의 제3자 제공)">
                <p>회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
            </Section>

            <Section title="제 4조 (개인정보처리의 위탁)">
                 <p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다. 회사는 위탁계약 체결시 개인정보 보호법 제25조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>
            </Section>

            <Section title="제 5조 (정보주체의 권리·의무 및 행사방법)">
                <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
                 <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>개인정보 열람요구</li>
                    <li>오류 등이 있을 경우 정정 요구</li>
                    <li>삭제요구</li>
                    <li>처리정지 요구</li>
                 </ol>
            </Section>

            <Section title="제 6조 (처리하는 개인정보 항목)">
                <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>필수항목 : 성명, 생년월일, 성별, 연락처, 주소, 아이디, 비밀번호</li>
                    <li>선택항목 : 이메일, 신용카드정보, 은행계좌정보 등 결제정보</li>
                </ul>
            </Section>

            <Section title="제 7조 (개인정보의 파기)">
                <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
            </Section>
            
            <Section title="제 8조 (개인정보의 안전성 확보 조치)">
                <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다: 관리적 조치(내부관리계획 수립·시행, 정기적 직원 교육 등), 기술적 조치(개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치), 물리적 조치(전산실, 자료보관실 등의 접근통제).</p>
            </Section>

             <Section title="제 9조 (개인정보 보호책임자)">
                <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>성명 : 강경환</li>
                    <li>직책 : 대표</li>
                    <li>연락처 : 010-5588-9566</li>
                </ul>
            </Section>

            <Section title="제 10조 (권익침해 구제방법)">
                <p>정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>개인정보 침해신고센터 (한국인터넷진흥원 운영) : (국번없이) 118</li>
                    <li>개인정보 분쟁조정위원회 : (국번없이) 1833-6972</li>
                    <li>대검찰청 사이버범죄수사단 : 02-3480-3573</li>
                    <li>경찰청 사이버안전국 : (국번없이) 182</li>
                </ul>
            </Section>

            <Section title="제 11조 (정책 변경에 따른 공지의무)">
                <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
            </Section>

            <div className="border-t pt-4 mt-6">
                 <p className="text-xs text-gray-500"><strong>공고일자:</strong> 2024년 1월 1일</p>
                 <p className="text-xs text-gray-500"><strong>시행일자:</strong> 2024년 1월 1일</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
