import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui';
import Header from './ui/Header.tsx';
import PWAInstallGuide from './PWAInstallGuide';
import { menuItems, adminMenuItems } from '../routes/menu.ts';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPWAGuide, setShowPWAGuide] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, deleteAccount, loading, isAdmin } = useAuth();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      '정말로 계정을 삭제하시겠습니까?\n모든 데이터가 영구적으로 삭제되며, 이 작업은 되돌릴 수 없습니다.'
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await deleteAccount();
      alert('계정이 성공적으로 삭제되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('계정 삭제 오류:', error);
      alert('계정 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#228BE6]/5 via-indigo-50 to-purple-50 flex">
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <Header
          setSidebarOpen={setSidebarOpen}
          onPWAGuideOpen={() => setShowPWAGuide(true)}
        />

        {/* 페이지 컨텐츠 */}
        <div className="flex-1">{children}</div>
      </div>
      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`
                fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                md:relative md:translate-x-0 md:w-96 md:shadow-none md:border-l md:border-gray-200
            `}
      >
        <div className="flex flex-col h-full">
          {/* 사이드바 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">메뉴</h2>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </Button>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {/* 학습 섹션 */}
            {menuItems.some(item => item.category === 'learning') && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
                  학습하기
                </p>
                <ul className="space-y-2">
                  {menuItems
                    .filter(item => item.category === 'learning')
                    .map(item => (
                      <li key={item.path}>
                        <Button
                          variant="ghost"
                          className={`
                            w-full text-left px-4 py-3 rounded-lg transition-colors duration-200
                            ${
                              location.pathname === item.path
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'text-gray-700 hover:bg-gray-100'
                            }
                          `}
                          onClick={() => handleNavigation(item.path)}
                          title={item.description}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{item.icon}</span>
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-gray-500">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* 관리 섹션 */}
            {menuItems.some(item => item.category === 'management') && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
                  컨텐츠 관리
                </p>
                <ul className="space-y-2">
                  {menuItems
                    .filter(item => item.category === 'management')
                    .map(item => (
                      <li key={item.path}>
                        <Button
                          variant="ghost"
                          className={`
                            w-full text-left px-4 py-3 rounded-lg transition-colors duration-200
                            ${
                              location.pathname === item.path
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'text-gray-700 hover:bg-gray-100'
                            }
                          `}
                          onClick={() => handleNavigation(item.path)}
                          title={item.description}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{item.icon}</span>
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-gray-500">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* 관리자 메뉴 */}
            {isAdmin && adminMenuItems.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3 border-t pt-3">
                  ⚙️ 관리자
                </p>
                <ul className="space-y-2">
                  {adminMenuItems.map(item => (
                    <li key={item.path}>
                      <Button
                        variant="ghost"
                        className={`
                          w-full text-left px-4 py-3 rounded-lg transition-colors duration-200
                          ${
                            location.pathname === item.path
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'text-gray-700 hover:bg-purple-50'
                          }
                        `}
                        onClick={() => handleNavigation(item.path)}
                        title={item.description}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
          {/* 하단 버튼들 */}
          <div className="p-4 space-y-3">
            {/* 로그아웃 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={loading}
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
            >
              로그아웃
            </Button>

            {/* 회원탈퇴 버튼 */}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
              disabled={loading || isDeleting}
              className="w-full justify-start"
            >
              {isDeleting ? '삭제 중...' : '회원탈퇴'}
            </Button>
          </div>
        </div>
      </div>
      {/* PWA 설치 가이드 모달 - 페이지 전체 위에 표시 */}
      <PWAInstallGuide
        isOpen={showPWAGuide}
        onClose={() => setShowPWAGuide(false)}
      />
    </div>
  );
};

export default Layout;
