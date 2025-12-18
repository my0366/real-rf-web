import { useState } from 'react';
import { Button, Card } from '../components/ui';

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
  tips: string[];
  action?: string;
}

const steps: OnboardingStep[] = [
  {
    title: 'RF Check에 오신 걸 환영합니다!',
    description: '효율적인 학습을 위한 스마트 학습 플랫폼입니다',
    icon: '🎯',
    tips: [
      '매일 꾸준히 학습하세요',
      '모르는 단어는 즉시 표시하세요',
      '주간 목표를 설정하세요',
    ],
  },
  {
    title: '대시보드에서 한눈에 확인',
    description:
      '학습 진행률, 총 질문 수, 복습 필요한 단어를 한눈에 볼 수 있습니다',
    icon: '📊',
    tips: [
      '매일 아침 진행도를 확인하세요',
      '진행률이 높아질수록 자신감이 생깁니다',
      '목표 진행률을 정해두고 진행하세요',
    ],
  },
  {
    title: '테스트로 실력 점검',
    description:
      '등록된 질문들로 테스트를 진행하고 모르는 부분을 즉시 표시할 수 있습니다',
    icon: '🎯',
    tips: [
      '주제별로 테스트를 진행하세요',
      '틀린 문제는 바로 "모르는 단어"로 표시하세요',
      '일주일에 3-4회 테스트를 진행하는 것을 추천합니다',
    ],
  },
  {
    title: '약점 집중 복습',
    description: '모르는 단어들만 따로 모아서 집중적으로 복습할 수 있습니다',
    icon: '📌',
    tips: [
      '매일 5-10분씩 약점 복습을 하세요',
      '여러 번 복습하면 자동으로 학습 완료 처리됩니다',
      '진행률 80% 이상이 목표입니다',
    ],
  },
  {
    title: '질문 관리로 학습 자료 구성',
    description:
      '새로운 질문을 추가하고 주제를 관리하는 영역입니다. 학습이 아닌 준비 시간에만 사용하세요',
    icon: '📝',
    tips: [
      '일주일에 1-2회 새로운 질문을 추가하세요',
      '엑셀로 대량 등록하면 더 효율적입니다',
      '주제는 명확하고 의미 있는 단위로 분류하세요',
    ],
  },
  {
    title: '이제 시작할 준비가 되었습니다!',
    description: '대시보드로 이동하여 첫 번째 학습을 시작해보세요',
    icon: '✨',
    tips: [
      '첫 주제와 질문 5개를 등록하세요',
      '작은 목표부터 시작하는 것이 성공의 비결입니다',
      '꾸준함이 최고의 학습 방법입니다',
    ],
  },
];

interface OnboardingPageProps {
  onComplete: () => void;
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 md:p-12">
        {/* 진행도 표시 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600">
              단계 {currentStep + 1} / {steps.length}
            </p>
            <p className="text-sm font-medium text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{step.icon}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {step.title}
          </h2>
          <p className="text-lg text-gray-600">{step.description}</p>
        </div>

        {/* 팁 섹션 */}
        <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <p className="font-semibold text-gray-900 mb-3">💡 팁:</p>
          <ul className="space-y-2">
            {step.tips.map((tip, index) => (
              <li key={index} className="text-gray-700 flex items-start gap-2">
                <span className="text-blue-500 font-bold">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 진행도 점수 */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1"
          >
            ← 이전
          </Button>
          <Button variant="default" onClick={handleNext} className="flex-1">
            {isLastStep ? '시작하기 🚀' : '다음 →'}
          </Button>
        </div>

        {/* 스킵 버튼 */}
        <div className="text-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onComplete}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            지금은 건너뛰기
          </Button>
        </div>
      </Card>
    </div>
  );
}
