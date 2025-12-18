// QuestionCard.tsx
import React from 'react';
import { Card, Button } from '../components/ui';
import type { QuestionWithTopic } from '../types/question';

interface QuestionCardProps {
  question: QuestionWithTopic;
  isTestMode: boolean;
  onClick: () => void;
  currentQuestionNumber?: number;
  totalQuestions?: number;
  onMarkAsUnknown?: () => void; // 모르는 문제로 표시하는 함수 추가
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isTestMode,
  onClick,
  currentQuestionNumber,
  totalQuestions,
  onMarkAsUnknown, // 새로 추가된 prop
}) => {
  // 모르는 문제 버튼 클릭 시 이벤트 전파 방지
  const handleMarkAsUnknown = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    onMarkAsUnknown?.();
  };

  return (
    <Card
      className={`w-full max-w-3xl min-h-[200px] flex flex-col items-center justify-center border-2 transition-all p-6 ${
        isTestMode
          ? 'cursor-pointer hover:shadow-xl border-[#228BE6]/30 hover:border-[#228BE6]/50 border-dashed active:scale-98'
          : 'border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="text-center space-y-6 max-w-2xl relative w-full">
        {/* 질문 번호와 주제 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {currentQuestionNumber && totalQuestions && (
            <div className="px-3 py-1 bg-gray-100 rounded-full border border-gray-300">
              <span className="text-gray-700 font-medium text-sm">
                {currentQuestionNumber} / {totalQuestions}
              </span>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#228BE6]/10 rounded-full border border-[#228BE6]/20">
            <span className="text-[#228BE6] font-medium">
              {question.topic.name}
            </span>
          </div>
        </div>

        {/* 질문 */}
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-relaxed">
          {question.content}
        </div>

        {/* 영어 */}
        {/*{question.english && (*/}
        {/*    <div className="text-lg sm:text-xl md:text-2xl text-gray-600 italic leading-relaxed">*/}
        {/*        {question.english}*/}
        {/*    </div>*/}
        {/*)}*/}

        {/* 터치 안내 */}
        {isTestMode && (
          <div className="mt-8 p-4 bg-[#228BE6]/10 rounded-2xl border border-[#228BE6]/20">
            <div className="text-[#228BE6] flex items-center justify-center gap-2 font-medium">
              <span className="text-2xl">👆</span>
              <span>화면을 터치하면 다음 질문으로 넘어갑니다</span>
            </div>
          </div>
        )}
        {/* 모르는 문제 버튼 - 테스트 모드일 때만 표시 */}
        {isTestMode && onMarkAsUnknown && (
          <Button
            variant="destructive"
            size="lg"
            onClick={handleMarkAsUnknown}
            className="w-full"
          >
            <span className="text-xl">모르겠어요</span>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QuestionCard;
