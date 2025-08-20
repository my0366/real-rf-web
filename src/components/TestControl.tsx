// TestControl.tsx
import React from 'react';
import type {Topic} from '../types/topic';
import {Button, Card} from './ui';

interface TestControlProps {
    topics: Topic[];
    selectedTopicIds: string[];
    setSelectedTopicIds: (ids: string[]) => void;
    isMultiSelectMode: boolean;
    setIsMultiSelectMode: (mode: boolean) => void;
    onStart: () => void;
    isLoading: boolean;
}

const TestControl: React.FC<TestControlProps> = ({
                                                     topics,
                                                     selectedTopicIds,
                                                     setSelectedTopicIds,
                                                     isMultiSelectMode,
                                                     setIsMultiSelectMode,
                                                     onStart,
                                                     isLoading
                                                 }) => {
    // 주제 선택 핸들러
    const handleTopicSelect = (topicId: string) => {
        if (isMultiSelectMode) {
            setSelectedTopicIds(
                selectedTopicIds.includes(topicId)
                    ? selectedTopicIds.filter(id => id !== topicId)
                    : [...selectedTopicIds, topicId]
            );
        } else {
            setSelectedTopicIds([topicId]);
        }
    };

    // 다중 선택 모드 토글
    const toggleMultiSelectMode = () => {
        setIsMultiSelectMode(!isMultiSelectMode);
        if (!isMultiSelectMode && selectedTopicIds.length > 1) {
            // 다중 선택 모드로 전환 시 현재 선택 유지
        } else if (isMultiSelectMode && selectedTopicIds.length > 1) {
            // 단일 선택 모드로 전환 시 첫 번째 선택만 유지
            setSelectedTopicIds([selectedTopicIds[0]]);
        }
    };

    // 모든 선택 해제
    const clearAllSelections = () => {
        setSelectedTopicIds([]);
    };

    // 모든 주제 선택
    const selectAllTopics = () => {
        setSelectedTopicIds(topics.map(topic => topic.id));
    };

    const selectedTopics = topics.filter(topic => selectedTopicIds.includes(topic.id));

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    RF 테스트
                </h1>
                <p className="text-gray-600">
                    선택한 주제의 질문들로 말하기 연습을 시작하세요
                </p>
            </div>

            <Card variant="primary" padding="lg">
                <div className="space-y-6">
                    {/* 선택 모드 토글 - 더 직관적으로 개선 */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                                <button
                                    onClick={() => toggleMultiSelectMode()}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                        !isMultiSelectMode
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    <span className="text-lg">🎯</span>
                                    단일 선택
                                </button>
                                <button
                                    onClick={() => toggleMultiSelectMode()}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                        isMultiSelectMode
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    <span className="text-lg">🎪</span>
                                    다중 선택
                                </button>
                            </div>
                        </div>

                        {/* 모드별 설명 */}
                        <div className="text-center">
                            {isMultiSelectMode ? (
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                    <p className="text-purple-800 text-sm">
                                        <span className="font-medium">🎪 다중 선택 : </span>
                                        다양한 주제를 조합해서 종합적인 테스트를 진행할 수 있어요
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-blue-800 text-sm">
                                        <span className="font-medium">🎯 단일 선택:</span>
                                        특정 주제에 집중해서 연습할 수 있어요
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 선택 관리 버튼들 */}
                        {selectedTopicIds.length > 0 && (
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                    <span className="text-lg">📊</span>
                                    <span className="font-medium">{selectedTopicIds.length}개 주제 선택됨</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {isMultiSelectMode && selectedTopicIds.length < topics.length && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={selectAllTopics}
                                            icon="☑️"
                                        >
                                            전체 선택
                                        </Button>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearAllSelections}
                                        icon="🗑️"
                                    >
                                        선택 해제
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 단일 선택 모드 - 체크박스 스타일로 통일 */}
                    {!isMultiSelectMode && (
                        <div>
                            <label className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-xl">🎯</span>
                                주제를 선택하세요
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {topics.map((topic) => (
                                    <label
                                        key={topic.id}
                                        className="relative cursor-pointer group transition-all duration-200"
                                    >
                                        <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                            selectedTopicIds.includes(topic.id)
                                                ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
                                        }`}>
                                            {/* 체크박스와 제목 */}
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="relative flex-shrink-0">
                                                    <input
                                                        type="radio"
                                                        name="topic"
                                                        checked={selectedTopicIds.includes(topic.id)}
                                                        onChange={() => handleTopicSelect(topic.id)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                                                        selectedTopicIds.includes(topic.id)
                                                            ? 'border-blue-500 bg-blue-500'
                                                            : 'border-gray-300 bg-white group-hover:border-blue-400'
                                                    }`}>
                                                        {selectedTopicIds.includes(topic.id) && (
                                                            <svg className="w-4 h-4 text-white" fill="currentColor"
                                                                 viewBox="0 0 20 20">
                                                                <path fillRule="evenodd"
                                                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                      clipRule="evenodd"/>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl">📚</span>
                                                        <div className="font-medium text-base">{topic.name}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 다중 선택 모드 - 체크박스 스타일 개선 */}
                    {isMultiSelectMode && (
                        <div>
                            <label className="block text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-xl">🎪</span>
                                원하는 주제들을 모두 선택하세요
                            </label>
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                                {topics.map((topic) => (
                                    <label
                                        key={topic.id}
                                        className="relative cursor-pointer group transition-all duration-200"
                                    >
                                        <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                            selectedTopicIds.includes(topic.id)
                                                ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-md'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm'
                                        }`}>
                                            {/* 체크박스와 제목 */}
                                            <div className="flex items-start space-x-3 mb-2">
                                                <div className="relative flex-shrink-0 mt-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTopicIds.includes(topic.id)}
                                                        onChange={() => handleTopicSelect(topic.id)}
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                                                            selectedTopicIds.includes(topic.id)
                                                                ? 'border-purple-500 bg-purple-500'
                                                                : 'border-gray-300 bg-white group-hover:border-purple-400'
                                                        }`}>
                                                        {selectedTopicIds.includes(topic.id) && (
                                                            <svg className="w-4 h-4 text-white" fill="currentColor"
                                                                 viewBox="0 0 20 20">
                                                                <path fillRule="evenodd"
                                                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                      clipRule="evenodd"/>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xl">📚</span>
                                                        <div className="font-medium text-base">{topic.name}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 선택된 주제 표시 - 더 시각적으로 개선 */}
                    {selectedTopics.length > 0 && (
                        <div
                            className="space-y-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                            <h4 className="text-base font-medium text-gray-800 flex items-center gap-2">
                                <span className="text-xl">🎯</span>
                                선택된 주제 ({selectedTopics.length}개)
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedTopics.map((topic) => (
                                    <span
                                        key={topic.id}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 ${
                                            isMultiSelectMode
                                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                                        }`}
                                    >
                    <span className="text-base">📚</span>
                    <span>{topic.name}</span>
                                        {isMultiSelectMode && (
                                            <button
                                                onClick={() => handleTopicSelect(topic.id)}
                                                className="ml-1 hover:bg-purple-200 rounded-full p-1 transition-colors"
                                                title="제거"
                                            >
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </button>
                                        )}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 테스트 시작 버튼 - 더 눈에 띄게 개선 */}
                    <div className="pt-6 border-t border-gray-200">
                        <Button
                            onClick={onStart}
                            disabled={selectedTopicIds.length === 0}
                            loading={isLoading}
                            icon="🚀"
                            className="w-full text-lg py-4 font-semibold"
                            variant="success"
                        >
                            {selectedTopicIds.length === 0 ? (
                                <span className="flex items-center gap-2">
                  <span className="text-xl">👆</span>
                  위에서 주제를 선택해주세요
                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                  테스트 시작하기
                  <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                    {selectedTopics.length}개 주제
                  </span>
                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TestControl;

