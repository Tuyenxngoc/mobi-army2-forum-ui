import { Routes, Route, BrowserRouter } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Info from './pages/Info/Info';
import Forum from './pages/Forum/Forum';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';
import TopicDetail from './pages/TopicDetail/TopicDetail';
import RequireAuth from './utils/RequireAuth';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultLayout />}>
                    <Route index element={<Home />} />
                    <Route path="info" element={<Info />} />
                    <Route
                        path="forum"
                        element={
                            <RequireAuth>
                                <Forum />
                            </RequireAuth>
                        }
                    >
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="topic/:id" element={<TopicDetail />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
