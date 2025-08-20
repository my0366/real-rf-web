import React from "react";
import { Button, Card } from "./ui";

interface TestResultsProps {
  results: {
    totalQuestions: number;
    completedQuestions: number;
    totalTime: number;
    averageTime: number;
    selectedTopic?: string;
  };
  onRestart: () => void;
  onNewTest: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({
  results,
  onRestart,
  onNewTest,
}) => {
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const formatAverageTime = (ms: number) => {
    if (ms === 0) return "00:00.00";
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}초`;
  };

  return (
    <Card className="w-full max-w-2xl" padding="lg">
      <div className="text-center space-y-6">
        {/* 결과 헤더 */}
        <div className="space-y-2">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800">테스트 완료!</h2>
          <p className="text-gray-600">
            {results.selectedTopic
              ? `${results.selectedTopic} 주제`
              : "모든 주제"}{" "}
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

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">
              {results.totalQuestions}
            </div>
            <div className="text-sm text-orange-700">전체 질문</div>
          </div>
        </div>

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
