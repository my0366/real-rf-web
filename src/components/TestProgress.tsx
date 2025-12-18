// TestProgress.tsx
import React from 'react';
import { Button } from '../components/ui';

interface TestProgressProps {
  elapsedTime: number;
  questionCount: number;
  totalQuestions: number;
  remainingQuestions: number;
  isStopwatchMode: boolean;
  isReviewMode?: boolean; // 복습 모드 여부 추가
  onStop: () => void;
  formatTime: (ms: number) => string;
}

const TestProgress: React.FC<TestProgressProps> = ({
  elapsedTime,
  questionCount,
  totalQuestions,
  remainingQuestions,
  isStopwatchMode,
  isReviewMode = false, // 기본값 설정
  onStop,
  formatTime,
}) => {
  const progressPercentage =
    totalQuestions > 0 ? (questionCount / totalQuestions) * 100 : 0;

  return (
    <div className="p-4 bg-white/50">
      <div className="max-w-4xl mx-auto">
        {/* 복습 모드 배너 */}
        {isReviewMode && (
          <div className="mb-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg text-center font-semibold shadow-md">
            🔄 복습 모드 - 모르는 문제를 다시 풀고 있습니다
          </div>
        )}

        {/* 진행률 바 */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>진행률</span>
            <span>
              {questionCount}/{totalQuestions} ({Math.round(progressPercentage)}
              %)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                isReviewMode
                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                  : 'bg-gradient-to-r from-[#228BE6] to-[#1E7BC8]'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* 통계 그리드 - 스톱워치 모드에 따라 열 수 조정 */}
        <div
          className={`grid gap-4 ${isStopwatchMode ? 'grid-cols-3' : 'grid-cols-2'}`}
        >
          {/* 스톱워치 모드일 때만 시간 표시 */}
          {isStopwatchMode && (
            <div className="text-center">
              <div className="text-2xl font-bold text-[#228BE6]">
                {formatTime(elapsedTime)}
              </div>
              <div className="text-xs text-gray-600">경과시간</div>
            </div>
          )}

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {questionCount}
            </div>
            <div className="text-xs text-gray-600">완료질문</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {remainingQuestions}
            </div>
            <div className="text-xs text-gray-600">남은질문</div>
          </div>
        </div>

        <div className="flex-shrink-0 p-6">
          <div className="text-center">
            <Button
              variant="destructive"
              size="lg"
              onClick={onStop}
              className="px-12 py-4 text-lg font-semibold w-full"
            >
              테스트 종료
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestProgress;
