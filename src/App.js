import { Routes, Route, BrowserRouter } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Info from './pages/Info/Info';
import Forum from './pages/Forum/Forum';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';
import NewPost from './pages/NewPost/NewPost';
import PostDetail from './pages/PostDetail/PostDetail';
import RequireAuth from './utils/RequireAuth';
import { ROLES } from './common/contans';
import AccessDenied from './pages/AccessDenied/AccessDenied';
import Terms from './pages/Terms/Terms';
import ConfirmEmail from './pages/ConfirmEmail/ConfirmEmail';
import Notification from './pages/Notification/Notification';
import FollowingPosts from './pages/FollowingPosts/FollowingPosts';
import NewNotification from './pages/NewNotification/NewNotification';
import ForumLayout from './layouts/ForumLayout';
import PlayerManagement from './pages/PlayerManagement/PlayerManagement';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword';
import PostManagement from './pages/PostManagement/PostManagement';
import UpdatePost from './pages/NewPost/UpdatePost';
import CategoryManagement from './pages/CategoryManagement/CategoryManagement';
import EditCategory from './pages/CategoryManagement/EditCategory';
import AddCategory from './pages/CategoryManagement/AddCategory';
import PlayerInfo from './pages/PlayerInfo/PlayerInfo';

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
                    <Route path="forget-password" element={<ForgetPassword />} />
                    <Route path="terms" element={<Terms />} />

                    <Route element={<ForumLayout />}>
                        <Route path="post/:postId" element={<PostDetail />} />
                    </Route>

                    <Route element={<RequireAuth />}>
                        <Route element={<ForumLayout />}>
                            <Route path="post/new" element={<NewPost />} />
                            <Route path="notification" element={<Notification />} />
                            <Route path="following-post" element={<FollowingPosts />} />
                            <Route path="player/info" element={<PlayerInfo />} />
                        </Route>
                    </Route>

                    <Route path="admin" element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.SuperAdmin]} />}>
                        <Route element={<ForumLayout />}>
                            <Route path="notification/new" element={<NewNotification />} />
                            <Route path="player" element={<PlayerManagement />} />

                            <Route path="post" element={<PostManagement />} />
                            <Route path="post/:postId" element={<UpdatePost />} />

                            <Route path="category" element={<CategoryManagement />} />
                            <Route path="category/new" element={<AddCategory />} />
                            <Route path="category/:categoryId" element={<EditCategory />} />
                        </Route>
                    </Route>

                    <Route path="/verify" element={<ConfirmEmail />} />

                    <Route path="access-denied" element={<AccessDenied />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
