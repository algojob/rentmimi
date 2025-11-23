import React from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface TermsOfServiceProps {
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

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-50 z-[100] flex flex-col animate-slide-in-up">
      <header className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-200 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <button onClick={onClose} className="flex items-center gap-2 p-2 -ml-2 text-gray-600 hover:text-accent-navy">
                <ChevronDownIcon className="w-6 h-6 rotate-90" />
                <span className="font-semibold">뒤로가기</span>
            </button>
            <h1 className="text-lg font-bold text-accent-navy">이용규약</h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-none">
            <h2 className="text-2xl font-bold text-accent-navy text-center mb-6">렌트미미 이용규약</h2>
            
            <Section title="제 1조 (목적)">
                <p>본 약관은 렌트미미(이하 "회사")가 제공하는 렌탈여친 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
            </Section>
            
            <Section title="제 2조 (정의)">
                <ol className="list-decimal list-inside space-y-2">
                    <li>"서비스"라 함은 회사가 제공하는 온라인 플랫폼을 통해 미미(서비스 제공자)와 고객(서비스 이용자)을 연결하여 일정 시간 동안 데이트, 대화, 동행 등의 서비스를 제공하는 것을 말합니다.</li>
                    <li>"회원"이라 함은 회사의 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
                    <li>"미미"라 함은 회사와의 계약을 통해 서비스 제공자로 등록된 자를 말합니다.</li>
                </ol>
            </Section>

            <Section title="제 3조 (약관의 명시와 개정)">
                 <ol className="list-decimal list-inside space-y-2">
                    <li>회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
                    <li>회사는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 "정보통신망법")" 등 관련 법을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
                    <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 제1항의 방식에 따라 그 개정약관의 적용일자 30일 전부터 적용일자 전일까지 공지합니다.</li>
                </ol>
            </Section>

            <Section title="제 4조 (서비스 이용 계약 체결)">
                <ol className="list-decimal list-inside space-y-2">
                    <li>이용계약은 회원이 되고자 하는 자(이하 "가입신청자")가 약관의 내용에 대하여 동의를 한 다음 회원가입신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</li>
                    <li>회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                            <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                            <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                            <li>만 19세 미만의 미성년자인 경우</li>
                            <li>사회의 안녕과 질서, 미풍양속을 저해할 목적으로 신청한 경우</li>
                            <li>기타 회사가 정한 이용 요건에 충족되지 않았을 경우</li>
                        </ul>
                    </li>
                </ol>
            </Section>

            <Section title="제 6조 (회원의 의무 및 금지행위)">
                 <ol className="list-decimal list-inside space-y-2">
                    <li>회원은 다음 행위를 하여서는 안 됩니다.
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>미미의 동의 없는 신체 접촉 또는 성적인 행위를 요구하거나 시도하는 행위</li>
                            <li>폭언, 욕설, 협박 등 불쾌감을 주는 언행</li>
                            <li>미미의 개인정보(연락처, 주소 등)를 요구하거나 유포하는 행위</li>
                            <li>마약, 불법 촬영 등 범죄 행위 또는 이에 준하는 행위</li>
                            <li>예약된 서비스 내용과 다른 무리한 요구를 하는 행위</li>
                            <li>회사와 사전 협의되지 않은 장소로 미미를 유인하는 행위</li>
                            <li>서비스 이용 요금을 지불하지 않는 행위</li>
                            <li>회사의 운영을 방해하는 모든 행위</li>
                        </ul>
                    </li>
                    <li>제1항의 금지행위를 위반할 경우, 회사는 즉시 서비스를 중단하고 법적 조치를 취할 수 있으며, 해당 회원은 영구적으로 서비스 이용 자격이 박탈됩니다.</li>
                </ol>
            </Section>

            <Section title="제 7조 (예약 및 환불 규정)">
                <ol className="list-decimal list-inside space-y-2">
                    <li>모든 예약은 100% 선입금으로 확정됩니다.</li>
                    <li>예약 취소 및 환불 규정은 다음과 같습니다.
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                            <li>예약 시간 24시간 전 취소: 전액 환불</li>
                            <li>예약 시간 12시간 전 취소: 50% 환불</li>
                            <li>예약 시간 12시간 이내 취소 또는 노쇼(No-show): 환불 불가</li>
                        </ul>
                    </li>
                    <li>천재지변 등 불가항력적인 사유로 서비스 이용이 불가능한 경우 전액 환불됩니다.</li>
                </ol>
            </Section>

            <Section title="제 8조 (회사의 의무)">
                <ol className="list-decimal list-inside space-y-2">
                    <li>회사는 관련법과 이 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며, 계속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.</li>
                    <li>회사는 회원의 개인정보를 보호하기 위해 보안시스템을 갖추어야 하며 개인정보취급방침을 공시하고 준수합니다.</li>
                </ol>
            </Section>
            
            <Section title="제 9조 (면책조항)">
                <ol className="list-decimal list-inside space-y-2">
                    <li>회사는 회원과 미미 간의 자발적인 의사로 이루어지는 서비스 과정에서 발생하는 모든 문제에 대해 직접적인 책임을 지지 않습니다. 단, 회사는 문제 해결을 위해 적극적으로 중재하고 협조합니다.</li>
                    <li>회원이 본 약관의 규정을 위반함으로 인하여 회사에 손해가 발생하게 되는 경우, 이 약관을 위반한 회원은 회사에 발생하는 모든 손해를 배상하여야 합니다.</li>
                </ol>
            </Section>

            <Section title="제 10조 (재판권 및 준거법)">
                <ol className="list-decimal list-inside space-y-2">
                    <li>회사와 회원 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 회원의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다.</li>
                    <li>회사와 회원 간에 제기된 전자상거래 소송에는 한국법을 적용합니다.</li>
                </ol>
            </Section>

            <div className="border-t pt-4 mt-6">
                 <p className="text-xs text-gray-500"><strong>부칙:</strong> 본 약관은 2024년 1월 1일부터 시행됩니다.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;