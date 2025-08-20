-- Supabase에서 실행할 SQL 스크립트
-- topics 테이블 생성
CREATE TABLE IF NOT EXISTS topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- questions 테이블 생성 (주제 참조)
CREATE TABLE IF NOT EXISTS questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    english TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- topics 테이블 정책 설정
CREATE POLICY "Enable read access for all users" ON topics
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON topics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON topics
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON topics
    FOR DELETE USING (true);

-- questions 테이블 정책 설정
CREATE POLICY "Enable read access for all users" ON questions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON questions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON questions
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON questions
    FOR DELETE USING (true);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_topics_name ON topics(name);
CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at);
