import React, { useState } from 'react';
import { Button, Card, Select } from '../components/ui';
import {
  useUnknownWords,
  useRemoveUnknownWord,
  useMarkAsLearned,
  useUnknownWordsStats,
} from '../hooks/useUnknownWords';

const UnknownWordsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unlearned' | 'learned'>(
    'unlearned'
  );

  const { data: allWords = [], isLoading } = useUnknownWords(false);
  const { data: stats } = useUnknownWordsStats();
  const removeUnknownWord = useRemoveUnknownWord();
  const markAsLearned = useMarkAsLearned();

  // 필터링된 단어 목록
  const filteredWords = allWords.filter(word => {
    if (filter === 'unlearned') return !word.is_learned;
    if (filter === 'learned') return word.is_learned;
    return true;
  });

  const handleRemove = async (questionId: string) => {
    if (confirm('모르는 단어 목록에서 제거하시겠습니까?')) {
      try {
        await removeUnknownWord.mutateAsync(questionId);
      } catch (error) {
        console.error('Failed to remove:', error);
        alert('제거에 실패했습니다.');
      }
    }
  };

  const handleMarkAsLearned = async (
    questionId: string,
    isLearned: boolean
  ) => {
    try {
      if (!isLearned) {
        await markAsLearned.mutateAsync(questionId);
      }
    } catch (error) {
      console.error('Failed to mark as learned:', error);
      alert('학습 완료 표시에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-8">
      {/* 헤더 */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          📚 모르는 단어
        </h2>
        <p className="text-sm text-gray-600">
          학습이 필요한 단어들을 관리하고 복습하세요
        </p>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <Card variant="primary" padding="md">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#228BE6]">
                {stats.total}
              </div>
              <div className="text-xs text-gray-600">전체</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">
                {stats.unlearned}
              </div>
              <div className="text-xs text-gray-600">학습 중</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">
                {stats.learned}
              </div>
              <div className="text-xs text-gray-600">학습 완료</div>
            </div>
          </div>
        </Card>
      )}

      {/* 필터 */}
      <Card variant="primary" padding="md">
        <div className="flex items-center gap-4">
          <Select
            label="필터"
            value={filter}
            onChange={e =>
              setFilter(e.target.value as 'all' | 'unlearned' | 'learned')
            }
          >
            <option value="unlearned">학습 중인 단어</option>
            <option value="all">모든 단어</option>
            <option value="learned">학습 완료한 단어</option>
          </Select>
          <div className="text-sm text-gray-600 pt-6">
            {filteredWords.length}개의 단어
          </div>
        </div>
      </Card>

      {/* 단어 목록 */}
      {filteredWords.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-gray-500 text-base mb-2">
              {filter === 'unlearned'
                ? '학습 중인 단어가 없습니다.'
                : filter === 'learned'
                  ? '학습 완료한 단어가 없습니다.'
                  : '저장된 단어가 없습니다.'}
            </p>
            <p className="text-gray-400 text-sm">
              질문 카드에서 "모르는 단어" 버튼을 눌러 추가하세요!
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map(word => (
            <Card
              key={word.id}
              padding="lg"
              className={`hover:shadow-lg transition-shadow duration-200 border-l-4 ${
                word.is_learned ? 'border-l-green-500' : 'border-l-orange-500'
              }`}
            >
              <div className="space-y-3">
                {/* 헤더 */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {word.question.topic.name}
                  </span>
                  {word.is_learned ? (
                    <span className="text-xs text-green-600 font-semibold">
                      ✓ 학습 완료
                    </span>
                  ) : (
                    <span className="text-xs text-orange-600 font-semibold">
                      학습 중
                    </span>
                  )}
                </div>

                {/* 질문 내용 */}
                <div className="space-y-2">
                  <div className="text-lg font-bold text-gray-900 leading-relaxed min-h-[3rem] flex items-center">
                    {word.question.content}
                  </div>

                  {/* 영어 번역 */}
                  {word.question.english && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 text-sm flex-shrink-0 mt-0.5">
                          🌍
                        </span>
                        <div className="text-sm text-gray-600 italic leading-relaxed">
                          {word.question.english}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 학습 정보 */}
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>복습 횟수: {word.review_count}회</span>
                    <span>
                      {new Date(word.marked_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  {word.last_reviewed_at && (
                    <div className="text-xs text-gray-400">
                      마지막 복습:{' '}
                      {new Date(word.last_reviewed_at).toLocaleDateString(
                        'ko-KR'
                      )}
                    </div>
                  )}
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2 pt-2">
                  {!word.is_learned && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        handleMarkAsLearned(word.question_id, word.is_learned)
                      }
                      className="flex-1"
                      icon="✓"
                    >
                      학습 완료
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemove(word.question_id)}
                    className={!word.is_learned ? '' : 'flex-1'}
                    icon="✕"
                  >
                    제거
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 학습 팁 */}
      <Card variant="warning" padding="md">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
          💡 학습 팁
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 모르는 단어는 반복적으로 복습하면 더 잘 외울 수 있습니다</li>
          <li>• 하루에 5-10개씩 집중해서 학습하는 것을 추천합니다</li>
          <li>• 영어 번역과 함께 문맥을 이해하면 기억에 오래 남습니다</li>
          <li>• 학습 완료한 단어도 주기적으로 복습하세요</li>
          <li>• 복습 횟수가 많을수록 장기 기억으로 전환됩니다</li>
        </ul>
      </Card>
    </div>
  );
};

export default UnknownWordsPage;
