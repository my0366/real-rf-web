import React, { useState, useEffect, useRef } from 'react';
import type { QuestionWithTopic } from '../types/question';
import { useTopics, useTestQuestions } from '../hooks/useQuestions';
import {
  markQuestionAsWrong,
  markQuestionAsCorrect,
  saveLearningSession,
  sortByDifficulty,
} from '../utils/learningStats';

import TestResults from '../components/TestResults';
import TestControl from '../components/TestControl.tsx';
import TestProgress from '../components/TestProgress.tsx';
import QuestionCard from '../components/QuestionCard.tsx';
import UnknownQuestionsList from '../components/UnknownQuestionsList.tsx';

const TestPage: React.FC = () => {
  // 테스트 관련 상태
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionWithTopic | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // 스톱워치 모드 상태 추가
  const [isStopwatchMode, setIsStopwatchMode] = useState(true);

  // 질문 관리 상태 (중복 방지)
  const [availableQuestions, setAvailableQuestions] = useState<
    QuestionWithTopic[]
  >([]);
  const [usedQuestions, setUsedQuestions] = useState<QuestionWithTopic[]>([]);
  const [totalQuestionsInSet, setTotalQuestionsInSet] = useState(0);

  // 모르는 문제 추적을 위한 상태 추가
  const [unknownQuestions, setUnknownQuestions] = useState<QuestionWithTopic[]>(
    []
  );
  const [showUnknownQuestions, setShowUnknownQuestions] = useState(false);

  // 다중 주제 선택을 위한 상태 수정
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  // 카테고리 필터 상태 추가
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // 복습 모드 상태 추가
  const [isReviewMode, setIsReviewMode] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // React Query 훅들
  const { data: topics = [], isLoading: topicsLoading } = useTopics();
  const { refetch: fetchTestQuestions, isFetching: testQuestionsLoading } =
    useTestQuestions(
      isMultiSelectMode ? selectedTopicIds.join(',') : selectedTopicIds[0] || ''
    );

  useEffect(() => {
    if (topics.length > 0 && selectedTopicIds.length === 0) {
      setSelectedTopicIds([topics[0].id]);
    }
  }, [topics, selectedTopicIds]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const getRandomQuestion = (questionsPool?: QuestionWithTopic[]) => {
    // questionsPool이 제공되면 사용하고, 아니면 현재 availableQuestions 사용
    const questions = questionsPool || availableQuestions;

    if (questions.length === 0) {
      // 모든 질문을 다 사용했을 때 - 학습 세션 저장
      if (isTestMode) {
        saveLearningSession({
          date: new Date().toISOString(),
          topicIds: selectedTopicIds,
          totalQuestions: totalQuestionsInSet,
          unknownQuestions: unknownQuestions.map(q => q.id),
          duration: elapsedTime,
        });
      }

      setCurrentQuestion(null);
      setIsRunning(false);
      setIsTestMode(false);
      setShowResults(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];

    // 선택된 질문을 사용된 질문으로 이동
    const newAvailable = questions.filter((_, index) => index !== randomIndex);
    const newUsed = [...usedQuestions, selectedQuestion];

    setAvailableQuestions(newAvailable);
    setUsedQuestions(newUsed);
    setCurrentQuestion(selectedQuestion);
  };

  const startTest = async () => {
    try {
      const { data: questions } = await fetchTestQuestions();

      if (!questions || questions.length === 0) {
        alert('테스트할 질문이 없습니다. 질문을 먼저 등록해주세요.');
        return;
      }

      // 난이도순으로 정렬 (어려운 것부터)
      const sortedQuestions = sortByDifficulty(questions);

      setAvailableQuestions([...sortedQuestions]);
      setUsedQuestions([]);
      setTotalQuestionsInSet(sortedQuestions.length);

      setIsTestMode(true);
      setIsReviewMode(false);
      setQuestionCount(0);
      setElapsedTime(0);
      setIsRunning(true);
      setShowResults(false);

      // 첫 번째 질문 가져오기 - questions 배열을 직접 전달
      getRandomQuestion(sortedQuestions);
    } catch (error) {
      console.error('테스트 질문을 불러오는 중 오류:', error);
      alert('테스트를 시작할 수 없습니다. 다시 시도해주세요.');
    }
  };

  // 복습 모드 시작 함수
  const startReviewMode = () => {
    if (unknownQuestions.length === 0) {
      alert('복습할 문제가 없습니다.');
      return;
    }

    // 난이도순으로 정렬 (어려운 것부터)
    const sortedQuestions = sortByDifficulty(unknownQuestions);

    setAvailableQuestions([...sortedQuestions]);
    setUsedQuestions([]);
    setTotalQuestionsInSet(sortedQuestions.length);
    setUnknownQuestions([]); // 복습 시작 시 초기화

    setIsTestMode(true);
    setIsReviewMode(true);
    setQuestionCount(0);
    setElapsedTime(0);
    setIsRunning(true);
    setShowResults(false);
    setShowUnknownQuestions(false);

    getRandomQuestion(sortedQuestions);
  };

  const stopTest = () => {
    // 테스트 종료 시 학습 세션 저장
    saveLearningSession({
      date: new Date().toISOString(),
      topicIds: selectedTopicIds,
      totalQuestions: totalQuestionsInSet,
      unknownQuestions: unknownQuestions.map(q => q.id),
      duration: elapsedTime,
    });

    setIsRunning(false);
    setIsTestMode(false);
    setShowResults(true);
  };

  const nextQuestion = () => {
    // 현재 문제를 맞은 것으로 처리
    if (currentQuestion) {
      markQuestionAsCorrect(currentQuestion.id);
    }

    setQuestionCount(prev => prev + 1);
    getRandomQuestion();
  };

  // 모르는 문제로 표시하고 다음 질문으로 넘어가는 함수
  const markAsUnknownAndNext = () => {
    if (currentQuestion) {
      setUnknownQuestions(prev => [...prev, currentQuestion]);
      // 통계에 틀린 것으로 기록
      markQuestionAsWrong(currentQuestion.id);
    }
    setQuestionCount(prev => prev + 1);
    getRandomQuestion();
  };

  const restartTest = () => {
    setShowResults(false);
    setUnknownQuestions([]); // 재시작 시 모르는 문제 목록 초기화
    startTest();
  };

  const newTest = () => {
    setShowResults(false);
    setCurrentQuestion(null);
    setIsTestMode(false);
    setIsReviewMode(false);
    setIsRunning(false);
    setQuestionCount(0);
    setElapsedTime(0);
    setAvailableQuestions([]);
    setUsedQuestions([]);
    setTotalQuestionsInSet(0);
    setUnknownQuestions([]); // 새 테스트 시 모르는 문제 목록 초기화
    setShowUnknownQuestions(false);
  };

  // 모르는 문제 목록 보기/숨기기
  const toggleUnknownQuestions = () => {
    setShowUnknownQuestions(!showUnknownQuestions);
  };

  const handleScreenClick = () => {
    if (isTestMode && isRunning) {
      nextQuestion();
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const selectedTopics = topics.filter(t => selectedTopicIds.includes(t.id));

  if (topicsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">⏳</div>
          <p className="text-gray-600">주제를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {showResults && (
        <div className="flex-1 flex items-center justify-center p-4">
          <TestResults
            results={{
              totalQuestions: totalQuestionsInSet,
              completedQuestions: questionCount,
              totalTime: elapsedTime,
              averageTime: questionCount > 0 ? elapsedTime / questionCount : 0,
              selectedTopics: selectedTopics
                .map(topic => topic.name)
                .join(', '),
              unknownQuestions: unknownQuestions,
            }}
            onRestart={restartTest}
            onNewTest={newTest}
            onShowUnknownQuestions={toggleUnknownQuestions}
            onReviewUnknown={startReviewMode}
          />
        </div>
      )}

      {!showResults && (
        <div className="flex-1 flex flex-col">
          {!isTestMode && (
            <TestControl
              topics={topics}
              selectedTopicIds={selectedTopicIds}
              setSelectedTopicIds={setSelectedTopicIds}
              isMultiSelectMode={isMultiSelectMode}
              setIsMultiSelectMode={setIsMultiSelectMode}
              isStopwatchMode={isStopwatchMode}
              setIsStopwatchMode={setIsStopwatchMode}
              onStart={startTest}
              isLoading={testQuestionsLoading}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )}

          {isTestMode && (
            <TestProgress
              elapsedTime={elapsedTime}
              questionCount={questionCount}
              totalQuestions={totalQuestionsInSet}
              remainingQuestions={availableQuestions.length}
              isStopwatchMode={isStopwatchMode}
              isReviewMode={isReviewMode}
              onStop={stopTest}
              formatTime={formatTime}
            />
          )}

          <div className="flex-1 flex items-center justify-center p-4">
            {currentQuestion ? (
              <QuestionCard
                question={currentQuestion}
                isTestMode={isTestMode}
                onClick={handleScreenClick}
                currentQuestionNumber={questionCount + 1}
                totalQuestions={totalQuestionsInSet}
                onMarkAsUnknown={markAsUnknownAndNext}
              />
            ) : (
              <div />
            )}
          </div>
        </div>
      )}

      {/* 모르는 문제 목록 모달 */}
      {showUnknownQuestions && (
        <UnknownQuestionsList
          unknownQuestions={unknownQuestions}
          onClose={() => setShowUnknownQuestions(false)}
        />
      )}
    </div>
  );
};

export default TestPage;
