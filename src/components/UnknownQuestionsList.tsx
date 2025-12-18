import React from 'react';
import { Button, Card } from './ui';
import type { QuestionWithTopic } from '../types/question';
import { getQuestionStats } from '../utils/learningStats';

interface UnknownQuestionsListProps {
  unknownQuestions: QuestionWithTopic[];
  onClose: () => void;
}

const UnknownQuestionsList: React.FC<UnknownQuestionsListProps> = ({
  unknownQuestions,
  onClose,
}) => {
  const getDifficultyInfo = (difficulty?: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'hard':
        return {
          emoji: '🔴',
          label: '어려움',
          color: 'bg-red-100 text-red-800',
        };
      case 'medium':
        return {
          emoji: '🟡',
          label: '보통',
          color: 'bg-yellow-100 text-yellow-800',
        };
      case 'easy':
        return {
          emoji: '🟢',
          label: '쉬움',
          color: 'bg-green-100 text-green-800',
        };
      default:
        return {
          emoji: '⚪',
          label: '신규',
          color: 'bg-gray-100 text-gray-800',
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              ❓ 해결하지 못한 문제들
            </h2>
            <p className="text-gray-600">
              총 {unknownQuestions.length}개의 문제를 다시 학습해보세요
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={onClose}
            icon="✕"
            size="default"
            className="shrink-0"
          >
            닫기
          </Button>
        </div>
        <div className="flex flex-col h-full">
          {/* 문제 목록 */}
          <div className="flex-1 overflow-y-auto">
            {unknownQuestions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  모든 문제를 해결했습니다!
                </h3>
                <p className="text-gray-600">
                  훌륭합니다! 모르는 문제가 없네요.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {unknownQuestions.map((question, index) => {
                  const stats = getQuestionStats(question.id);
                  const difficultyInfo = getDifficultyInfo(stats?.difficulty);

                  return (
                    <Card
                      key={`${question.id}-${index}`}
                      className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                              {question.topic.name}
                            </span>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyInfo.color}`}
                            >
                              {difficultyInfo.label}
                            </span>
                            {stats && stats.wrongCount > 0 && (
                              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                {stats.wrongCount}회 틀림
                              </span>
                            )}
                          </div>

                          <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            {question.content}
                          </h4>

                          {question.english && (
                            <p className="text-gray-600 italic">
                              {question.english}
                            </p>
                          )}
                        </div>

                        <div className="text-red-500 text-xl">❓</div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* 푸터 */}
          {unknownQuestions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">💡 효과적인 학습 팁</p>
                <p className="text-xs text-gray-500">
                  • 🔴 어려운 문제: 즉시 복습하고 관련 자료 학습
                </p>
                <p className="text-xs text-gray-500">
                  • 🟡 보통 문제: 3일 후 다시 복습 권장
                </p>
                <p className="text-xs text-gray-500">
                  • 🟢 쉬운 문제: 7일 후 최종 확인
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UnknownQuestionsList;
