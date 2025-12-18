// TestControl.tsx
import React from 'react';
import type { Topic } from '../types/topic';
import { Button, Card } from './ui';

interface TestControlProps {
  topics: Topic[];
  selectedTopicIds: string[];
  setSelectedTopicIds: (ids: string[]) => void;
  isMultiSelectMode: boolean;
  setIsMultiSelectMode: (mode: boolean) => void;
  isStopwatchMode: boolean;
  setIsStopwatchMode: (mode: boolean) => void;
  onStart: () => void;
  isLoading: boolean;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
}

const TestControl: React.FC<TestControlProps> = ({
  topics,
  selectedTopicIds,
  setSelectedTopicIds,
  isMultiSelectMode,
  setIsMultiSelectMode,
  isStopwatchMode,
  setIsStopwatchMode,
  onStart,
  isLoading,
  selectedCategory = '전체',
  setSelectedCategory,
}) => {
  // 카테고리별로 필터링된 주제 목록
  const filteredTopics =
    selectedCategory === '전체'
      ? topics
      : topics.filter(t => t.category === selectedCategory);

  // 고유한 카테고리 목록 추출
  const categories = [
    '전체',
    ...Array.from(new Set(topics.map(t => t.category))),
  ];

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

  // 명시적으로 모드를 설정할 때 사용할 헬퍼
  const setMultiMode = (mode: boolean) => {
    if (mode === isMultiSelectMode) return;
    setIsMultiSelectMode(mode);
    if (!mode && selectedTopicIds.length > 1) {
      setSelectedTopicIds([selectedTopicIds[0]]);
    }
  };

  // 모든 선택 해제
  const clearAllSelections = () => {
    setSelectedTopicIds([]);
  };

  // 현재 필터링된 주제들만 선택
  const selectAllTopics = () => {
    setSelectedTopicIds(filteredTopics.map(topic => topic.id));
  };

  const selectedTopics = topics.filter(topic =>
    selectedTopicIds.includes(topic.id)
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🎯 RF Check</h1>
        <p className="page-subtitle">
          선택한 주제의 질문들로 말하기 연습을 시작하세요
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* 카테고리 필터 */}
          <div>
            <label className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">📂</span>
              카테고리 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory?.(category)}
                  className={
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-800 hover:bg-blue-50'
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* 선택 모드 토글 - 더 직관적으로 개선 */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                <Button
                  variant={isMultiSelectMode ? 'ghost' : 'default'}
                  size="sm"
                  onClick={() => setMultiMode(false)}
                  className={
                    !isMultiSelectMode ? 'bg-white text-blue-600 shadow-sm' : ''
                  }
                >
                  🎯 단일 선택
                </Button>
                <Button
                  variant={isMultiSelectMode ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMultiMode(true)}
                  className={
                    isMultiSelectMode ? 'bg-white text-blue-600 shadow-sm' : ''
                  }
                >
                  🎪 다중 선택
                </Button>
              </div>
            </div>

            {/* 스톱워치 모드 토글 */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-800">스톱워치 표시</h4>
                <p className="text-sm text-gray-600">
                  테스트 중 시간을 표시합니다
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsStopwatchMode(!isStopwatchMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isStopwatchMode ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isStopwatchMode ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </Button>
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
                  <span className="font-medium">
                    {selectedTopicIds.length}개 주제 선택됨
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isMultiSelectMode &&
                    selectedTopicIds.length < filteredTopics.length && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={selectAllTopics}
                      >
                        전체 선택
                      </Button>
                    )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllSelections}
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
                {filteredTopics.map(topic => (
                  <label
                    key={topic.id}
                    className="relative cursor-pointer group transition-all duration-200"
                  >
                    <div
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedTopicIds.includes(topic.id)
                          ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
                      }`}
                    >
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
                          <div
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                              selectedTopicIds.includes(topic.id)
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300 bg-white group-hover:border-blue-400'
                            }`}
                          >
                            {selectedTopicIds.includes(topic.id) && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-base">
                              {topic.name}
                            </div>
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
              <label className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">🎪</span>
                원하는 주제들을 모두 선택하세요
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                {filteredTopics.map(topic => (
                  <label
                    key={topic.id}
                    className="relative cursor-pointer group transition-all duration-200"
                  >
                    <div
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedTopicIds.includes(topic.id)
                          ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm'
                      }`}
                    >
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
                            }`}
                          >
                            {selectedTopicIds.includes(topic.id) && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-medium text-base">
                              {topic.name}
                            </div>
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
            <div className="space-y-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-base font-medium text-gray-800 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                선택된 주제 ({selectedTopics.length}개)
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTopics.map(topic => (
                  <span
                    key={topic.id}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 ${
                      isMultiSelectMode
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}
                  >
                    <span>{topic.name}</span>
                    {isMultiSelectMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTopicSelect(topic.id)}
                        className="ml-1"
                        title="제거"
                      >
                        ✕
                      </Button>
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
              className="w-full text-lg py-4 font-semibold"
              variant="default"
            >
              {selectedTopicIds.length === 0 ? (
                <span className="flex items-center gap-2">
                  <span className="text-xl">👆</span>
                  위에서 주제를 선택해주세요
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🚀 테스트 시작하기
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
