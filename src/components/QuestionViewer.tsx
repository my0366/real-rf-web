import React, { useEffect, useState } from 'react';
import { Button, Select, Input, Card } from './ui';
import {
  useTopics,
  useQuestions,
  useSearchQuestions,
} from '../hooks/useQuestions';
// 검색어 하이라이트 컴포넌트
const HighlightedText: React.FC<{ text: string; searchTerm: string }> = ({
  text,
  searchTerm,
}) => {
  if (!searchTerm.trim()) return <>{text}</>;
  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi'
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-yellow-200 text-yellow-900 px-1 rounded"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};
const QuestionViewer: React.FC = () => {
  const [filterTopicId, setFilterTopicId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  // React Query 훅들
  const { data: topics = [], isLoading: topicsLoading } = useTopics();
  const {
    data: questions = [],
    isLoading: questionsLoading,
    error: questionsError,
  } = useQuestions(filterTopicId);
  const { data: searchResults = [], isLoading: searchLoading } =
    useSearchQuestions(searchDebounce, filterTopicId);
  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  // 검색 모드 판단
  const isSearchMode = searchTerm.trim().length > 0;
  // 표시할 질문 목록 결정
  const displayQuestions = isSearchMode ? searchResults : questions;
  const isLoading = isSearchMode ? searchLoading : questionsLoading;
  // 로딩 상태
  if (topicsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-gray-600">주제를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  // 에러 상태
  if (questionsError) {
    return (
      <div className="p-4">
        <Card variant="danger" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">❌</span>
            <span className="font-medium">
              질문을 불러오는 중 오류가 발생했습니다.
            </span>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-4 md:space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">질문</h2>
        <p className="text-sm text-gray-600">
          등록된 질문들을 카드 형식으로 확인하세요
        </p>
      </div>
      {/* 필터와 검색 */}
      <Card variant="primary" padding="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="주제 선택"
              value={filterTopicId}
              onChange={e => setFilterTopicId(e.target.value)}
            >
              <option value="">모든 주제</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>
            <Input
              label="검색"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="질문 내용 또는 영어 번역 검색..."
            />
          </div>
          {/* 검색 상태 표시 */}
          {isSearchMode && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#228BE6]">🔍</span>
              <span className="text-gray-700">
                <strong>"{searchTerm}"</strong> 검색 결과:{' '}
                {displayQuestions.length}개
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                }}
                icon="✕"
              >
                검색 취소
              </Button>
            </div>
          )}
        </div>
      </Card>
      {/* 질문 목록 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">🎴</span>
          질문 목록 ({displayQuestions.length}개)
          {isSearchMode && !isLoading && (
            <span className="text-sm text-[#228BE6]">검색 결과</span>
          )}
        </h3>
        {isLoading ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-2xl mb-2">⏳</div>
              <p className="text-gray-600">질문을 불러오는 중...</p>
            </div>
          </Card>
        ) : displayQuestions.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{isSearchMode ? '🔍' : '🎴'}</div>
              <p className="text-gray-500 text-base mb-2">
                {isSearchMode
                  ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
                  : '등록된 질문이 없습니다.'}
              </p>
              <p className="text-gray-400 text-sm">
                {isSearchMode
                  ? '다른 키워드로 검색해보세요.'
                  : '질문 관리 페이지에서 질문을 추가해보세요!'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayQuestions.map((question, index) => (
              <Card
                key={question.id}
                padding="lg"
                className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-[#228BE6]"
              >
                <div className="space-y-3">
                  {/* 카드 헤더 */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {question.topic.name}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      #{String(index + 1).padStart(3, '0')}
                    </span>
                  </div>
                  {/* 질문 내용 */}
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-gray-900 leading-relaxed min-h-[3rem] flex items-center">
                      {isSearchMode ? (
                        <HighlightedText
                          text={question.content}
                          searchTerm={searchTerm}
                        />
                      ) : (
                        question.content
                      )}
                    </div>
                    {/* 영어 번역 */}
                    {question.english && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 text-sm flex-shrink-0 mt-0.5">
                            🌍
                          </span>
                          <div className="text-sm text-gray-600 italic leading-relaxed">
                            {isSearchMode ? (
                              <HighlightedText
                                text={question.english}
                                searchTerm={searchTerm}
                              />
                            ) : (
                              question.english
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* 카드 푸터 - 날짜 정보 */}
                  {question.created_at && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        등록일:{' '}
                        {new Date(question.created_at).toLocaleDateString(
                          'ko-KR'
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* 통계 정보 */}
      {displayQuestions.length > 0 && (
        <Card variant="primary" padding="md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#228BE6]">
                  {displayQuestions.length}
                </div>
                <div className="text-xs text-gray-600">전체 질문</div>
              </div>
              {filterTopicId && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#228BE6]">
                    {topics.find(t => t.id === filterTopicId)?.name}
                  </div>
                  <div className="text-xs text-gray-600">선택된 주제</div>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterTopicId('');
                setSearchTerm('');
              }}
              icon="🔄"
            >
              필터 초기화
            </Button>
          </div>
        </Card>
      )}
      {/* 도움말 */}
      <Card variant="warning" padding="md">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
          💡 도움말
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 주제별로 질문을 필터링할 수 있습니다</li>
          <li>• 검색 기능으로 원하는 질문을 빠르게 찾을 수 있습니다</li>
          <li>• 카드를 통해 질문과 영어 번역을 확인할 수 있습니다</li>
          <li>• 질문 추가/편집은 "질문 관리" 페이지에서 가능합니다</li>
        </ul>
      </Card>
    </div>
  );
};
export default QuestionViewer;
