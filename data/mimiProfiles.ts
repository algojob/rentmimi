import { MimiProfile } from '../types';

export const initialMimiProfiles: MimiProfile[] = [
  { id: 1, name: '유나', age: 24, description: '햇살 좋은 날, 카페에서 책 읽는 걸 좋아해요.', tagline: '같이 맛있는 거 먹어요', imgId: 101, available: true, recommended: true, region: '서울 강남', style: '청순' },
  { id: 2, name: '서아', age: 22, description: '음악과 함께하는 산책이 취미예요.', tagline: '영화 좋아하세요?', imgId: 102, available: true, recommended: true, region: '서울 홍대', style: '귀여움' },
  { id: 3, name: '지우', age: 26, description: '맛있는 음식을 나누는 즐거움을 알아요.', tagline: '산책하면서 얘기해요', imgId: 103, available: false, recommended: true, region: '경기 분당', style: '섹시' },
  { id: 4, name: '민서', age: 23, description: '새로운 곳으로 여행 떠나는 걸 좋아해요.', tagline: '활동적인 데이트!', imgId: 104, available: true, recommended: true, region: '서울 강남', style: '청순' },
  { id: 5, name: '하윤', age: 25, description: '고양이와 함께하는 집순이 라이프!', imgId: 105, available: false, recommended: false, region: '인천', style: '귀여움' },
  { id: 6, name: '채원', age: 27, description: '활동적인 운동으로 스트레스를 풀어요.', imgId: 106, available: true, recommended: false, region: '경기 수원', style: '섹시' },
  { id: 7, name: '다은', age: 21, description: '영화 보면서 하루를 마무리해요.', imgId: 107, available: true, recommended: false, region: '서울 홍대', style: '청순' },
  { id: 8, name: '예린', age: 24, description: '손으로 만드는 건 뭐든지 자신 있어요.', imgId: 108, available: true, recommended: false, region: '서울 잠실', style: '귀여움' },
];
