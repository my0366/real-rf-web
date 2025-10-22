import type { QuestionStats, LearningSession } from '../types/learning';
import type { QuestionWithTopic } from '../types/question';

const STATS_STORAGE_KEY = 'rf_learning_stats';
const SESSIONS_STORAGE_KEY = 'rf_learning_sessions';

// 간격 반복 학습 알고리즘 (SuperMemo 간소화 버전)
// 틀린 횟수에 따라 다음 복습 날짜 계산
const calculateNextReviewDate = (
  wrongCount: number,
  correctCount: number
): Date => {
  const now = new Date();
  const ratio = correctCount / (wrongCount + correctCount + 1);

  let daysToAdd: number;

  if (ratio >= 0.8) {
    // 잘 알고 있음 - 7일 후
    daysToAdd = 7;
  } else if (ratio >= 0.6) {
    // 보통 - 3일 후
    daysToAdd = 3;
  } else if (ratio >= 0.4) {
    // 어려움 - 1일 후
    daysToAdd = 1;
  } else {
    // 매우 어려움 - 즉시 복습
    daysToAdd = 0;
  }

  now.setDate(now.getDate() + daysToAdd);
  return now;
};

const calculateDifficulty = (
  wrongCount: number,
  correctCount: number
): 'easy' | 'medium' | 'hard' => {
  const ratio = correctCount / (wrongCount + correctCount + 1);

  if (ratio >= 0.7) return 'easy';
  if (ratio >= 0.4) return 'medium';
  return 'hard';
};

// 학습 통계 가져오기
export const getQuestionStats = (questionId: string): QuestionStats | null => {
  const stats = getAllStats();
  return stats[questionId] || null;
};

export const getAllStats = (): Record<string, QuestionStats> => {
  try {
    const data = localStorage.getItem(STATS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

// 문제를 틀렸을 때 호출
export const markQuestionAsWrong = (questionId: string): void => {
  const stats = getAllStats();
  const current = stats[questionId] || {
    questionId,
    wrongCount: 0,
    correctCount: 0,
    lastReviewDate: new Date().toISOString(),
    nextReviewDate: new Date().toISOString(),
    difficulty: 'medium' as const,
  };

  current.wrongCount += 1;
  current.lastReviewDate = new Date().toISOString();
  current.nextReviewDate = calculateNextReviewDate(
    current.wrongCount,
    current.correctCount
  ).toISOString();
  current.difficulty = calculateDifficulty(
    current.wrongCount,
    current.correctCount
  );

  stats[questionId] = current;
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
};

// 문제를 맞았을 때 호출
export const markQuestionAsCorrect = (questionId: string): void => {
  const stats = getAllStats();
  const current = stats[questionId] || {
    questionId,
    wrongCount: 0,
    correctCount: 0,
    lastReviewDate: new Date().toISOString(),
    nextReviewDate: new Date().toISOString(),
    difficulty: 'medium' as const,
  };

  current.correctCount += 1;
  current.lastReviewDate = new Date().toISOString();
  current.nextReviewDate = calculateNextReviewDate(
    current.wrongCount,
    current.correctCount
  ).toISOString();
  current.difficulty = calculateDifficulty(
    current.wrongCount,
    current.correctCount
  );

  stats[questionId] = current;
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
};

// 학습 세션 저장
export const saveLearningSession = (
  session: Omit<LearningSession, 'id'>
): void => {
  const sessions = getLearningSessionsFromStorage();
  const newSession: LearningSession = {
    ...session,
    id: Date.now().toString(),
  };

  sessions.unshift(newSession);

  // 최근 50개 세션만 유지
  const trimmed = sessions.slice(0, 50);
  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(trimmed));
};

const getLearningSessionsFromStorage = (): LearningSession[] => {
  try {
    const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 복습이 필요한 문제들 가져오기
export const getQuestionsNeedingReview = (
  questions: QuestionWithTopic[]
): QuestionWithTopic[] => {
  const stats = getAllStats();
  const now = new Date();

  return questions.filter(q => {
    const stat = stats[q.id];
    if (!stat) return false;

    const nextReview = new Date(stat.nextReviewDate);
    return nextReview <= now && stat.wrongCount > 0;
  });
};

// 난이도별로 문제 정렬 (어려운 것부터)
export const sortByDifficulty = (
  questions: QuestionWithTopic[]
): QuestionWithTopic[] => {
  const stats = getAllStats();
  const difficultyOrder = { hard: 0, medium: 1, easy: 2 };

  return [...questions].sort((a, b) => {
    const statA = stats[a.id];
    const statB = stats[b.id];

    if (!statA && !statB) return 0;
    if (!statA) return 1;
    if (!statB) return -1;

    const orderA = difficultyOrder[statA.difficulty];
    const orderB = difficultyOrder[statB.difficulty];

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // 같은 난이도면 틀린 횟수가 많은 것부터
    return statB.wrongCount - statA.wrongCount;
  });
};

// 통계 초기화
export const resetStats = (): void => {
  localStorage.removeItem(STATS_STORAGE_KEY);
  localStorage.removeItem(SESSIONS_STORAGE_KEY);
};

// 특정 문제의 통계 초기화
export const resetQuestionStats = (questionId: string): void => {
  const stats = getAllStats();
  delete stats[questionId];
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
};
