import TestPage from '../pages/TestPage.tsx';
import TopicManagementPage from '../pages/TopicManagementPage.tsx';
import QuestionManagementPage from '../pages/QuestionManagementPage.tsx';
import UserApprovalPage from '../pages/UserApprovalPage.tsx';
import {Route, Routes} from 'react-router-dom';

export function RouteManager() {
    return (
        <Routes>
            <Route path="/" element={<TestPage/>}/>
            <Route path="/topics" element={<TopicManagementPage/>}/>
            <Route path="/questions" element={<QuestionManagementPage/>}/>
            <Route path="/users" element={<UserApprovalPage/>}/>
        </Routes>
    )
}
