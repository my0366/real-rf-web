import { useState, useEffect } from 'react';
import { Button, Card } from './ui';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PWAInstallGuide({
  isOpen,
  onClose,
}: PWAInstallGuideProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // iOS 기기 감지
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOSDevice(iOS);

    // 이미 PWA로 설치되어 있는지 확인
    const standalone =
      (window.navigator as Navigator & { standalone?: boolean }).standalone ||
      window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // beforeinstallprompt 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA 설치됨');
      }
      setDeferredPrompt(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-auto" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              📱 앱으로 설치하기
            </h2>
            <p className="text-gray-600">RF Check를 앱처럼 사용해보세요!</p>
          </div>
          <Button
            variant="secondary"
            onClick={onClose}
            icon="✕"
            size="md"
            className="shrink-0"
          >
            닫기
          </Button>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {isStandalone ? (
              <div className="text-center py-12">
                <div className="text-green-600 text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  이미 앱으로 설치되어 있습니다!
                </h3>
                <p className="text-gray-600">
                  훌륭합니다! 이미 PWA로 사용 중이네요.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Android/Chrome */}
                {deferredPrompt && (
                  <Card className="border-l-4 border-l-green-500" padding="md">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🤖</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Android / Chrome
                        </h3>
                        <Button
                          onClick={handleInstallClick}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          지금 설치하기
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* iOS Safari */}
                {isIOSDevice && (
                  <Card className="border-l-4 border-l-blue-500" padding="md">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🍎</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          iPhone / iPad
                        </h3>
                        <div className="text-sm text-gray-600 space-y-2">
                          <p>
                            1. Safari 하단의{' '}
                            <span className="font-mono bg-gray-100 px-1 rounded">
                              공유
                            </span>{' '}
                            버튼을 탭하세요
                          </p>
                          <p>
                            2.{' '}
                            <span className="font-mono bg-gray-100 px-1 rounded">
                              홈 화면에 추가
                            </span>
                            를 선택하세요
                          </p>
                          <p>
                            3.{' '}
                            <span className="font-mono bg-gray-100 px-1 rounded">
                              추가
                            </span>
                            를 탭하면 완료!
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Desktop */}
                {!isIOSDevice && !deferredPrompt && (
                  <Card className="border-l-4 border-l-purple-500" padding="md">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🖥️</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          데스크톱
                        </h3>
                        <div className="text-sm text-gray-600 space-y-2">
                          <p>
                            1. 주소창 오른쪽의{' '}
                            <span className="font-mono bg-gray-100 px-1 rounded">
                              설치
                            </span>{' '}
                            아이콘을 클릭하세요
                          </p>
                          <p>
                            2. 또는 Chrome 메뉴에서{' '}
                            <span className="font-mono bg-gray-100 px-1 rounded">
                              앱 설치
                            </span>
                            를 선택하세요
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                <Card
                  className="bg-blue-50 border-l-4 border-l-blue-400"
                  padding="md"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        앱 설치의 장점
                      </h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• 더 빠른 로딩 속도</li>
                        <li>• 오프라인에서도 사용 가능</li>
                        <li>• 홈 화면에서 바로 접근</li>
                        <li>• 앱처럼 전체화면으로 사용</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
