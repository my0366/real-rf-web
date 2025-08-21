import React from 'react';
import {createSupabaseClient} from '../supabaseClient';
import type {AuthState, LoginCredentials, SignUpCredentials} from '../types/auth';

interface AuthContextType extends AuthState {
    signIn: (credentials: LoginCredentials) => Promise<void>;
    signUp: (credentials: SignUpCredentials) => Promise<void>;
    signOut: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    signInWithKakao: () => Promise<void>;
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
    }, []);

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

    const signUp = async (credentials: SignUpCredentials) => {
        setState(prev => ({...prev, loading: true, error: null}));

        const {error} = await createSupabaseClient().auth.signUp({
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
                options: {
                    redirectTo: `${window.location.origin}/`,
                    // scopes: 'profile_nickname',
                }
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

    const value = {
        ...state,
        signIn,
        signUp,
        signOut,
        deleteAccount,
        signInWithKakao,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
