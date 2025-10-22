-- topics 테이블에 category 컬럼 추가
ALTER TABLE topics ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '리얼액션';

-- 기존 데이터에 대해 기본값 설정 (모두 리얼액션으로)
UPDATE topics SET category = '리얼액션' WHERE category IS NULL;

