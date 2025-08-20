import React from "react";
import { Button } from "./ui";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeMenu: "topics" | "questions" | "test";
  onMenuChange: (menu: "topics" | "questions" | "test") => void;
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeMenu,
  onMenuChange,
}) => {
  const menuItems = [
    { id: "topics", label: "주제 관리", icon: "📚" },
    { id: "questions", label: "질문 관리", icon: "📝" },
    { id: "test", label: "테스트", icon: "📝" },
  ];

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`
        fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        md:relative md:translate-x-0 md:z-auto
      `}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">관리 메뉴</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden"
          >
            ✕
          </Button>
        </div>

        {/* 메뉴 네비게이션 */}
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuChange(item.id as "topics" | "questions" | "test")}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${
                    activeMenu === item.id
                      ? "bg-[#228BE6] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/*/!* 컨텐츠 영역 *!/*/}
        {/*<div className="flex-1 overflow-y-auto">*/}
        {/*  <div className="p-4">{children}</div>*/}
        {/*</div>*/}
      </div>
    </>
  );
};

export default Sidebar;
