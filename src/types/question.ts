import type {Topic} from './topic.ts';

export interface Question {
    id: string;
    topic_id: string;
    content: string;
    english?: string;
    created_at: string;
}

export interface QuestionWithTopic extends Question {
    topic: Topic;
}

