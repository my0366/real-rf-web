import React, {useState, useEffect, useRef} from 'react';
import {supabase} from '../supabaseClient';
import type {QuestionWithTopic} from '../types/question';

import TestResults from '../components/TestResults';
import TestControl from '../components/TestControl.tsx';
import TestProgress from '../components/TestProgress.tsx';
import QuestionCard from '../components/QuestionCard.tsx';
import WaitingCard from '../components/WaitingCard.tsx';

const TestPage: React.FC = () => {
    // 테스트 관련 상태
    const [currentQuestion, setCurrentQuestion] = useState<QuestionWithTopic | null>(null);
    const [isTestMode, setIsTestMode] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [showResults, setShowResults] = useState(false);

    // 질문 관리 상태 (중복 방지)
    const [availableQuestions, setAvailableQuestions] = useState<QuestionWithTopic[]>([]);
    const [usedQuestions, setUsedQuestions] = useState<QuestionWithTopic[]>([]);
    const [totalQuestionsInSet, setTotalQuestionsInSet] = useState(0);

    // 설정 관련 상태
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [topics, setTopics] = useState<{ id: string; name: string }[]>([]);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchTopics();
        // fetchTotalQuestions();
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setElapsedTime((prev) => prev + 10);
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

    const fetchTopics = async () => {
        try {
            const {data, error} = await supabase
                .from('topics')
                .select('id, name')
                .order('name');

            if (error)
              throw error;
            setTopics(data || []);
            if (data && data.length > 0) {
                setSelectedTopicId(data[0].id);
            }
        } catch (error) {
            console.error('주제를 불러오는 중 오류:', error);
        }
    };

    // const fetchTotalQuestions = async () => {
    //     try {
    //         const {count, error} = await supabase
    //             .from('questions')
    //             .select('*', {count: 'exact', head: true});
    //
    //         if (error) throw error;
    //     } catch (error) {
    //         console.error('총 질문 수를 불러오는 중 오류:', error);
    //     }
    // };

    const fetchTestQuestions = async () => {
        try {
            let query = supabase.from('questions').select(`
                    *,
                    topic:topics(id, name)
                `);

            if (selectedTopicId) {
                query = query.eq('topic_id', selectedTopicId);
            }

            const {data, error} = await query;

            if (error) throw error;

            if (data && data.length > 0) {
                const questions = data as QuestionWithTopic[];
                setAvailableQuestions([...questions]);
                setUsedQuestions([]);
                setTotalQuestionsInSet(questions.length);
                return questions;
            }
            return [];
        } catch (error) {
            console.error('테스트 질문을 불러오는 중 오류:', error);
            return [];
        }
    };

    const getRandomQuestion = () => {
        if (availableQuestions.length === 0) {
            // 모든 질문을 다 사용했을 때
            setCurrentQuestion(null);
            setIsRunning(false);
            setIsTestMode(false);
            setShowResults(true);
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions[randomIndex];

        // 선택된 질문을 사용된 질문으로 이동
        const newAvailable = availableQuestions.filter((_, index) => index !== randomIndex);
        const newUsed = [...usedQuestions, selectedQuestion];

        setAvailableQuestions(newAvailable);
        setUsedQuestions(newUsed);
        setCurrentQuestion(selectedQuestion);
    };

    const startTest = async () => {
        const questions = await fetchTestQuestions();
        if (questions.length === 0) {
            alert('테스트할 질문이 없습니다. 질문을 먼저 등록해주세요.');
            return;
        }

        setIsTestMode(true);
        setQuestionCount(0);
        setElapsedTime(0);
        setIsRunning(true);
        setShowResults(false);

        // 첫 번째 질문 가져오기
        setTimeout(() => {
            getRandomQuestion();
        }, 100);
    };

    const stopTest = () => {
        setIsRunning(false);
        setIsTestMode(false);
        setShowResults(true);
    };

    const nextQuestion = () => {
        setQuestionCount((prev) => prev + 1);
        getRandomQuestion();
    };

    const restartTest = () => {
        setShowResults(false);
        startTest();
    };

    const newTest = () => {
        setShowResults(false);
        setCurrentQuestion(null);
        setIsTestMode(false);
        setIsRunning(false);
        setQuestionCount(0);
        setElapsedTime(0);
        setAvailableQuestions([]);
        setUsedQuestions([]);
        setTotalQuestionsInSet(0);
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

    const selectedTopic = topics.find(t => t.id === selectedTopicId);


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
                            selectedTopic: selectedTopic?.name
                        }}
                        onRestart={restartTest}
                        onNewTest={newTest}
                    />
                </div>
            )}

            {!showResults && (
                <div className="flex-1 flex flex-col">
                    {!isTestMode && (
                        <TestControl
                            topics={topics}
                            selectedTopicId={selectedTopicId}
                            setSelectedTopicId={setSelectedTopicId}
                            onStart={startTest}
                        />
                    )}

                    {isTestMode && (
                        <TestProgress
                            elapsedTime={elapsedTime}
                            questionCount={questionCount}
                            totalQuestions={totalQuestionsInSet}
                            remainingQuestions={availableQuestions.length}
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
                            />
                        ) : (
                            <WaitingCard/>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestPage;
