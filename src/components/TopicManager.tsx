import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Button, Input, Textarea, Card } from './ui';
import type {Topic} from '../types/topic.ts';

const TopicManager: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopicName, setNewTopicName] = useState("");
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editName, setEditName] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .order("name");

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error("주제를 불러오는 중 오류:", error);
    }
  };

  const addTopic = async () => {
    if (!newTopicName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("topics")
        .insert([{ name: newTopicName.trim() }]);

      if (error) throw error;

      setNewTopicName("");
      fetchTopics();
    } catch (error) {
      console.error("주제 추가 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTopic = async () => {
    if (!editingTopic || !editName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("topics")
        .update({ name: editName.trim() })
        .eq("id", editingTopic.id);

      if (error) throw error;

      setEditingTopic(null);
      setEditName("");
      fetchTopics();
    } catch (error) {
      console.error("주제 수정 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTopic = async (topicId: string) => {
    if (
      !confirm(
        "이 주제를 삭제하시겠습니까? 관련된 모든 질문도 함께 삭제됩니다."
      )
    )
      return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("topics")
        .delete()
        .eq("id", topicId);

      if (error) throw error;

      fetchTopics();
    } catch (error) {
      console.error("주제 삭제 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const bulkAddTopics = async () => {
    if (!bulkText.trim()) return;

    const topicNames = bulkText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        // 숫자. 로 시작하는 경우 제거
        const cleanName = line.replace(/^\d+\.\s*/, "");
        return cleanName;
      });

    if (topicNames.length === 0) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("topics")
        .insert(topicNames.map((name) => ({ name })));

      if (error) throw error;

      setBulkText("");
      setShowBulkAdd(false);
      fetchTopics();
    } catch (error) {
      console.error("일괄 주제 추가 중 오류:", error);
    } finally {
      setLoading(false);
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
              disabled={loading || !newTopicName.trim()}
              loading={loading}
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
                disabled={loading || !bulkText.trim()}
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
                    onKeyPress={(e) => e.key === "Enter" && updateTopic()}
                    autoFocus
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="primary"
                      onClick={updateTopic}
                      disabled={loading}
                      loading={loading}
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
                      onClick={() => deleteTopic(topic.id)}
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
