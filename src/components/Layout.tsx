import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Button} from './ui';
import Header from './ui/Header.tsx';
import {menuItems} from '../routes/menu.ts';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();


    const handleNavigation = (path: string) => {
        navigate(path);
        setSidebarOpen(false);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#228BE6]/5 via-indigo-50 to-purple-50 flex">
            {/* 메인 컨텐츠 영역 */}
            <div className="flex-1 flex flex-col">
                {/* 헤더 */}
                <Header setSidebarOpen={setSidebarOpen}/>
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
                        <h2 className="text-lg font-semibold text-gray-800">메뉴</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(false)}
                            icon="✕"
                            className="md:hidden"/>
                    </div>

                    {/* 메뉴 항목들 */}
                    <div className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.path)}
                                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200
                  ${location.pathname === item.path
                                    ? 'bg-[#228BE6] text-white shadow-lg'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-[#228BE6]'
                                }
                `}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                    <div className="font-medium">{item.label}</div>
                                    <div className={`text-sm ${
                                        location.pathname === item.path ? 'text-white/80' : 'text-gray-500'
                                    }`}>
                                        {item.description}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Layout;
