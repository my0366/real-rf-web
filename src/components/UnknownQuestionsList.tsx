import React from "react";
import { Button, Card } from "./ui";
import type { QuestionWithTopic } from "../types/question";

interface UnknownQuestionsListProps {
  unknownQuestions: QuestionWithTopic[];
  onClose: () => void;
}

const UnknownQuestionsList: React.FC<UnknownQuestionsListProps> = ({
  unknownQuestions,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-auto" padding="lg">
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
              size="md"
              className="shrink-0"
          >
            닫기
          </Button>
        </div>
        <div className="flex flex-col h-full">
          {/* 헤더 */}


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
                {unknownQuestions.map((question, index) => (
                  <Card
                    key={`${question.id}-${index}`}
                    className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow"
                    padding="md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                            #{index + 1}
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            📚 {question.topic.name}
                          </span>
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

                      <div className="text-red-500 text-xl">
                        ❓
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* 푸터 */}
          {unknownQuestions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  💡 이 문제들을 다시 학습하여 실력을 향상시켜보세요!
                </p>
                <p className="text-xs text-gray-500">
                  • 문제를 다시 읽고 핵심 개념을 파악해보세요
                </p>
                <p className="text-xs text-gray-500">
                  • 관련 자료를 찾아 추가 학습을 진행해보세요
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
