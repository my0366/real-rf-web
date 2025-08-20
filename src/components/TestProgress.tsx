// TestProgress.tsx
import React from 'react';
import {Button} from '../components/ui';

interface TestProgressProps {
    elapsedTime: number;
    questionCount: number;
    totalQuestions: number;
    remainingQuestions: number;
    onStop: () => void;
    formatTime: (ms: number) => string;
}

const TestProgress: React.FC<TestProgressProps> = ({
                                                       elapsedTime,
                                                       questionCount,
                                                       totalQuestions,
                                                       remainingQuestions,
                                                       onStop,
                                                       formatTime,
                                                   }) => {
    const progressPercentage = totalQuestions > 0 ? (questionCount / totalQuestions) * 100 : 0;

    return (
        <div className="p-4 bg-white/50">
            <div className="max-w-4xl mx-auto">
                {/* 진행률 바 */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>진행률</span>
                        <span>{questionCount}/{totalQuestions} ({Math.round(progressPercentage)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-[#228BE6] to-[#1E7BC8] h-3 rounded-full transition-all duration-300"
                            style={{width: `${progressPercentage}%`}}
                        />
                    </div>
                </div>

                {/* 통계 그리드 */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[#228BE6]">
                            {formatTime(elapsedTime)}
                        </div>
                        <div className="text-xs text-gray-600">경과시간</div>
                    </div>

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
                <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-6">
                    <div className="text-center">
                        <Button
                            variant="danger"
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

