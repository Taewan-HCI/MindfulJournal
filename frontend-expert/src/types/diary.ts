export interface Dialog {
  role: string;
  content: string;
  id: string;
}

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
}

export interface Diary extends DiaryInfo {
  /** 상담사와 나눈 채팅 로그 */
  conversation: Dialog[];
}
