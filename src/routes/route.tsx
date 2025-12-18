import DashboardPage from '../pages/DashboardPage.tsx';
import OnboardingPage from '../pages/OnboardingPage.tsx';
import TestPage from '../pages/TestPage.tsx';
import TopicManagementPage from '../pages/TopicManagementPage.tsx';
import QuestionManagementPage from '../pages/QuestionManagementPage.tsx';
import QuestionViewPage from '../pages/QuestionViewPage.tsx';
import UserApprovalPage from '../pages/UserApprovalPage.tsx';
import UnknownWordsPage from '../pages/UnknownWordsPage.tsx';
import NotesPage from '../pages/NotesPage.tsx';
import { Route, Routes } from 'react-router-dom';

export function RouteManager() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route
        path="/onboarding"
        element={
          <OnboardingPage onComplete={() => (window.location.href = '/')} />
        }
      />
      <Route path="/test" element={<TestPage />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/topics" element={<TopicManagementPage />} />
      <Route path="/questions-view" element={<QuestionViewPage />} />
      <Route path="/questions" element={<QuestionManagementPage />} />
      <Route path="/unknown-words" element={<UnknownWordsPage />} />
      <Route path="/users" element={<UserApprovalPage />} />
      <Route path="/admin/users" element={<UserApprovalPage />} />
    </Routes>
  );
}
