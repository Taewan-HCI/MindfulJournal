export interface Dialog {
  role: string;
  content: string;
  id: string;
}

export interface EventSummary {
  emotion: string;
  event: string;
}

export interface EventTimeLine extends EventSummary {
  date: string;
  sessionStart: number;
}

export interface WordFrequency {
  word: string;
  count: number;
  /** 해당 단어의 감정 상태, '긍정', '부정', '중립', '위험'중 하나 */
  sentiment: WordSentiment;
}
export type WordSentiment = '긍정' | '부정' | '중립' | '위험';

export interface DiaryInfo {
  /** 일기 ID */
  sessionNumber: string;
  /** 일기 생성 시각 */
  sessionStart: number;
  /** 일기 종료 시각  */
  sessionEnd: number;
  /** 소요시간 (second) */
  duration: number;
  /** 주치의명 */
  operator: string;
  /** 일기 요약 */
  diary: string;
  /** 일기 길이 */
  length: number;
  /** 사용자가 남긴 좋아요 수  */
  like?: number;
  /** PHQ-9 종합 점수  */
  phq9score?: number;
  /** PHQ-9 항목별 점수 어레이  */
  phq_item?: number[];
  /** 이벤트 요약 */
  eventSummary?: EventSummary[];
  /** 단어 출현 빈도 */
  wordFrequency?: WordFrequency[];
}

export interface Diary extends DiaryInfo {
  /** 상담사와 나눈 채팅 로그 */
  conversation: Dialog[];
}
