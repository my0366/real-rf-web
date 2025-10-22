import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import Layout from './components/Layout';
import { RouteManager } from './routes/route';
import WaitingForActivationPage from './pages/WaitingForActivationPage';

const queryClient = new QueryClient();

// 활성화된 사용자를 위한 앱 라우터
const AuthenticatedApp: React.FC = () => {
  return (
    <Layout>
      <RouteManager />
    </Layout>
  );
};

// 로그인 상태에 따른 라우터
const AppRouter: React.FC = () => {
  const { user, loading, isActiveUser } = useAuth();

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

  // 로그인되지 않은 경우
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 로그인되었지만 활성화되지 않은 경우
  if (!isActiveUser) {
    return <WaitingForActivationPage />;
  }

  // 로그인되고 활성화된 경우
  return <AuthenticatedApp />;
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
