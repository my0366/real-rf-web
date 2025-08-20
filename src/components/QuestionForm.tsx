import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import type {  Question, QuestionWithTopic } from "../types/question";
import { Button, Select, Textarea, Input, Card } from './ui';
import type {Topic} from '../types/topic.ts';

const QuestionForm: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<QuestionWithTopic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [content, setContent] = useState("");
  const [english, setEnglish] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editEnglish, setEditEnglish] = useState("");
  const [filterTopicId, setFilterTopicId] = useState("");

  useEffect(() => {
    fetchTopics();
    if (showQuestionList) {
      fetchQuestions();
    }
  }, [showQuestionList, filterTopicId]);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .order("name");

      if (error) throw error;
      setTopics(data || []);
      if (data && data.length > 0) {
        setSelectedTopicId(data[0].id);
      }
    } catch (error) {
      console.error("주제를 불러오는 중 오류:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      let query = supabase.from("questions").select(`
        *,
        topic:topics(id, name)
      `).order("created_at", { ascending: false });

      if (filterTopicId) {
        query = query.eq("topic_id", filterTopicId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuestions(data as QuestionWithTopic[] || []);
    } catch (error) {
      console.error("질문을 불러오는 중 오류:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTopicId || !content.trim()) {
      setMessage("주제와 내용을 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("questions").insert([
        {
          topic_id: selectedTopicId,
          content: content.trim(),
          english: english.trim() || null,
        },
      ]);

      if (error) throw error;

      setContent("");
      setEnglish("");
      setMessage("질문이 성공적으로 등록되었습니다!");

      // 3초 후 메시지 제거
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("질문 등록 중 오류:", error);
      setMessage("질문 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const bulkAddQuestions = async () => {
    if (!selectedTopicId || !content.trim()) {
      setMessage("주제와 내용을 모두 입력해주세요.");
      return;
    }

    const questions = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        // 숫자. 로 시작하는 경우 제거
        const cleanLine = line.replace(/^\d+\.\s*/, "");

        // | 로 구분된 영어 번역 확인
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

    setLoading(true);
    try {
      const { error } = await supabase.from("questions").insert(questions);

      if (error) throw error;

      setContent("");
      setEnglish("");
      setShowBulkAdd(false);
      setMessage(`${questions.length}개의 질문이 성공적으로 등록되었습니다!`);

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("일괄 질문 등록 중 오류:", error);
      setMessage("질문 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async () => {
    if (!editingQuestion || !editContent.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("questions")
        .update({
          content: editContent.trim(),
          english: editEnglish.trim() || null
        })
        .eq("id", editingQuestion.id);

      if (error) throw error;

      setEditingQuestion(null);
      setEditContent("");
      setEditEnglish("");
      setMessage("질문이 성공적으로 수정되었습니다!");
      fetchQuestions();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("질문 수정 중 오류:", error);
      setMessage("질문 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm("이 질문을 삭제하시겠습니까?")) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", questionId);

      if (error) throw error;

      setMessage("질문이 성공적으로 삭제되었습니다!");
      fetchQuestions();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("질문 삭제 중 오류:", error);
      setMessage("질문 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
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

      {/* 메시지 표시 */}
      {message && (
        <Card
          variant={message.includes("성공") ? "success" : "danger"}
          padding="md"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {message.includes("성공") ? "✅" : "❌"}
            </span>
            <span className="font-medium">{message}</span>
          </div>
        </Card>
      )}

      {/* 질문 목록 */}
      {showQuestionList && (
        <div className="space-y-4">
          {/* 필터 */}
          <Card variant="primary" padding="md">
            <Select
              label="주제별 필터"
              icon="🔍"
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
          </Card>

          {/* 질문 목록 */}
          <Card>
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 -m-4 md:-m-6 mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                📋 질문 목록 ({questions.length}개)
              </h3>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {editingQuestion?.id === question.id ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>📚 {question.topic.name}</span>
                      </div>

                      <Textarea
                        label="질문 내용"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                      />

                      <Input
                        label="영어 (선택사항)"
                        value={editEnglish}
                        onChange={(e) => setEditEnglish(e.target.value)}
                        placeholder="영어 번역을 입력하세요"
                      />

                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          onClick={updateQuestion}
                          disabled={loading}
                          loading={loading}
                          icon="✅"
                          size="sm"
                        >
                          저장
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={cancelEdit}
                          size="sm"
                        >
                          취소
                        </Button>
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
                            {question.content}
                          </div>

                          {question.english && (
                            <div className="text-gray-600 italic text-sm">
                              {question.english}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => startEdit(question)}
                            icon="✏️"
                          >
                            수정
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteQuestion(question.id)}
                            icon="🗑️"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-gray-500 text-base mb-4">등록된 질문이 없습니다.</p>
                  <p className="text-gray-400 text-sm">첫 번째 질문을 추가해보세요!</p>
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
              disabled={loading || !selectedTopicId || !content.trim()}
              loading={loading}
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
                disabled={loading || !selectedTopicId || !content.trim()}
                loading={loading}
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
