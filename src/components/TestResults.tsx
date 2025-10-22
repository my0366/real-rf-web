import React from 'react';
import { Button, Card } from './ui';
import type { QuestionWithTopic } from '../types/question';

interface TestResultsProps {
  results: {
    totalQuestions: number;
    completedQuestions: number;
    totalTime: number;
    averageTime: number;
    selectedTopics?: string;
    unknownQuestions: QuestionWithTopic[]; // 모르는 문제 목록 추가
  };
  onRestart: () => void;
  onNewTest: () => void;
  onShowUnknownQuestions: () => void; // 모르는 문제 보기 함수 추가
  onReviewUnknown?: () => void; // 모르는 문제만 복습하기
}

const TestResults: React.FC<TestResultsProps> = ({
  results,
  onRestart,
  onNewTest,
  onShowUnknownQuestions,
  onReviewUnknown,
}) => {
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const formatAverageTime = (ms: number) => {
    if (ms === 0) return '00:00.00';
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}초`;
  };

  return (
    <Card className="w-full max-w-2xl" padding="lg">
      <div className="text-center space-y-6">
        {/* 결과 헤더 */}
        <div className="space-y-2">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800">테스트 완료!</h2>
          <p className="text-gray-600">
            {results.selectedTopics
              ? `${results.selectedTopics} 주제`
              : '모든 주제'}{' '}
            테스트를 마쳤습니다
          </p>
        </div>

        {/* 결과 통계 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {results.completedQuestions}
            </div>
            <div className="text-sm text-blue-700">완료한 질문</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {formatTime(results.totalTime)}
            </div>
            <div className="text-sm text-green-700">총 소요시간</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">
              {formatAverageTime(results.averageTime)}
            </div>
            <div className="text-sm text-purple-700">평균 시간</div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">
              {results.unknownQuestions.length}
            </div>
            <div className="text-sm text-red-700">모르는 문제</div>
          </div>
        </div>

        {/* 모르는 문제가 있을 때만 해결하지 못한 문제 버튼 표시 */}
        {results.unknownQuestions.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-red-800 font-medium mb-3">
              ❓ {results.unknownQuestions.length}개의 모르는 문제가 있습니다
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="secondary"
                onClick={onShowUnknownQuestions}
                icon="📋"
                size="md"
                className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300 flex-1"
              >
                문제 목록 보기
              </Button>
              {onReviewUnknown && (
                <Button
                  variant="primary"
                  onClick={onReviewUnknown}
                  icon="🔄"
                  size="md"
                  className="bg-red-600 hover:bg-red-700 text-white flex-1"
                >
                  복습 모드로 다시 풀기
                </Button>
              )}
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            onClick={onRestart}
            icon="🔄"
            size="lg"
            className="flex-1"
          >
            다시 시작
          </Button>

          <Button
            variant="secondary"
            onClick={onNewTest}
            icon="🆕"
            size="lg"
            className="flex-1"
          >
            새 테스트
          </Button>
        </div>

        {/* 추가 정보 */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>• 테스트 결과는 저장되지 않습니다</p>
          <p>• 더 나은 결과를 위해 꾸준히 연습해보세요!</p>
        </div>
      </div>
    </Card>
  );
};

export default TestResults;
