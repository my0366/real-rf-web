// WaitingCard.tsx
import React from "react";
import { Card } from "../components/ui";

const WaitingCard: React.FC = () => (
    <Card className="w-full max-w-2xl min-h-[400px] flex flex-col items-center justify-center" padding="lg">
        <div className="text-center space-y-6">
            <div className="text-8xl">🎲</div>
            <h2 className="text-2xl font-bold text-gray-800">
                테스트를 시작해보세요
            </h2>
            <p className="text-gray-600">
                주제를 선택하고 테스트 시작 버튼을 눌러주세요
            </p>
        </div>
    </Card>
);

export default WaitingCard;