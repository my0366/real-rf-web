import {BrowserRouter as Router,} from 'react-router-dom';
import Layout from './components/Layout';
import {RouteManager} from './routes/route.tsx';

export default function App() {
    return (
        <Router>
            <Layout>
                <RouteManager/>
            </Layout>
        </Router>
    );
}
