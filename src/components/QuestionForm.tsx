import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function QuestionForm() {
    const [topic, setTopic] = useState("");
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase
            .from("questions")
            .insert([{ topic, text }]);

        if (error) {
            alert("에러: " + error.message);
        } else {
            alert("질문 등록 완료!");
            setTopic("");
            setText("");
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    주제
                </label>
                <input
                    placeholder="예: 개발, 일상, 취미 등"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    질문
                </label>
                <textarea
                    placeholder="질문을 입력해주세요"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isLoading}
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                disabled={isLoading}
            >
                {isLoading ? "등록 중..." : "질문 등록"}
            </button>
        </form>
    );
}
