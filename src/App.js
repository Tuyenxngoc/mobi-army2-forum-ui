import { Routes, Route, BrowserRouter } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Info from './pages/Info/Info';
import Forum from './pages/Forum/Forum';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';
import NewPost from './pages/NewPost/NewPost';
import ReviewPosts from './pages/ReviewPosts/ReviewPosts';
import PostDetail from './pages/PostDetail/PostDetail';
import RequireAuth from './utils/RequireAuth';
import { ROLES } from './common/contans';
import AccessDenied from './pages/AccessDenied/AccessDenied';
import Terms from './pages/Terms/Terms';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultLayout />}>
                    <Route index element={<Home />} />
                    <Route path="info" element={<Info />} />
                    <Route path="forum" element={<Forum />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="post/:id" element={<PostDetail />} />
                    <Route path="terms" element={<Terms />} />

                    <Route element={<RequireAuth />}>
                        <Route path="post/new" element={<NewPost />} />
                    </Route>

                    <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.SuperAdmin]} />}>
                        <Route path="post/review" element={<ReviewPosts />} />
                    </Route>

                    <Route path="access-denied" element={<AccessDenied />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
