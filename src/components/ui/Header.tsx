import { Button } from './index.ts';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  onPWAGuideOpen?: () => void;
}

export default function Header({
  setSidebarOpen,
  onPWAGuideOpen,
}: HeaderProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#228BE6] to-[#1E7BC8] bg-clip-text text-transparent">
            🎯 RF Check
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon="📱"
            onClick={onPWAGuideOpen}
            className="md:hidden"
          >
            앱 설치
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon="☰"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden"
          >
            메뉴
          </Button>
        </div>
      </div>
    </div>
  );
}
