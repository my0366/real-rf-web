import React from 'react';
import { createSupabaseClient } from '../supabaseClient';
import { Button, Card } from '../components/ui';
import { useNavigate } from 'react-router-dom';

const supabase = createSupabaseClient();

interface Stats {
  totalQuestions: number;
  unknownWords: number;
  learnedWords: number;
  progressPercentage: number;
  todayAttempts: number;
  totalAttempts: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState<Stats>({
    totalQuestions: 0,
    unknownWords: 0,
    learnedWords: 0,
    progressPercentage: 0,
    todayAttempts: 0,
    totalAttempts: 0,
  });

  // 통계 데이터 조회
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: questions } = await supabase
          .from('questions')
          .select('id')
          .is('is_deleted', false);

        const { data: unknownWords } = await supabase
          .from('unknown_words')
          .select('id')
          .eq('is_learned', false);

        const { data: learnedWords } = await supabase
          .from('unknown_words')
          .select('id')
          .eq('is_learned', true);

        const totalQuestions = questions?.length || 0;
        const totalUnknown = unknownWords?.length || 0;
        const totalLearned = learnedWords?.length || 0;

        const progressPercentage =
          totalUnknown + totalLearned > 0
            ? Math.round((totalLearned / (totalUnknown + totalLearned)) * 100)
            : 0;

        setStats({
          totalQuestions,
          unknownWords: totalUnknown,
          learnedWords: totalLearned,
          progressPercentage,
          todayAttempts: 0,
          totalAttempts: 0,
        });
      } catch (error) {
        console.error('통계 조회 실패:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="page-container">
      {/* 헤더 */}
      <div className="page-header">
        <h1 className="page-title">학습 대시보드</h1>
        <p className="page-subtitle">
          오늘도 화이팅! 꾸준한 학습이 성공의 키입니다
        </p>
      </div>

      {/* 핵심 통계 카드 */}
      <div className="grid-responsive-4">
        {/* 총 질문 수 */}
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats.totalQuestions}
          </div>
          <div className="text-sm text-gray-600">등록된 질문</div>
        </Card>

        {/* 진행도 */}
        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats.progressPercentage}%
          </div>
          <div className="text-sm text-gray-600">학습 진행률</div>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
        </Card>

        {/* 모르는 단어 */}
        <Card className="p-6 border-l-4 border-l-orange-500">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {stats.unknownWords}
          </div>
          <div className="text-sm text-gray-600">복습 필요</div>
        </Card>

        {/* 학습 완료 */}
        <Card className="p-6 border-l-4 border-l-purple-500">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {stats.learnedWords}
          </div>
          <div className="text-sm text-gray-600">학습 완료</div>
        </Card>
      </div>

      {/* 빠른 액션 */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">지금 시작하기</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/')}
            className="h-24 flex flex-col items-center justify-center text-base"
          >
            <span>테스트 풀기</span>
            <span className="text-xs text-gray-500 mt-1">
              {stats.totalQuestions}개 문제
            </span>
          </Button>

          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/unknown-words')}
            className="h-24 flex flex-col items-center justify-center text-base"
          >
            <span>약점 복습</span>
            <span className="text-xs text-gray-500 mt-1">
              {stats.unknownWords}개 남음
            </span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/questions')}
            className="h-24 flex flex-col items-center justify-center text-base"
          >
            <span>질문 추가</span>
            <span className="text-xs text-gray-500 mt-1">새로운 학습 자료</span>
          </Button>
        </div>
      </Card>

      {/* 학습 팁 */}
      <Card className="p-6 bg-yellow-50 border-l-4 border-l-yellow-500">
        <div className="flex gap-4">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">학습 팁</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ 매일 15분씩 꾸준히 학습하세요</li>
              <li>✓ 모르는 단어는 바로 체크해서 나중에 복습하세요</li>
              <li>✓ 일주일에 한 번은 전체 진행도를 확인하세요</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
