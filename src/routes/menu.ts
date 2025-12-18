export interface MenuProps {
  label: string;
  icon: string;
  path: string;
  description: string;
  category?: 'learning' | 'capture' | 'management' | 'settings';
}

// 개인 학습 중심으로 메뉴 구조를 재정렬했습니다.
// - learning: 학습/복습 흐름
// - capture: 내가 배운 내용을 기록/되돌아보는 영역
// - management: 컨텐츠 관리(주제/질문)
// - settings: 관리자/설정
export const menuItems: MenuProps[] = [
  // 📊 학습 시작 섹션
  {
    label: '대시보드',
    icon: '📊',
    path: '/',
    description: '학습 통계 및 진행도 확인',
    category: 'learning',
  },

  // 학습 흐름을 우선 배치
  {
    label: '테스트 풀기',
    icon: '🎯',
    path: '/test',
    description: '등록된 질문으로 테스트 진행',
    category: 'learning',
  },
  {
    label: '약점 복습',
    icon: '📌',
    path: '/unknown-words',
    description: '모르는 단어 집중 학습',
    category: 'learning',
  },
  {
    label: '질문 둘러보기',
    icon: '🎴',
    path: '/questions-view',
    description: '등록된 모든 질문 조회',
    category: 'learning',
  },

  // 내가 배운 것들을 기록하고 돌아보는 섹션
  {
    label: '내 기록',
    icon: '📝',
    path: '/notes',
    description: '내가 배운 내용/메모를 기록하고 복습',
    category: 'capture',
  },

  // 관리 섹션
  {
    label: '질문 관리',
    icon: '📝',
    path: '/questions',
    description: '질문 추가 / 수정 / 삭제',
    category: 'management',
  },
  {
    label: '주제 관리',
    icon: '📚',
    path: '/topics',
    description: '학습 주제 추가 및 관리',
    category: 'management',
  },
];

// 관리자 전용 메뉴
export const adminMenuItems: MenuProps[] = [
  {
    description: '회원가입 승인 및 관리',
    path: '/admin/users',
    label: '회원가입 승인',
    icon: '👥',
    category: 'settings',
  },
];
