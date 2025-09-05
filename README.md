# 🎯 RF Check

<div align="center">
  <img src="./public/logo.svg" alt="RF Check 로고" width="120" height="120">
  <p><strong>주제별 질문을 관리하고 테스트할 수 있는 웹 애플리케이션입니다.</strong></p>
</div>

## ✨ 주요 기능

<div align="center">
  <img src="./public/test-icon.svg" alt="테스트" width="48" height="48">
  <img src="./public/topic-icon.svg" alt="주제 관리" width="48" height="48">
  <img src="./public/question-icon.svg" alt="질문 관리" width="48" height="48">
</div>

### 🎯 테스트 기능

- 스톱워치가 포함된 테스트 모드(ON/OFF 가능)
- 화면 클릭으로 다음 질문 진행
- 주제를 선택하여 테스트(다중 선택)

### 📚 주제 관리

- 주제 생성, 수정, 삭제 (CRUD)
- 일괄 주제 등록 (텍스트 붙여넣기 지원)

### 📝 질문 등록

- 개별 질문 등록
- 일괄 질문 등록 (한 줄에 하나씩)
- 주제별 분류 및 검색

## 🚀 시작하기

### 1. 의존성 설치

```bash
pnpm i
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 Supabase 설정을 추가하세요:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. 개발 서버 실행

```bash
pnpm run dev
```

## 📱 사용법

### 주제 관리

1. **새 주제 추가**: 주제 이름을 입력하고 추가 버튼 클릭
2. **일괄 등록**: 텍스트를 붙여넣기하여 여러 주제를 한 번에 등록
3. **주제 수정/삭제**: 각 주제 옆의 버튼으로 관리

### 질문 등록

1. **개별 등록**: 주제 선택 후 질문 내용과 영어 번역 입력
2. **일괄 등록**: 주제 선택 후 여러 질문을 한 줄에 하나씩 입력

### 테스트

1. **테스트 시작**: 원하는 주제 선택 후 테스트 시작 버튼 클릭
2. **질문 진행**: 화면을 클릭하여 다음 질문으로 진행
3. **테스트 종료**: 테스트 종료 버튼으로 스톱워치 정지

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # UI 기본 컴포넌트
│   └── ...             # 기능별 컴포넌트
├── contexts/           # React Context
├── hooks/              # 커스텀 훅
├── pages/              # 페이지 컴포넌트
├── routes/             # 라우팅 설정
├── types/              # TypeScript 타입 정의
└── assets/             # 정적 리소스
```

## 🎨 디자인 시스템

앱에는 일관된 디자인을 위한 커스텀 아이콘들이 포함되어 있습니다:

- 🎯 **앱 로고**: 타겟과 질문 마크를 결합한 브랜드 아이덴티티
- 🟢 **테스트 아이콘**: 테스트 모드를 나타내는 초록색 아이콘
- 🟣 **주제 아이콘**: 주제 관리를 나타내는 보라색 아이콘  
- 🟠 **질문 아이콘**: 질문 관리를 나타내는 주황색 아이콘
