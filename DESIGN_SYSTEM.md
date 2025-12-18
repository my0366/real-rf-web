# 🎨 Design System 가이드

## 📋 목차
1. [색상 체계](#색상-체계)
2. [레이아웃 시스템](#레이아웃-시스템)
3. [공통 클래스](#공통-클래스)
4. [페이지 구조](#페이지-구조)
5. [컴포넌트 사용법](#컴포넌트-사용법)

---

## 색상 체계

### 섹션별 색상
프로젝트는 기능별로 명확한 색상 구분을 따릅니다:

| 섹션 | 색상 | 배경 | 테두리 | 텍스트 | 사용 예 |
|------|------|------|--------|--------|---------|
| **학습** | 파란색 | `bg-blue-50` | `border-blue-200` | `text-blue-700` | 테스트, 복습 페이지 |
| **기록** | 보라색 | `bg-purple-50` | `border-purple-200` | `text-purple-700` | Notes, 메모 페이지 |
| **관리** | 주황색 | `bg-amber-50` | `border-amber-200` | `text-amber-700` | 주제/질문 관리 |
| **성공** | 초록색 | `bg-green-100` | - | `text-green-700` | 성공 메시지, 배지 |
| **경고** | 노랑색 | `bg-amber-100` | - | `text-amber-700` | 경고 메시지 |
| **에러** | 빨강색 | `bg-red-100` | - | `text-red-700` | 에러 메시지 |

### CSS 변수 (src/index.css)
```css
:root {
  --color-learning: 59 89% 56%;      /* 파란색 */
  --color-management: 43 96% 56%;    /* 주황색 */
  --color-admin: 279 89% 50%;        /* 보라색 */
  --color-success: 142 76% 36%;      /* 초록색 */
  --color-warning: 38 92% 50%;       /* 주황색 */
  --color-error: 0 84% 60%;          /* 빨강색 */
}
```

---

## 레이아웃 시스템

### 페이지 패딩 공통화
모든 페이지는 `page-container` 클래스를 루트에 적용합니다:

```tsx
<div className="page-container">
  {/* 페이지 내용 */}
</div>
```

**패딩 규칙:**
- 모바일: `p-4` (16px)
- 태블릿: `md:p-6` (24px)
- 데스크탑: `lg:p-8` (32px)

**간격:**
- 섹션 간: `space-y-6 md:space-y-8` (24px ~ 32px)

---

## 공통 클래스

### 페이지 구조
```tsx
// 페이지 컨테이너
<div className="page-container">
  {/* 페이지 헤더 */}
  <div className="page-header">
    <h1 className="page-title">📚 주제 관리</h1>
    <p className="page-subtitle">학습 주제를 추가하고 관리하세요</p>
  </div>

  {/* 페이지 섹션 */}
  <div className="page-section">
    {/* 섹션 내용 */}
  </div>
</div>
```

### 카드 레이아웃
```tsx
// 표준 카드 패딩
<Card className="card-standard">
  {/* 콘텐츠 */}
</Card>

// 카드 헤더
<div className="card-header">
  <h3 className="card-header-title">📝 섹션 제목</h3>
</div>

// 카드 리스트
<div className="card-list">
  <div className="card-list-item">
    {/* 리스트 아이템 */}
  </div>
</div>
```

### 상태 표시
```tsx
// 빈 상태
<div className="state-empty">
  <div className="state-empty-icon">📝</div>
  <p className="state-empty-title">데이터가 없습니다</p>
  <p className="state-empty-subtitle">첫 항목을 추가해보세요</p>
</div>

// 로딩 상태
<div className="state-loading">
  <div>로딩 중...</div>
</div>
```

### 버튼 그룹
```tsx
// 가로 배치
<div className="button-group">
  <Button>버튼 1</Button>
  <Button>버튼 2</Button>
</div>

// 세로 배치
<div className="button-group-vertical">
  <Button>버튼 1</Button>
  <Button>버튼 2</Button>
</div>
```

### 폼 요소
```tsx
// 폼 필드 그룹
<div className="form-group">
  <label className="form-label">레이블</label>
  <Input />
  <p className="form-help">도움말 텍스트</p>
</div>

// 폼 행
<div className="form-row">
  <Input placeholder="필드 1" />
  <Input placeholder="필드 2" />
</div>
```

### 그리드 레이아웃
```tsx
// 3열 반응형 그리드 (lg에서 3열, sm에서 2열, 모바일에서 1열)
<div className="grid-responsive">
  <Card>항목 1</Card>
  <Card>항목 2</Card>
  <Card>항목 3</Card>
</div>

// 2열 반응형 그리드
<div className="grid-responsive-2">
  <Card>항목 1</Card>
  <Card>항목 2</Card>
</div>
```

---

## 페이지 구조

### 표준 페이지 레이아웃
```tsx
// pages/ExamplePage.tsx
import { Button, Card, Input } from '../components/ui';

export default function ExamplePage() {
  return (
    <div className="page-container">
      {/* 1. 페이지 헤더 */}
      <div className="page-header">
        <h1 className="page-title">📚 페이지 제목</h1>
        <p className="page-subtitle">페이지 설명</p>
      </div>

      {/* 2. 메인 카드 섹션 */}
      <Card className="card-standard">
        <div className="page-section">
          {/* 섹션 내용 */}
        </div>
      </Card>

      {/* 3. 리스트 섹션 */}
      <Card>
        <div className="card-header">
          <h3 className="card-header-title">📝 항목 목록</h3>
        </div>
        <div className="card-list">
          {items.length === 0 ? (
            <div className="state-empty">
              <div className="state-empty-icon">📭</div>
              <p className="state-empty-title">항목이 없습니다</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="card-list-item">
                {/* 항목 내용 */}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
```

---

## 컴포넌트 사용법

### Button 컴포넌트
```tsx
import { Button } from '../components/ui';

// 기본 버튼
<Button>클릭하기</Button>

// 색상 변형
<Button variant="default">기본</Button>
<Button variant="secondary">보조</Button>
<Button variant="destructive">삭제</Button>
<Button variant="ghost">고스트</Button>
<Button variant="outline">아웃라인</Button>

// 크기 변형
<Button size="sm">작음</Button>
<Button size="default">기본</Button>
<Button size="lg">큼</Button>
<Button size="icon">아이콘</Button>

// 상태
<Button disabled>비활성화</Button>
<Button loading>로딩 중...</Button>
```

### Card 컴포넌트
```tsx
import { Card } from '../components/ui';

// 기본 카드
<Card className="card-standard">
  <p>내용</p>
</Card>

// 색상 변형
<Card variant="success">성공</Card>
<Card variant="warning">경고</Card>
<Card variant="error">에러</Card>
```

### Input/Textarea 컴포넌트
```tsx
import { Input, Textarea } from '../components/ui';

// Input
<Input 
  placeholder="입력하세요"
  label="라벨"
  helpText="도움말"
  error={errorMessage}
/>

// Textarea
<Textarea 
  placeholder="여러 줄 입력"
  rows={4}
  label="라벨"
/>
```

---

## 색상 적용 예시

### 학습 섹션 (파란색)
```tsx
<Card className="bg-learning border-learning">
  <h3 className="text-learning">📚 학습 내용</h3>
</Card>
```

### 기록 섹션 (보라색)
```tsx
<Card className="bg-capture border-capture">
  <h3 className="text-capture">📝 내 기록</h3>
</Card>
```

### 관리 섹션 (주황색)
```tsx
<Card className="bg-management border-management">
  <h3 className="text-management">⚙️ 관리</h3>
</Card>
```

---

## 마진/패딩 규칙

### 외부 여백 (마진)
```
- 페이지 간: space-y-6 md:space-y-8
- 카드 간: space-y-4
- 내부 요소: space-y-2 ~ space-y-3
```

### 내부 여백 (패딩)
```
- 페이지: p-4 md:p-6 lg:p-8
- 카드: p-4 md:p-6
- 섹션: p-3 ~ p-4
- 요소: px-2 py-1 ~ px-4 py-2
```

---

## 체크리스트

새로운 페이지를 만들 때 확인사항:

- [ ] `page-container` 클래스를 루트에 적용
- [ ] `page-header`로 제목과 설명 표시
- [ ] 섹션별로 `Card` 컴포넌트 사용
- [ ] 빈 상태는 `state-empty` 클래스 사용
- [ ] 버튼은 `button-group` 클래스로 그룹화
- [ ] 폼은 `form-group` 클래스 사용
- [ ] 색상은 섹션별 클래스 활용 (bg-learning, bg-capture, bg-management)
- [ ] 모바일 대응 확인 (md:, lg: 프리픽스)

---

## 업데이트 이력

- **2025-12-17**: 디자인 시스템 정의 및 공통 클래스 추가
  - 색상 체계 통일
  - 레이아웃 공통화
  - 페이지 패딩/마진 표준화
  - shadcn UI 컴포넌트 통일

