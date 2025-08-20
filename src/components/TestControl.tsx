// TestControl.tsx
import React from "react";
import { Card, Select, Button } from "../components/ui";

interface TestControlProps {
    topics: { id: string; name: string }[];
    selectedTopicId: string;
    setSelectedTopicId: (id: string) => void;
    onStart: () => void;
    isLoading?: boolean;
}

const TestControl: React.FC<TestControlProps> = ({
    topics,
    selectedTopicId,
    setSelectedTopicId,
    onStart,
    isLoading = false,
}) => (
    <div className="p-4 bg-white/50">
        <Card variant="primary" padding="lg" className="max-w-2xl mx-auto">
            <div className="space-y-4">
                <Select
                    label="주제 선택"
                    icon="📚"
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                >
                    <option value="">모든 주제</option>
                    {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                            {topic.name}
                        </option>
                    ))}
                </Select>

                <Button
                    variant="success"
                    onClick={onStart}
                    icon="🚀"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    disabled={isLoading}
                >
                    테스트 시작
                </Button>
            </div>
        </Card>
    </div>
);

export default TestControl;

