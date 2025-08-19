-- Supabase에서 실행할 SQL 스크립트
-- questions 테이블 생성

CREATE TABLE IF NOT EXISTS questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 설정
CREATE POLICY "Enable read access for all users" ON questions
    FOR SELECT USING (true);

-- 모든 사용자가 삽입 가능하도록 정책 설정
CREATE POLICY "Enable insert access for all users" ON questions
    FOR INSERT WITH CHECK (true);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at);
