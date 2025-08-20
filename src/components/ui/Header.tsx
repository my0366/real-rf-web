import {Button} from './index.ts';

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void;
}

export default function Header({setSidebarOpen}: HeaderProps) {
    // const location = useLocation();
    // const getCurrentPageTitle = (menuItems: MenuProps[]) => {
    //     const currentItem = menuItems.find(item => item.path === location.pathname);
    //     return currentItem ? currentItem.label : '테스트';
    // };

    return (
        <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-[#228BE6] to-[#1E7BC8] bg-clip-text text-transparent">
                        🎯 RF Check
                    </h1>

                </div>

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
    )
}
