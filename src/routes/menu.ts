export interface MenuProps {
  label: string;
  icon: string;
  path: string;
  description: string;
}

export const menuItems: MenuProps[] = [
  {
    label: '테스트',
    icon: '🎯',
    path: '/',
    description: 'RF Check',
  },
  {
    label: '주제 관리',
    icon: '📚',
    path: '/topics',
    description: '주제 추가 / 수정 / 삭제',
  },
  {
    label: '질문',
    icon: '🎴',
    path: '/questions-view',
    description: '등록된 질문 보기',
  },
  {
    label: '질문 관리',
    icon: '📝',
    path: '/questions',
    description: '질문 등록 / 수정/ 삭제',
  },
];

// 관리자 전용 메뉴
export const adminMenuItems: MenuProps[] = [
  {
    description: '회원가입 승인 및 관리',
    path: '/admin/users',
    label: '회원가입 승인',
    icon: '👥',
  },
];
