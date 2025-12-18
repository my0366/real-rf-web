import React, { useState } from 'react';
import { Button, Input, Textarea, Card, Select } from './ui';
import {
  useTopics,
  useCreateTopic,
  useCreateTopicsBulk,
  useUpdateTopic,
  useUpdateTopicsCategory,
  useDeleteTopic,
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../hooks/useQuestions';
import type { Topic } from '../types/topic.ts';
import type { Category } from '../types/category.ts';

const TopicManager: React.FC = () => {
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('');
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  // 카테고리 관련 상태
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // 주제 일괄 카테고리 변경 상태
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [bulkChangeCategory, setBulkChangeCategory] = useState('');
  const [showBulkCategoryChange, setShowBulkCategoryChange] = useState(false);

  // React Query 훅들
  const { data: topics = [], isLoading, error } = useTopics();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const createTopic = useCreateTopic();
  const createTopicsBulk = useCreateTopicsBulk();
  const updateTopic = useUpdateTopic();
  const updateTopicsCategory = useUpdateTopicsCategory();
  const deleteTopic = useDeleteTopic();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const addTopic = async () => {
    if (!newTopicName.trim() || !newTopicCategory) return;

    try {
      await createTopic.mutateAsync({
        name: newTopicName.trim(),
        category: newTopicCategory,
      });
      setNewTopicName('');
    } catch (error) {
      console.error('주제 추가 중 오류:', error);
    }
  };

  const handleUpdateTopic = async () => {
    if (!editingTopic || !editName.trim() || !editCategory) return;

    try {
      await updateTopic.mutateAsync({
        id: editingTopic.id,
        name: editName.trim(),
        category: editCategory,
      });

      setEditingTopic(null);
      setEditName('');
      setEditCategory('');
    } catch (error) {
      console.error('주제 수정 중 오류:', error);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (
      !confirm(
        '이 주제를 삭제하시겠습니까? 관련된 모든 질문도 함께 삭제됩니다.'
      )
    )
      return;

    try {
      await deleteTopic.mutateAsync(topicId);
    } catch (error) {
      console.error('주제 삭제 중 오류:', error);
    }
  };

  const bulkAddTopics = async () => {
    if (!bulkText.trim() || !bulkCategory) return;

    const topicNames = bulkText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^\d+\.\s*/, ''));

    if (topicNames.length === 0) return;

    try {
      await createTopicsBulk.mutateAsync({
        topicNames,
        category: bulkCategory,
      });
      setBulkText('');
      setShowBulkAdd(false);
    } catch (error) {
      console.error('일괄 주제 추가 중 오류:', error);
    }
  };

  const startEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setEditName(topic.name);
    setEditCategory(topic.category || '');
  };

  const cancelEdit = () => {
    setEditingTopic(null);
    setEditName('');
    setEditCategory('');
  };

  // 카테고리 관련 함수들
  const addCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await createCategory.mutateAsync({ name: newCategoryName.trim() });
      setNewCategoryName('');
    } catch (error) {
      console.error('카테고리 추가 중 오류:', error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) return;

    try {
      await updateCategory.mutateAsync({
        id: editingCategory.id,
        name: editCategoryName.trim(),
      });
      setEditingCategory(null);
      setEditCategoryName('');
    } catch (error) {
      console.error('카테고리 수정 중 오류:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('이 카테고리를 삭제하시겠습니까?')) return;

    try {
      await deleteCategory.mutateAsync(categoryId);
    } catch (error) {
      console.error('카테고리 삭제 중 오류:', error);
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setEditCategoryName('');
  };

  // 주제 일괄 카테고리 변경
  const toggleTopicSelection = (topicId: string) => {
    setSelectedTopicIds(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const selectAllTopics = () => {
    if (selectedTopicIds.length === topics.length) {
      setSelectedTopicIds([]);
    } else {
      setSelectedTopicIds(topics.map(t => t.id));
    }
  };

  const handleBulkCategoryChange = async () => {
    if (selectedTopicIds.length === 0 || !bulkChangeCategory) return;

    try {
      await updateTopicsCategory.mutateAsync({
        topicIds: selectedTopicIds,
        category: bulkChangeCategory,
      });
      setSelectedTopicIds([]);
      setBulkChangeCategory('');
      setShowBulkCategoryChange(false);
    } catch (error) {
      console.error('일괄 카테고리 변경 중 오류:', error);
    }
  };

  // 로딩 상태
  if (isLoading || categoriesLoading) {
    return (
      <div className="state-loading">
        <p className="state-loading-text">데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="p-4">
        <Card variant="destructive" className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              데이터를 불러오는 중 오류가 발생했습니다.
            </span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더와 버튼들 */}
      <div className="page-header">
        <h1 className="page-title">주제 관리</h1>
        <p className="page-subtitle">학습 주제를 추가하고 관리하세요</p>
      </div>
      <div className="button-group">
        <Button
          variant={showCategoryManager ? 'secondary' : 'default'}
          onClick={() => {
            setShowCategoryManager(!showCategoryManager);
            setShowBulkAdd(false);
            setShowBulkCategoryChange(false);
          }}
        >
          {showCategoryManager ? '주제 관리' : '카테고리 관리'}
        </Button>
        {!showCategoryManager && (
          <>
            <Button
              variant={showBulkAdd ? 'secondary' : 'default'}
              onClick={() => {
                setShowBulkAdd(!showBulkAdd);
                setShowBulkCategoryChange(false);
              }}
            >
              {showBulkAdd ? '개별 추가' : '일괄 추가'}
            </Button>
            <Button
              variant={showBulkCategoryChange ? 'secondary' : 'default'}
              onClick={() => {
                setShowBulkCategoryChange(!showBulkCategoryChange);
                setShowBulkAdd(false);
                if (!showBulkCategoryChange) {
                  setSelectedTopicIds([]);
                }
              }}
            >
              {showBulkCategoryChange ? '취소' : '일괄 카테고리 변경'}
            </Button>
          </>
        )}
      </div>

      {/* 성공 메시지들 */}
      {createTopic.isSuccess && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              주제가 성공적으로 추가되었습니다!
            </span>
          </div>
        </Card>
      )}

      {createTopicsBulk.isSuccess && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {createTopicsBulk.data}개의 주제가 성공적으로 추가되었습니다!
            </span>
          </div>
        </Card>
      )}

      {updateTopic.isSuccess && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              주제가 성공적으로 수정되었습니다!
            </span>
          </div>
        </Card>
      )}

      {updateTopicsCategory.isSuccess && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {updateTopicsCategory.data}개의 주제 카테고리가 성공적으로
              변경되었습니다!
            </span>
          </div>
        </Card>
      )}

      {deleteTopic.isSuccess && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              주제가 성공적으로 삭제되었습니다!
            </span>
          </div>
        </Card>
      )}

      {createCategory.isSuccess && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              카테고리가 성공적으로 추가되었습니다!
            </span>
          </div>
        </Card>
      )}

      {updateCategory.isSuccess && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              카테고리가 성공적으로 수정되었습니다!
            </span>
          </div>
        </Card>
      )}

      {deleteCategory.isSuccess && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              카테고리가 성공적으로 삭제되었습니다!
            </span>
          </div>
        </Card>
      )}

      {/* 카테고리 관리 섹션 */}
      {showCategoryManager && (
        <>
          {/* 새 카테고리 추가 */}
          <Card className="card-standard">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              카테고리 추가
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="카테고리 이름을 입력하세요"
                className="flex-1"
                onKeyDown={e => e.key === 'Enter' && addCategory()}
              />
              <Button
                onClick={addCategory}
                disabled={!newCategoryName.trim()}
                loading={createCategory.isPending}
                size="sm"
              >
                추가
              </Button>
            </div>
          </Card>

          {/* 카테고리 목록 */}
          <Card>
            <div className="card-header">
              <h3 className="card-header-title">
                카테고리 목록 ({categories.length}개)
              </h3>
            </div>

            {categories.length === 0 ? (
              <div className="state-empty">
                <p className="state-empty-title">등록된 카테고리가 없습니다</p>
                <p className="state-empty-subtitle">
                  첫 번째 카테고리를 추가하여 시작하세요!
                </p>
              </div>
            ) : (
              <div className="card-list max-h-96 overflow-y-auto">
                {categories.map((category, index) => (
                  <div key={category.id} className="card-list-item">
                    {editingCategory?.id === category.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editCategoryName}
                          onChange={e => setEditCategoryName(e.target.value)}
                          onKeyDown={e =>
                            e.key === 'Enter' && handleUpdateCategory()
                          }
                          autoFocus
                          placeholder="카테고리 이름을 입력하세요"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="default"
                            onClick={handleUpdateCategory}
                            loading={updateCategory.isPending}
                            size="sm"
                            className="flex-1"
                          >
                            저장
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={cancelEditCategory}
                            size="sm"
                            className="flex-1"
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-sm text-gray-500 font-mono px-2 py-1 bg-gray-100 rounded flex-shrink-0">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-gray-800 font-medium text-base truncate">
                            {category.name}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => startEditCategory(category)}
                          >
                            수정
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            loading={deleteCategory.isPending}
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {/* 주제 관리 섹션 */}
      {!showCategoryManager && (
        <>
          {/* 일괄 카테고리 변경 안내 */}
          {showBulkCategoryChange && selectedTopicIds.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                선택된 주제 ({selectedTopicIds.length}개) 카테고리 변경
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  value={bulkChangeCategory}
                  onChange={e => setBulkChangeCategory(e.target.value)}
                  className="flex-1"
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
                <Button
                  variant="default"
                  onClick={handleBulkCategoryChange}
                  disabled={
                    !bulkChangeCategory || selectedTopicIds.length === 0
                  }
                  loading={updateTopicsCategory.isPending}
                  size="sm"
                >
                  변경
                </Button>
              </div>
            </Card>
          )}

          {/* 새 주제 추가 */}
          {!showBulkAdd && !showBulkCategoryChange && (
            <Card className="card-standard">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                주제 추가
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={newTopicName}
                  onChange={e => setNewTopicName(e.target.value)}
                  placeholder="주제 이름을 입력하세요"
                  className="flex"
                  onKeyDown={e => e.key === 'Enter' && addTopic()}
                />
                <Select
                  value={newTopicCategory}
                  onChange={e => setNewTopicCategory(e.target.value)}
                  className="min-w-[120px] max-w-[200px]"
                >
                  <option value="">카테고리 선택</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
                <Button
                  onClick={addTopic}
                  disabled={!newTopicName.trim() || !newTopicCategory}
                  loading={createTopic.isPending}
                >
                  추가
                </Button>
              </div>
            </Card>
          )}

          {/* 일괄 주제 추가 */}
          {showBulkAdd && (
            <Card className="card-standard">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                일괄 주제 추가
              </h3>
              <div className="space-y-4">
                <Textarea
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  placeholder="주제 이름을 한 줄에 하나씩 입력하세요&#10;예시:&#10;1. 고마워&#10;2. 천만에요&#10;3. 많은도움이됐어"
                  rows={6}
                  helpText="숫자로 시작하는 번호는 자동으로 제거됩니다"
                />
                <Select
                  value={bulkCategory}
                  onChange={e => setBulkCategory(e.target.value)}
                  className="min-w-[120px]"
                >
                  <option value="">카테고리 선택</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="default"
                    onClick={bulkAddTopics}
                    disabled={!bulkText.trim() || !bulkCategory}
                    loading={createTopicsBulk.isPending}
                    size="sm"
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
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="card-header-title">
                  주제 목록 ({topics.length}개)
                </h3>
                {showBulkCategoryChange && topics.length > 0 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={selectAllTopics}
                  >
                    {selectedTopicIds.length === topics.length
                      ? '전체 해제'
                      : '전체 선택'}
                  </Button>
                )}
              </div>
            </div>

            {topics.length === 0 ? (
              <div className="state-empty">
                <p className="state-empty-title">등록된 주제가 없습니다</p>
                <p className="state-empty-subtitle">
                  첫 번째 주제를 추가하여 시작하세요!
                </p>
              </div>
            ) : (
              <div className="card-list max-h-96 overflow-y-auto">
                {topics.map((topic, index) => (
                  <div key={topic.id} className="card-list-item">
                    {editingTopic?.id === topic.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e =>
                            e.key === 'Enter' && handleUpdateTopic()
                          }
                          autoFocus
                          placeholder="주제 이름을 입력하세요"
                        />
                        <Select
                          value={editCategory}
                          onChange={e => setEditCategory(e.target.value)}
                          className="min-w-[120px]"
                        >
                          <option value="">카테고리 선택</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </Select>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="default"
                            onClick={handleUpdateTopic}
                            loading={updateTopic.isPending}
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
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {showBulkCategoryChange && (
                            <input
                              type="checkbox"
                              checked={selectedTopicIds.includes(topic.id)}
                              onChange={() => toggleTopicSelection(topic.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          )}
                          <span className="text-sm text-gray-500 font-mono px-2 py-1 bg-gray-100 rounded flex-shrink-0">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-gray-800 font-medium text-base truncate">
                            {topic.name}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium flex-shrink-0">
                            {topic.category}
                          </span>
                        </div>
                        {!showBulkCategoryChange && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => startEdit(topic)}
                            >
                              수정
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTopic(topic.id)}
                              loading={deleteTopic.isPending}
                            >
                              삭제
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {/* 도움말 */}
      <Card variant="warning" className="p-4">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2">도움말</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          {showCategoryManager ? (
            <>
              <li>• 카테고리는 주제를 그룹화하는 상위 분류입니다</li>
              <li>• 카테고리를 추가/수정/삭제할 수 있습니다</li>
              <li>• Enter 키로 빠르게 입력할 수 있습니다</li>
            </>
          ) : (
            <>
              <li>• 주제는 질문을 분류하는 카테고리입니다</li>
              <li>• 일괄 추가로 여러 주제를 한 번에 등록할 수 있습니다</li>
              <li>
                • 일괄 카테고리 변경으로 여러 주제의 카테고리를 한 번에 변경할
                수 있습니다
              </li>
              <li>• 주제 삭제 시 관련된 모든 질문도 함께 삭제됩니다</li>
              <li>• Enter 키로 빠르게 입력할 수 있습니다</li>
            </>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default TopicManager;
