import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import Layout from './components/Layout';
import TestPage from './pages/TestPage';
import QuestionManagementPage from './pages/QuestionManagementPage';
import TopicManagementPage from './pages/TopicManagementPage';

const queryClient = new QueryClient();

// 인증된 사용자를 위한 앱 라우터
const AuthenticatedApp: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/questions" element={<QuestionManagementPage />} />
        <Route path="/topics" element={<TopicManagementPage />} />
        {/* 인증된 사용자가 /login에 접근하면 홈으로 리다이렉트 */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        {/* 정의되지 않은 경로는 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

// 비로그인 사용자를 위한 앱 라우터
const UnauthenticatedApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      {/* 모든 다른 경로는 로그인 페이지로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// 로그인 상태에 따른 라우터
const AppRouter: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인 상태에 따라 완전히 다른 라우터 렌더링
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
