# 🎯 랜덤 질문 앱

주제별 질문을 관리하고 테스트할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

### 📚 주제 관리

- 주제 생성, 수정, 삭제 (CRUD)
- 일괄 주제 등록 (텍스트 붙여넣기 지원)
- 기본 주제 17개 미리 등록

### 📝 질문 등록

- 개별 질문 등록
- 일괄 질문 등록 (한 줄에 하나씩)
- 주제별 분류
- 영어 번역 지원 (선택사항)

### 🎯 테스트 기능

- 스톱워치가 포함된 테스트 모드
- 화면 클릭으로 다음 질문 진행
- 주제별 필터링 지원
- 테스트 통계 (완료한 질문 수, 소요 시간)

### 📱 반응형 UI

- 모바일과 데스크탑 최적화
- 탭 기반 네비게이션
- Tailwind CSS로 구현된 모던한 디자인

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 Supabase 설정을 추가하세요:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Supabase 데이터베이스 설정

`supabase-setup.sql` 파일의 내용을 Supabase SQL 편집기에서 실행하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

## 🗄️ 데이터베이스 구조

### topics 테이블

- `id`: UUID (Primary Key)
- `name`: TEXT (주제 이름, Unique)
- `created_at`: TIMESTAMP

### questions 테이블

- `id`: UUID (Primary Key)
- `topic_id`: UUID (topics 테이블 참조)
- `content`: TEXT (질문 내용)
- `english`: TEXT (영어 번역, 선택사항)
- `created_at`: TIMESTAMP

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
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── TopicManager.tsx    # 주제 관리 컴포넌트
│   ├── QuestionForm.tsx    # 질문 등록 폼
│   └── RandomQuestion.tsx  # 랜덤 질문 및 테스트
├── types/
│   └── question.ts         # 타입 정의
├── supabaseClient.ts       # Supabase 클라이언트
└── App.tsx                 # 메인 앱 컴포넌트
```

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트 검사
npm run lint

# 미리보기
npm run preview
```

## 📝 기본 주제 목록

앱 설치 시 자동으로 등록되는 기본 주제들:

1. 고마워
2. 천만에요
3. 많은도움이됐어
4. ~해줘서 고마워
5. ~해줘서 고마워2
6. 실례합니다
7. 방해해서 미안하지만
8. ~해서 미안해
9. 괜찮아
10. 너 오늘 기분 좋아보이네
11. 날아갈 듯 기분 좋아
12. 이보다 더 좋을수는 없어
13. 감동했어
14. 축하해
15. 잘했어
16. 멋져
17. 훌룡해

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
