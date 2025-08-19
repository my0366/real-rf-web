# 🎯 랜덤 질문 앱

React + Supabase를 사용한 간단한 랜덤 질문 생성기입니다.

## 주요 기능

- 📝 **질문 등록**: 주제와 함께 질문을 저장
- 🎲 **랜덤 질문**: 저장된 질문 중 무작위 선택
- 🔍 **주제별 필터**: 특정 주제의 질문만 랜덤 선택
- 💾 **실시간 데이터베이스**: Supabase를 통한 실시간 데이터 관리

## 기술 스택

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS (utility classes)

## 설치 및 실행 방법

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd real-rf-web
npm install
```

### 2. Supabase 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase-setup.sql` 파일의 내용 실행
3. Settings > API에서 프로젝트 URL과 anon key 확인

### 3. 환경 변수 설정
`.env.example`을 복사하여 `.env` 파일 생성:
```bash
cp .env.example .env
```

`.env` 파일에 Supabase 정보 입력:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 빌드
```bash
npm run build
```

## 프로젝트 구조

```
src/
├── components/
│   ├── QuestionForm.tsx    # 질문 등록 폼
│   └── RandomQuestion.tsx  # 랜덤 질문 표시
├── types/
│   └── question.ts         # Question 타입 정의
├── supabaseClient.ts       # Supabase 클라이언트 설정
└── App.tsx                 # 메인 앱 컴포넌트
```

## 배포

### Vercel 배포
1. GitHub에 프로젝트 푸시
2. Vercel에서 프로젝트 import
3. 환경 변수를 Vercel 설정에 추가
4. 자동 배포 완료

### Netlify 배포
1. GitHub에 프로젝트 푸시
2. Netlify에서 프로젝트 import
3. Build command: `npm run build`
4. Publish directory: `dist`
5. 환경 변수 설정 후 배포

## 데이터베이스 스키마

```sql
questions (
  id: UUID (Primary Key)
  topic: TEXT (질문 주제)
  text: TEXT (질문 내용)
  created_at: TIMESTAMP (생성일시)
)
```

## 라이센스

MIT License

