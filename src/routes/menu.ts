export interface MenuProps {
    id: string;
    label: string;
    icon: string;
    path: string;
    description: string;
}

export const menuItems: MenuProps[] = [
    {
        id: 'test',
        label: '테스트',
        icon: '🎯',
        path: '/',
        description: '랜덤 질문 테스트'
    },
    {
        id: 'topics',
        label: '주제 관리',
        icon: '📚',
        path: '/topics',
        description: '주제 추가/수정/삭제'
    },
    {
        id: 'questions',
        label: '질문 관리',
        icon: '📝',
        path: '/questions',
        description: '질문 등록/수정/삭제'
    }
];