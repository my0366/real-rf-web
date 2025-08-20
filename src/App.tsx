
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import TestPage from './pages/TestPage';
import TopicManagementPage from './pages/TopicManagementPage';
import QuestionManagementPage from './pages/QuestionManagementPage';

// Query Client 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<TestPage />} />
            <Route path="/topics" element={<TopicManagementPage />} />
            <Route path="/questions" element={<QuestionManagementPage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
