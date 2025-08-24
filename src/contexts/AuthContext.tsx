import React from 'react';
import {createSupabaseClient} from '../supabaseClient';
import type {AuthState, LoginCredentials, SignUpCredentials} from '../types/auth';

interface AuthContextType extends AuthState {
    signIn: (credentials: LoginCredentials) => Promise<void>;
    signUp: (credentials: SignUpCredentials) => Promise<void>;
    signOut: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    signInWithKakao: () => Promise<void>;
    isAdmin: boolean;
    isActiveUser: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [state, setState] = React.useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    });

    const [isAdmin, setIsAdmin] = React.useState(false);
    const [isActiveUser, setIsActiveUser] = React.useState(false);

    // 관리자 권한 확인 함수를 useCallback으로 메모이제이션
    const checkAdminStatus = React.useCallback(async (userId: string) => {
        try {
            const { data, error } = await createSupabaseClient()
                .from('admins')
                .select('id')
                .eq('user_id', userId)
                .single();

            setIsAdmin(!error && !!data);
        } catch (error) {
            console.log('관리자 권한 확인 실패:', error);
            setIsAdmin(false);
        }
    }, []);

    // 사용자 활성화 상태 확인 함수
    const checkUserActiveStatus = React.useCallback(async (userId: string) => {
        try {
            const { data } = await createSupabaseClient()
                .from('user_status')
                .select('is_active')
                .eq('user_id', userId)
                .maybeSingle(); // single() 대신 maybeSingle() 사용

            console.log(data);
            // 레코드가 없으면 false, 있으면 is_active 값 확인
            setIsActiveUser(data?.is_active === true);
        } catch (error) {
            console.log('사용자 활성화 상태 확인 실패:', error);
            setIsActiveUser(false);
        }
    }, []);

    // 관리자 권한과 활성화 상태 확인을 위한 useEffect
    React.useEffect(() => {
        if (state.user?.id) {
            checkAdminStatus(state.user.id);
            checkUserActiveStatus(state.user.id);
        } else {
            setIsAdmin(false);
            setIsActiveUser(false);
        }
    }, [state.user?.id, checkAdminStatus, checkUserActiveStatus]);

    React.useEffect(() => {
        // 초기 세션 확인
        createSupabaseClient().auth.getSession().then(({data: {session}}) => {
            const user = session?.user ? {
                id: session.user.id,
                email: session.user.email!,
                created_at: session.user.created_at,
            } : null;

            setState(prev => ({
                ...prev,
                user,
                loading: false,
            }));
        });

        // 인증 상태 변경 리스너
        const {data: {subscription}} = createSupabaseClient().auth.onAuthStateChange(
            async (_, session) => {
                const user = session?.user ? {
                    id: session.user.id,
                    email: session.user.email!,
                    created_at: session.user.created_at,
                } : null;

                setState(prev => ({
                    ...prev,
                    user,
                    loading: false,
                    error: null,
                }));
            }
        );

        return () => subscription.unsubscribe();
    }, []); // 빈 의존성 배열로 한 번만 실행

    const signIn = async (credentials: LoginCredentials) => {
        setState(prev => ({...prev, loading: true, error: null}));

        const {error} = await createSupabaseClient().auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            setState(prev => ({...prev, loading: false, error: error.message}));
            throw new Error(error.message);
        }
    };

    const signOut = async () => {
        setState(prev => ({...prev, loading: true, error: null}));

        const {error} = await createSupabaseClient().auth.signOut();

        if (error) {
            setState(prev => ({...prev, loading: false, error: error.message}));
            throw new Error(error.message);
        } else {
            // 로그아웃 시 저장된 사용자 ID 초기화
        }
    };

    const deleteAccount = async (): Promise<void> => {
        setState(prev => ({...prev, loading: true, error: null}));

        try {
            // state에서 사용자 ID 추출
            if (!state.user?.id) {
                throw new Error('로그인이 필요합니다.');
            }

            const {error} = await createSupabaseClient(true).auth.admin.deleteUser(state.user.id);

            if (error) {
                setState(prev => ({...prev, loading: false, error: error.message}));
                throw new Error(error.message);
            }

            // 삭제 성공 시 사용자 정보 초기화
            setState(prev => ({...prev, loading: false, error: null, user: null}));
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : '계정 삭제 중 오류가 발생했습니다.'
            }));
            throw error;
        }
    };

    const signInWithKakao = async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const { error } = await createSupabaseClient().auth.signInWithOAuth({
                provider: 'kakao',
            });

            if (error) {
                setState(prev => ({ ...prev, loading: false, error: error.message }));
                throw new Error(error.message);
            }

            // OAuth는 리다이렉트되므로 여기서 loading을 false로 설정하지 않음
            // 리다이렉트 후 onAuthStateChange에서 처리됨
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : '카카오 로그인 중 오류가 발생했습니다.'
            }));
            throw error;
        }
    };

    // 회원가입 함수
    const signUp = async (credentials: SignUpCredentials) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const { error } = await createSupabaseClient().auth.signUp({
                email: credentials.email,
                password: credentials.password,
            });

            if (error) {
                setState(prev => ({ ...prev, loading: false, error: error.message }));
                throw new Error(error.message);
            }

            setState(prev => ({ ...prev, loading: false }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.'
            }));
            throw error;
        }
    };

    const value = {
        ...state,
        signIn,
        signUp,
        signOut,
        deleteAccount,
        signInWithKakao,
        isAdmin,
        isActiveUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
