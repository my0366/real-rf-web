import React, { useState } from 'react';
import { Button, Input, Textarea, Card, Select } from './ui';
import { useUpdateQuestion, useTopics } from '../hooks/useQuestions';
import type { QuestionWithTopic } from '../types/question';

interface EditQuestionModalProps {
  question: QuestionWithTopic;
  isOpen: boolean;
  onClose: () => void;
}

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  question,
  isOpen,
  onClose,
}) => {
  const [content, setContent] = useState(question.content);
  const [english, setEnglish] = useState(question.english || '');
  const [topicId, setTopicId] = useState(question.topic_id);
  const [isSaving, setIsSaving] = useState(false);

  const { data: topics = [] } = useTopics();
  const updateQuestion = useUpdateQuestion();

  // 키보드 이벤트 처리 (Esc로 닫기, Ctrl+Enter로 저장)
  const handleSave = React.useCallback(async () => {
    if (!content.trim()) {
      alert('질문 내용을 입력하세요');
      return;
    }

    setIsSaving(true);
    try {
      await updateQuestion.mutateAsync({
        id: question.id,
        content: content.trim(),
        english: english.trim() || null,
      });
      alert('질문이 수정되었습니다');
      onClose();
    } catch (error) {
      console.error('질문 수정 중 오류:', error);
      alert('질문 수정에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  }, [content, english, question.id, updateQuestion, onClose]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleSave, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl card-standard">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">질문 수정</h2>
          <p className="text-sm text-gray-600">
            질문의 내용, 영어 번역, 주제를 수정할 수 있습니다
          </p>
          <p className="text-xs text-gray-400 mt-2">
            💡 Tip: Ctrl+Enter로 저장, Esc로 닫기
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {/* 주제 선택 */}
          <div className="form-group">
            <label className="form-label">주제</label>
            <Select value={topicId} onChange={e => setTopicId(e.target.value)}>
              <option value="">주제 선택</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>
          </div>

          {/* 질문 내용 */}
          <div className="form-group">
            <label className="form-label">질문 내용</label>
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="질문 내용을 입력하세요"
              rows={4}
              autoFocus
            />
          </div>

          {/* 영어 번역 */}
          <div className="form-group">
            <label className="form-label">영어 번역 (선택사항)</label>
            <Input
              value={english}
              onChange={e => setEnglish(e.target.value)}
              placeholder="영어 번역을 입력하세요"
            />
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="button-group justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            취소
          </Button>
          <Button variant="default" onClick={handleSave} loading={isSaving}>
            저장
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditQuestionModal;
