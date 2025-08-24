import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui';
import Header from './ui/Header.tsx';
import { menuItems, adminMenuItems } from '../routes/menu.ts';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut, deleteAccount, loading, isAdmin } = useAuth();

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
                <Header setSidebarOpen={setSidebarOpen} />

                {/* 페이지 컨텐츠 */}
                <div className="flex-1">
                    {children}
                </div>
            </div>

            {/* 모바일 사이드바 오버레이 */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* 사이드바 */}
            <div className={`
                fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                md:relative md:translate-x-0 md:w-96 md:shadow-none md:border-l md:border-gray-200
            `}>
                <div className="flex flex-col h-full">
                    {/* 사이드바 헤더 */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">메뉴</h2>
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700"
                            onClick={() => setSidebarOpen(false)}
                        >
                            ✕
                        </button>
                    </div>

                    {/* 네비게이션 메뉴 */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {/* 일반 메뉴 */}
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`
                                            w-full text-left px-4 py-3 rounded-lg transition-colors duration-200
                                            ${location.pathname === item.path
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                    </button>
                                </li>
                            ))}

                            {/* 관리자 메뉴 구분선 */}
                            {isAdmin && adminMenuItems.length > 0 && (
                                <li className="pt-4">
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="px-4 py-2">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                관리자 메뉴
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            )}

                            {/* 관리자 전용 메뉴 */}
                            {isAdmin && adminMenuItems.map((item) => (
                                <li key={item.path}>
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`
                                            w-full text-left px-4 py-3 rounded-lg transition-colors duration-200
                                            ${location.pathname === item.path
                                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                                : 'text-gray-700 hover:bg-purple-50'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                            <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                                관리자
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
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
                            <span className="mr-2">🚪</span>
                            로그아웃
                        </Button>

                        {/* 회원탈퇴 버튼 */}
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleDeleteAccount}
                            disabled={loading || isDeleting}
                            className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        >
                            <span className="mr-2">⚠️</span>
                            {isDeleting ? '삭제 중...' : '회원탈퇴'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
