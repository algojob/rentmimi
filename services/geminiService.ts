
import { GoogleGenAI } from "@google/genai";

// Helper to safely get API Key in Vite environment
const getApiKey = () => {
  // Check for Vite environment variable first
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_KEY) {
    return (import.meta as any).env.VITE_API_KEY;
  }
  // Fallback for other environments (if any), handled safely
  try {
    return process.env.API_KEY;
  } catch (e) {
    return undefined;
  }
};

const API_KEY = getApiKey();

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API Key is missing or not configured correctly. AI Chat features will be disabled.");
}

const FAQ_KNOWLEDGE_BASE = `
### 서비스 이용 방법
- **Q: 서비스를 어떻게 이용하나요?**
  - **A:** 1. 마음에 드는 '미미'를 찾아보세요. 2. '데이트 신청하기' 버튼을 눌러 원하는 날짜, 시간, 장소, 데이트 내용을 입력하세요. 3. 관리자가 확인 후 입금 안내를 드리면, 입금 후 예약이 확정됩니다. 참 쉽죠? 😉

- **Q: 예약은 어떻게 하나요?**
  - **A:** '미미 찾기' 탭에서 마음에 드는 미미를 선택하거나, '예약' 탭에서 직접 예약 신청서를 작성할 수 있어요. 원하는 플랜과 옵션을 선택하고 상세 내용을 적어주시면 저희가 확인 후 연락드릴게요! 💖

- **Q: 지방에서도 데이트가 가능한가요?**
  - **A:** 렌트미미는 전국에서 이용이 가능합니다. 데이트 일정 및 만남장소 예약 신청해주시면 확인후에 안내드리도록 할게요. 🌏

### 요금 및 결제
- **Q: 요금은 어떻게 되나요?**
  - **A:** 요금은 '플랜'과 '데이트 옵션'에 따라 달라져요. FRESH, SPECIAL, PREMIUM, THE BLACK 플랜이 있으며, 각각 시간당 요금이 다릅니다. 추가 옵션을 선택하면 비용이 추가될 수 있어요. 자세한 금액은 예약 신청 페이지에서 확인 가능하답니다! 😊

- **Q: 결제는 어떻게 하나요?**
  - **A:** 예약 신청이 접수되면 관리자가 확인 후 문자로 입금 계좌를 안내해 드려요. 입금이 확인되면 예약이 최종 확정됩니다. ✨

### 안전 및 규칙
- **Q: 서비스 이용은 안전한가요?**
  - **A:** 물론이죠! 저희는 모든 미미님들의 신원을 철저히 확인하고 있으며, 안전한 만남을 위해 최선을 다하고 있어요. 고객님과 미미 모두가 즐거운 시간을 보낼 수 있도록 안전 수칙을 꼭 지켜주세요! 🙏

- **Q: 데이트 중 금지되는 행동이 있나요?**
  - **A:** 네, 그럼요! 미미의 동의 없는 신체 접촉, 불쾌감을 주는 언행, 개인 정보(연락처, 주소 등)를 요구하거나 유포하는 행위는 절대 금지예요. 서로 존중하는 아름다운 데이트 문화를 함께 만들어가요! 💕

### 미미 관련
- **Q: '미미'는 어떤 분들인가요?**
  - **A:** 저희 미미는 엄격한 심사를 통과한 매력적인 분들이에요. 다양한 스타일과 매력을 가진 미미들과 함께 특별한 시간을 만들어보세요! 🌟

### 기타
- **Q: 예약 취소나 환불이 가능한가요?**
  - **A:** 예약 취소 및 환불 규정은 고객센터로 문의해주시면 친절하게 안내해 드릴게요. 📞

- **Q: 미미가 되어보고 싶어요!**
  - **A:** 언제든 환영이에요! 회원가입 시 '미미로 가입'을 선택하거나, 고객센터로 문의주시면 자세히 안내해 드릴게요! 🥳
`;

const SYSTEM_INSTRUCTION = `당신은 데이트 서비스 'rent-mimi.com'의 친절하고 상냥한 AI 어시스턴트 '미미'입니다. 당신의 임무는 주어진 '자주 묻는 질문(FAQ) 정보'를 바탕으로 고객의 질문에 답변하는 것입니다.

규칙:
1. 답변은 반드시 제공된 '자주 묻는 질문(FAQ) 정보'에 근거해야 합니다.
2. 고객의 질문과 가장 관련 있는 정보를 찾아, 그 내용을 바탕으로 친절하고 다정한 말투로 답변을 재구성해주세요.
3. 답변은 항상 한국어로, 짧고 명확하게 작성해주세요.
4. 문장 끝에는 상황에 맞는 사랑스러운 이모티콘(예: 😉, 💖, 😊)을 꼭 추가해주세요.
5. 만약 고객의 질문이 제공된 정보와 전혀 관련이 없다면, "음... 그건 제가 잘 모르는 내용이에요. 😅 고객센터로 문의해주시겠어요?" 라고 솔직하게 답변해주세요.
6. 절대로 제공된 정보 외의 내용을 추측해서 답변하지 마세요.`;

export const getFaqAnswer = async (question: string): Promise<string> => {
  if (!ai) {
    return "죄송해요. 현재 AI 상담 시스템을 연결할 수 없어요. (API Key 설정 확인 필요)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `[자주 묻는 질문(FAQ) 정보]\n${FAQ_KNOWLEDGE_BASE}\n\n[고객의 질문]\n${question}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "답변을 생성하지 못했어요.";
  } catch (error) {
    console.error("Error fetching FAQ answer from Gemini API:", error);
    return "죄송해요. 지금은 답변을 드릴 수 없어요. 잠시 후 다시 시도해주세요.";
  }
};
