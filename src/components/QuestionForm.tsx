import React, { useState, useEffect } from "react";
import type { Question } from "../types/question";
import { Button, Select, Textarea, Input, Card } from './ui';
import {
  useTopics,
  useQuestions,
  useSearchQuestions,
  useCreateQuestion,
  useCreateQuestionsBulk,
  useUpdateQuestion,
  useDeleteQuestion
} from '../hooks/useQuestions';

// 검색어 하이라이트 컴포넌트
const HighlightedText: React.FC<{ text: string; searchTerm: string }> = ({ text, searchTerm }) => {
  if (!searchTerm.trim()) return <>{text}</>;

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const QuestionForm: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [content, setContent] = useState("");
  const [english, setEnglish] = useState("");
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editEnglish, setEditEnglish] = useState("");
  const [filterTopicId, setFilterTopicId] = useState("");

  // 검색 관련 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState("");

  // React Query 훅들
  const { data: topics = [], isLoading: topicsLoading } = useTopics();
  const { data: questions = [], isLoading: questionsLoading, error: questionsError } = useQuestions(filterTopicId);
  const { data: searchResults = [], isLoading: searchLoading } = useSearchQuestions(searchDebounce, filterTopicId);
  const createQuestion = useCreateQuestion();
  const createQuestionsBulk = useCreateQuestionsBulk();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  // 첫 번째 주제를 기본값으로 설정
  React.useEffect(() => {
    if (topics.length > 0 && !selectedTopicId) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics, selectedTopicId]);

  // 검색어 디바운싱 (500ms 지연)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
      setIsSearchMode(!!searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTopicId || !content.trim()) return;

    try {
      await createQuestion.mutateAsync({
        topic_id: selectedTopicId,
        content: content.trim(),
        english: english.trim() || null,
      });

      setContent("");
      setEnglish("");
    } catch (error) {
      console.error("질문 등록 중 오류:", error);
    }
  };

  const bulkAddQuestions = async () => {
    if (!selectedTopicId || !content.trim()) return;

    const questions = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const cleanLine = line.replace(/^\d+\.\s*/, "");
        let koreanContent = cleanLine;
        let englishTranslation = null;

        if (cleanLine.includes('|')) {
          const parts = cleanLine.split('|').map(part => part.trim());
          if (parts.length >= 2) {
            koreanContent = parts[0];
            englishTranslation = parts[1];
          }
        }

        return {
          topic_id: selectedTopicId,
          content: koreanContent,
          english: englishTranslation,
        };
      });

    if (questions.length === 0) return;

    try {
      await createQuestionsBulk.mutateAsync(questions);
      setContent("");
      setEnglish("");
      setShowBulkAdd(false);
    } catch (error) {
      console.error("일괄 질문 등록 중 오류:", error);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion || !editContent.trim()) return;

    try {
      await updateQuestion.mutateAsync({
        id: editingQuestion.id,
        content: editContent.trim(),
        english: editEnglish.trim() || null
      });

      setEditingQuestion(null);
      setEditContent("");
      setEditEnglish("");
    } catch (error) {
      console.error("질문 수정 중 오류:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("이 질문을 삭제하시겠습니까?")) return;

    try {
      await deleteQuestion.mutateAsync(questionId);
    } catch (error) {
      console.error("질문 삭제 중 오류:", error);
    }
  };

  const startEdit = (question: Question) => {
    setEditingQuestion(question);
    setEditContent(question.content);
    setEditEnglish(question.english || "");
  };

  const cancelEdit = () => {
    setEditingQuestion(null);
    setEditContent("");
    setEditEnglish("");
  };

  // 수정 모드에서 키보드 이벤트 처리
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUpdateQuestion();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  // 현재 표시할 질문 목록 결정
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
            <span className="font-medium">질문을 불러오는 중 오류가 발생했습니다.</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 헤더와 모드 토글 */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">질문 관리</h2>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={!showBulkAdd && !showQuestionList ? "primary" : "secondary"}
            icon="📝"
            size="sm"
            onClick={() => {
              setShowBulkAdd(false);
              setShowQuestionList(false);
            }}
          >
            개별 등록
          </Button>

          <Button
            variant={showBulkAdd ? "primary" : "secondary"}
            icon="📋"
            size="sm"
            onClick={() => {
              setShowBulkAdd(true);
              setShowQuestionList(false);
            }}
          >
            일괄 등록
          </Button>

          <Button
            variant={showQuestionList ? "primary" : "secondary"}
            icon="📋"
            size="sm"
            onClick={() => {
              setShowQuestionList(true);
              setShowBulkAdd(false);
            }}
          >
            질문 목록
          </Button>
        </div>
      </div>

      {/* 성공/에러 메시지 */}
      {createQuestion.isSuccess && (
        <Card variant="success" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-medium">질문이 성공적으로 등록되었습니다!</span>
          </div>
        </Card>
      )}

      {createQuestionsBulk.isSuccess && (
        <Card variant="success" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-medium">{createQuestionsBulk.data}개의 질문이 성공적으로 등록되었습니다!</span>
          </div>
        </Card>
      )}

      {updateQuestion.isSuccess && (
        <Card variant="success" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-medium">질문이 성공적으로 수정되었습니다!</span>
          </div>
        </Card>
      )}

      {deleteQuestion.isSuccess && (
        <Card variant="success" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-medium">질문이 성공적으로 삭제되었습니다!</span>
          </div>
        </Card>
      )}

      {/* 질문 목록 */}
      {showQuestionList && (
        <div className="space-y-4">
          {/* 필터와 검색 */}
          <Card variant="primary" padding="md">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="주제 선택"
                  // icon="🔍"
                  value={filterTopicId}
                  onChange={(e) => setFilterTopicId(e.target.value)}
                >
                  <option value="">모든 주제</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </Select>

                <Input
                  // label="질문 검색"
                  // icon="🔎"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="질문 내용이나 영어로 검색하세요"
                />
              </div>

              {/* 검색 상태 표시 */}
              {isSearchMode && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#228BE6]">🔍</span>
                  <span className="text-gray-700">
                    <strong>"{searchTerm}"</strong> 검색 결과: {displayQuestions.length}개
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setIsSearchMode(false);
                    }}
                    icon="✕"
                  >
                    검색 지우기
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* 질문 목록 */}
          <Card>
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 -m-4 md:-m-6 mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                📋 질문 목록 ({displayQuestions.length}개)
                {isLoading && <span className="text-sm text-gray-500">검색 중...</span>}
                {isSearchMode && !isLoading && (
                  <span className="text-sm text-[#228BE6]">검색 결과</span>
                )}
              </h3>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {displayQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {editingQuestion?.id === question.id ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 font-mono px-2 py-1 bg-gray-100 rounded">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm text-[#228BE6] font-medium">
                              📚 {question.topic.name}
                            </span>
                          </div>
                          <Textarea
                            label="질문 내용"
                            icon="💬"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={handleEditKeyDown}
                            rows={2}
                          />
                          <Input
                            label="영어 (선택사항)"
                            icon="🌍"
                            value={editEnglish}
                            onChange={(e) => setEditEnglish(e.target.value)}
                            onKeyDown={handleEditKeyDown}
                          />
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={handleUpdateQuestion}
                            loading={updateQuestion.isPending}
                            icon="💾"
                          >
                            저장
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={cancelEdit}
                            icon="✕"
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 font-mono px-2 py-1 bg-gray-100 rounded">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm text-[#228BE6] font-medium">
                              📚 {question.topic.name}
                            </span>
                          </div>
                          <div className="text-gray-800 font-medium">
                            {isSearchMode ? (
                              <HighlightedText text={question.content} searchTerm={searchTerm} />
                            ) : (
                              question.content
                            )}
                          </div>
                          {question.english && (
                            <div className="text-gray-600 italic text-sm">
                              {isSearchMode ? (
                                <HighlightedText text={question.english} searchTerm={searchTerm} />
                              ) : (
                                question.english
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => startEdit(question)}
                            // icon="✏️"
                          >
                            수정
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                            loading={deleteQuestion.isPending}
                            // icon="🗑"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {displayQuestions.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">
                    {isSearchMode ? "🔍" : "📝"}
                  </div>
                  <p className="text-gray-500 text-base mb-4">
                    {isSearchMode
                      ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
                      : "등록된 질문이 없습니다."
                    }
                  </p>
                  <p className="text-gray-400 text-sm">
                    {isSearchMode
                      ? "다른 키워드로 검색해보세요."
                      : "첫 번째 질문을 추가해보세요!"
                    }
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* 개별 질문 등록 */}
      {!showBulkAdd && !showQuestionList && (
        <Card variant="primary" padding="lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📝 개별 질문 등록
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="주제 선택"
              icon="📚"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              required
            >
              <option value="">주제를 선택하세요</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>

            <Textarea
              label="질문 내용"
              icon="💬"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="질문 내용을 입력하세요"
              rows={4}
              required
            />

            <Input
              label="영어 (선택사항)"
              icon="🌍"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="영어 번역을 입력하세요"
            />

            <Button
              type="submit"
              disabled={!selectedTopicId || !content.trim()}
              loading={createQuestion.isPending}
              icon="✨"
              className="w-full"
            >
              질문 등록
            </Button>
          </form>
        </Card>
      )}

      {/* 일괄 질문 등록 */}
      {showBulkAdd && !showQuestionList && (
        <Card variant="success" padding="lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📋 일괄 질문 등록
          </h3>
          <div className="space-y-4">
            <Select
              label="주제 선택"
              icon="📚"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
            >
              <option value="">주제를 선택하세요</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>

            <Textarea
              label="질문 내용 (한 줄에 하나씩)"
              icon="📝"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="질문 내용을 한 줄에 하나씩 입력하세요&#10;예시:&#10;1. 고마워 | Thank you&#10;2. 천만에요 | You're welcome&#10;3. 많은도움이됐어 | That was very helpful&#10;4. ~해줘서 고마워"
              rows={8}
              helpText="숫자로 시작하는 번호는 자동으로 제거됩니다. | 구분자로 영어 번역을 추가할 수 있습니다."
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <strong>💡 일괄 등록 팁:</strong> 각 줄에서 <code className="bg-blue-100 px-1 rounded">|</code> 문자로 한국어와 영어를 구분할 수 있습니다.
                <br />영어가 없는 질문은 한국어만 입력하면 됩니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="success"
                onClick={bulkAddQuestions}
                disabled={!selectedTopicId || !content.trim()}
                loading={createQuestionsBulk.isPending}
                icon="📋"
                className="flex-1"
              >
                일괄 등록
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowBulkAdd(false)}
              >
                취소
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 도움말 */}
      {!showQuestionList && (
        <Card variant="warning" padding="md">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            💡 도움말
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 주제를 먼저 생성한 후 질문을 등록해주세요</li>
            <li>• 일괄 등록시 한 줄에 하나의 질문을 입력하세요</li>
            <li>• 영어 번역은 선택사항입니다</li>
            <li>• 질문 목록에서 수정/삭제가 가능합니다</li>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default QuestionForm;
