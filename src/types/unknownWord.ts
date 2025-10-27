import type { QuestionWithTopic } from './question';

export interface UnknownWord {
  id: string;
  user_id: string;
  question_id: string;
  marked_at: string;
  review_count: number;
  last_reviewed_at?: string;
  is_learned: boolean;
  learned_at?: string;
}

export interface UnknownWordWithQuestion extends UnknownWord {
  question: QuestionWithTopic;
}
