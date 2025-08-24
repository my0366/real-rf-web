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

-- 회원가입 대기 테이블을 계정 상태 관리 테이블로 변경
CREATE TABLE IF NOT EXISTS user_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'email' CHECK (provider IN ('email', 'kakao', 'google', 'github')),
    is_active BOOLEAN DEFAULT false,
    activated_at TIMESTAMP WITH TIME ZONE,
    activated_by UUID REFERENCES auth.users(id),
    deactivated_at TIMESTAMP WITH TIME ZONE,
    deactivated_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 관리자 테이블 생성 (관리자 권한 관리)
CREATE TABLE IF NOT EXISTS admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

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

-- user_status 정책 (관리자만 접근 가능)
CREATE POLICY "Admins can view all user statuses" ON user_status
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
    );

CREATE POLICY "Admins can update user statuses" ON user_status
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Anyone can insert user status requests" ON user_status;

-- 시스템(트리거)에서 삽입할 수 있도록 정책 수정
CREATE POLICY "System can insert user status" ON user_status
    FOR INSERT WITH CHECK (true);

-- 사용자가 자신의 상태를 조회할 수 있도록 정책 추가
CREATE POLICY "Users can view own status" ON user_status
    FOR SELECT USING (user_id = auth.uid());

-- admins 정책 (무한 재귀 방지를 위해 단순화)
DROP POLICY IF EXISTS "Admins can view admins" ON admins;

-- 모든 인증된 사용자가 admins 테이블을 조회할 수 있도록 변경
-- (보안상 문제가 있을 수 있지만, 관리자 체크를 위해 필요)
CREATE POLICY "Authenticated users can view admins" ON admins
    FOR SELECT USING (auth.role() = 'authenticated');

-- 또는 더 안전한 방법: 자신의 관리자 여부만 확인 가능
-- CREATE POLICY "Users can check own admin status" ON admins
--     FOR SELECT USING (user_id = auth.uid());

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_topics_name ON topics(name);
CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_status_email ON user_status(email);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- 사용자 활성화 함수로 변경
CREATE OR REPLACE FUNCTION activate_user(user_status_id UUID)
RETURNS void AS $$
BEGIN
    -- 관리자 권한 확인
    IF NOT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can activate users';
    END IF;

    -- 사용자 활성화
    UPDATE user_status
    SET
        is_active = true,
        activated_at = NOW(),
        activated_by = auth.uid(),
        updated_at = NOW()
    WHERE id = user_status_id AND is_active = false;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or already activated';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 사용자 비활성화 함수
CREATE OR REPLACE FUNCTION deactivate_user(user_status_id UUID, deactivate_notes TEXT DEFAULT NULL)
RETURNS void AS $$
BEGIN
    -- 관리자 권한 확인
    IF NOT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can deactivate users';
    END IF;

    -- 사용자 비활성화
    UPDATE user_status
    SET
        is_active = false,
        deactivated_at = NOW(),
        deactivated_by = auth.uid(),
        notes = deactivate_notes,
        updated_at = NOW()
    WHERE id = user_status_id AND is_active = true;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found or already deactivated';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -- 새 가입자 자동 등록 트리거 함수 (개선된 버전)
-- CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- user_status 테이블에 레코드 삽입
    INSERT INTO public.user_status (user_id, email, is_active)
    VALUES (
        NEW.id,
        NEW.email,
        false
    )
    ON CONFLICT (user_id) DO NOTHING; -- 중복 시 무시

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- 오류 발생 시에도 사용자 생성은 계속 진행
        RAISE WARNING 'Failed to insert user_status for user % (error: %)', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 새 사용자 가입 시 자동으로 user_status에 등록하는 트리거
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 함수 권한 부여
GRANT EXECUTE ON FUNCTION activate_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION deactivate_user(UUID, TEXT) TO authenticated;

-- Supabase Auth 설정: 직접 회원가입 비활성화
-- 이 설정은 Supabase Dashboard > Authentication > Settings에서도 설정 가능
-- "Enable email confirmations" 활성화
-- "Enable email change confirmations" 활성화
-- "Enable manual signup" 비활성화 (Dashboard에서 설정)

-- 또는 RLS로 auth.users 테이블에 대한 직접 삽입 차단
-- 주의: 이 정책은 신중하게 적용해야 함
-- CREATE POLICY "Prevent direct user registration" ON auth.users
--     FOR INSERT TO public
--     WITH CHECK (false);

-- 첫 번째 관리자 계정을 수동으로 추가하는 함수 (한 번만 실행)
-- 실제 사용 시에는 첫 번째 사용자를 수동으로 admins 테이블에 추가해야 함

-- 첫 번째 관리자 추가 예시 (실제 사용자 ID로 변경 필요)
-- INSERT INTO admins (user_id) VALUES ('실제_사용자_UUID');

-- 기존 사용자들을 user_status 테이블에 추가하는 백필 함수
CREATE OR REPLACE FUNCTION backfill_user_status()
RETURNS void AS $$
BEGIN
    -- auth.users에 있지만 user_status에 없는 사용자들을 추가
    INSERT INTO user_status (user_id, email, provider, is_active)
    SELECT
        u.id,
        u.email,
        CASE
            WHEN u.app_metadata->>'provider' = 'kakao' THEN 'kakao'
            WHEN u.app_metadata->>'provider' = 'google' THEN 'google'
            WHEN u.app_metadata->>'provider' = 'github' THEN 'github'
            ELSE 'email'
        END as provider,
        false as is_active
    FROM auth.users u
    LEFT JOIN user_status us ON u.id = us.user_id
    WHERE us.user_id IS NULL;

    RAISE NOTICE 'Backfill completed. Added % users to user_status table.',
        (SELECT COUNT(*) FROM auth.users u LEFT JOIN user_status us ON u.id = us.user_id WHERE us.user_id IS NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 백필 함수 실행 (기존 사용자들을 user_status 테이블에 추가)
SELECT backfill_user_status();
