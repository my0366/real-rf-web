import './App.css'
import QuestionForm from './components/QuestionForm.tsx';
import RandomQuestion from './components/RandomQuestion.tsx';

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="p-6 flex flex-col gap-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    🎯 랜덤 질문 앱
                </h1>
                <div className="space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">📝 질문 등록</h2>
                        <QuestionForm/>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">🎲 랜덤 질문</h2>
                        <RandomQuestion/>
                    </div>
                </div>
            </div>
        </div>
    );
}

