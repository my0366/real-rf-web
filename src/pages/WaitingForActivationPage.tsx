import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const WaitingForActivationPage: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#228BE6]/5 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">계정 활성화 대기 중</h2>
          <p className="text-gray-600">
            회원가입이 완료되었지만 아직 관리자의 승인을 받지 못했습니다.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">{user?.email}</span>
          </div>
          <p className="text-xs text-gray-600">
            가입일: {user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : ''}
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <span className="text-blue-500">✓</span>
            <span>이메일 인증이 완료되었습니다</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-yellow-500">⏳</span>
            <span>관리자 승인을 기다리고 있습니다</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-gray-400">○</span>
            <span>승인 완료 후 서비스를 이용할 수 있습니다</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <p className="text-xs text-gray-500">
            승인이 지연되고 있다면 관리자에게 문의해주세요.
          </p>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full"
          >
            로그아웃
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WaitingForActivationPage;
