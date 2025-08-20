import React, { useState } from "react";
import { Button, Input, Textarea, Card } from './ui';
import {
  useTopics,
  useCreateTopic,
  useCreateTopicsBulk,
  useUpdateTopic,
  useDeleteTopic
} from '../hooks/useQuestions';
import type {Topic} from '../types/topic.ts';

const TopicManager: React.FC = () => {
  const [newTopicName, setNewTopicName] = useState("");
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editName, setEditName] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  // React Query 훅들
  const { data: topics = [], isLoading, error } = useTopics();
  const createTopic = useCreateTopic();
  const createTopicsBulk = useCreateTopicsBulk();
  const updateTopic = useUpdateTopic();
  const deleteTopic = useDeleteTopic();

  const addTopic = async () => {
    if (!newTopicName.trim()) return;

    try {
      await createTopic.mutateAsync(newTopicName.trim());
      setNewTopicName("");
    } catch (error) {
      console.error("주제 추가 중 오류:", error);
    }
  };

  const handleUpdateTopic = async () => {
    if (!editingTopic || !editName.trim()) return;

    try {
      await updateTopic.mutateAsync({
        id: editingTopic.id,
        name: editName.trim()
      });

      setEditingTopic(null);
      setEditName("");
    } catch (error) {
      console.error("주제 수정 중 오류:", error);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm("이 주제를 삭제하시겠습니까? 관련된 모든 질문도 함께 삭제됩니다.")) return;

    try {
      await deleteTopic.mutateAsync(topicId);
    } catch (error) {
      console.error("주제 삭제 중 오류:", error);
    }
  };

  const bulkAddTopics = async () => {
    if (!bulkText.trim()) return;

    const topicNames = bulkText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const cleanName = line.replace(/^\d+\.\s*/, "");
        return cleanName;
      });

    if (topicNames.length === 0) return;

    try {
      await createTopicsBulk.mutateAsync(topicNames);
      setBulkText("");
      setShowBulkAdd(false);
    } catch (error) {
      console.error("일괄 주제 추가 중 오류:", error);
    }
  };

  const startEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setEditName(topic.name);
  };

  const cancelEdit = () => {
    setEditingTopic(null);
    setEditName("");
  };

  // 로딩 상태
  if (isLoading) {
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
  if (error) {
    return (
      <div className="p-4">
        <Card variant="danger" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">❌</span>
            <span className="font-medium">주제를 불러오는 중 오류가 발생했습니다.</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 헤더와 일괄 추가 토글 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">주제 관리</h2>
        <Button
          variant={showBulkAdd ? "secondary" : "primary"}
          icon={showBulkAdd ? "📝" : "📋"}
          onClick={() => setShowBulkAdd(!showBulkAdd)}
        >
          {showBulkAdd ? "개별 추가" : "일괄 추가"}
        </Button>
      </div>

      {/* 성공 메시지들 */}
      {createTopic.isSuccess && (
        <Card variant="success" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-medium">주제가 성공적으로 추가되었습니다!</span>
          </div>
        </Card>
      )}

      {createTopicsBulk.isSuccess && (
        <Card variant="success" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-medium">{createTopicsBulk.data}개의 주제가 성공적으로 추가되었습니다!</span>
          </div>
        </Card>
      )}

      {updateTopic.isSuccess && (
        <Card variant="success" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-medium">주제가 성공적으로 수정되었습니다!</span>
          </div>
        </Card>
      )}

      {deleteTopic.isSuccess && (
        <Card variant="success" padding="md">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="font-medium">주제가 성공적으로 삭제되었습니다!</span>
          </div>
        </Card>
      )}

      {/* 새 주제 추가 */}
      {!showBulkAdd && (
        <Card variant="primary" padding="lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ➕ 새 주제 추가
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="주제 이름을 입력하세요"
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && addTopic()}
            />
            <Button
              onClick={addTopic}
              disabled={!newTopicName.trim()}
              loading={createTopic.isPending}
              icon="➕"
            >
              추가
            </Button>
          </div>
        </Card>
      )}

      {/* 일괄 주제 추가 */}
      {showBulkAdd && (
        <Card variant="success" padding="lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📋 일괄 주제 추가
          </h3>
          <div className="space-y-4">
            <Textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="주제 이름을 한 줄에 하나씩 입력하세요&#10;예시:&#10;1. 고마워&#10;2. 천만에요&#10;3. 많은도움이됐어"
              rows={6}
              helpText="숫자로 시작하는 번호는 자동으로 제거됩니다"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="success"
                onClick={bulkAddTopics}
                disabled={!bulkText.trim()}
                loading={createTopicsBulk.isPending}
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

      {/* 주제 목록 */}
      <Card>
        <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200 -m-4 md:-m-6 mb-4 md:mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            📚 주제 목록 ({topics.length}개)
          </h3>
        </div>

        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
            >
              {editingTopic?.id === topic.id ? (
                <div className="space-y-3">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleUpdateTopic()}
                    autoFocus
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="primary"
                      onClick={handleUpdateTopic}
                      loading={updateTopic.isPending}
                      icon="✅"
                      size="sm"
                      className="flex-1"
                    >
                      저장
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={cancelEdit}
                      size="sm"
                      className="flex-1"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 font-mono w-8 px-2 py-1 bg-gray-100 rounded">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-gray-800 font-medium text-base">{topic.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => startEdit(topic)}
                      icon="✏️"
                    >
                      수정
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteTopic(topic.id)}
                      loading={deleteTopic.isPending}
                      icon="🗑️"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {topics.length === 0 && (
            <div className="p-8 md:p-12 text-center">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-500 text-base mb-4">등록된 주제가 없습니다.</p>
              <p className="text-gray-400 text-sm">첫 번째 주제를 추가해보세요!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TopicManager;
