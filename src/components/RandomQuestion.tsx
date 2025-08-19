import {useState} from 'react';
import {supabase} from '../supabaseClient';
import type {Question} from '../types/question.ts';


export default function RandomQuestion() {
    const [topic, setTopic] = useState('');
    const [question, setQuestion] = useState<Question | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchRandom = async () => {
        setIsLoading(true);
        let query = supabase.from('questions').select('*');
        if (topic.trim()) {
            query = query.eq('topic', topic.trim());
        }
        const {data, error} = await query;

        if (error) {
            alert('에러: ' + error.message);
            setIsLoading(false);
            return;
        }
        if (!data || data.length === 0) {
            alert(topic.trim() ? `"${topic}" 주제의 질문이 없습니다.` : '등록된 질문이 없습니다.');
            setIsLoading(false);
            return;
        }

        const random = data[Math.floor(Math.random() * data.length)];
        setQuestion(random);
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    주제 필터 (선택사항)
                </label>
                <input
                    placeholder="특정 주제만 보고 싶다면 입력하세요"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isLoading}
                />
            </div>
            <button
                onClick={fetchRandom}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                disabled={isLoading}
            >
                {isLoading ? "검색 중..." : "🎲 랜덤 질문 뽑기"}
            </button>
            {question && (
                <div className="mt-4 p-4 border-2 border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {question.topic}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(question.created_at).toLocaleDateString('ko-KR')}
                        </span>
                    </div>
                    <p className="text-lg text-gray-800 leading-relaxed">{question.text}</p>
                </div>
            )}
        </div>
    );
}
