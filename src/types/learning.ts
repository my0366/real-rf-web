// 학습 통계 관련 타입 정의
export interface QuestionStats {
  questionId: string;
  wrongCount: number; // 틀린 횟수
  correctCount: number; // 맞은 횟수
  lastReviewDate: string; // 마지막 복습 날짜
  nextReviewDate: string; // 다음 복습 권장 날짜
  difficulty: 'easy' | 'medium' | 'hard'; // 난이도 (자동 계산)
}

export interface LearningSession {
  id: string;
  date: string;
  topicIds: string[];
  totalQuestions: number;
  unknownQuestions: string[]; // 모르는 문제 ID 목록
  duration: number;
}
