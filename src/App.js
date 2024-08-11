import { Routes, Route, BrowserRouter } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Info from './pages/Info/Info';
import Forum from './pages/Forum/Forum';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';
import NewPost from './pages/Post/NewPost';
import PostDetail from './pages/Post/PostDetail';
import RequireAuth from './utils/RequireAuth';
import { ROLES } from './common/contans';
import AccessDenied from './pages/AccessDenied/AccessDenied';
import Terms from './pages/Terms/Terms';
import ConfirmEmail from './pages/ConfirmEmail/ConfirmEmail';
import Notification from './pages/Notification/Notification';
import FollowingPosts from './pages/Post/FollowingPosts';
import NewNotification from './pages/Notification/NewNotification';
import PlayerManagement from './pages/Player/PlayerManagement';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword';
import PostManagement from './pages/Post/PostManagement';
import UpdatePost from './pages/Post/UpdatePost';
import CategoryManagement from './pages/Category/CategoryManagement';
import EditCategory from './pages/Category/EditCategory';
import AddCategory from './pages/Category/AddCategory';
import PlayerProfile from './pages/Player/PlayerProfile';
import Clan from './pages/Clan/Clan';
import CreateClan from './pages/Clan/CreateClan';
import ClanInfo from './pages/Clan/ClanInfo';
import ForumLayout from './layouts/ForumLayout';
import ChangeUserName from './pages/Player/ChangeUserName';
import ChangePassword from './pages/Player/ChangePassword';
import Inventory from './pages/Player/Inventory';
import UpdragePoinst from './pages/Player/UpdragePoinst';
import UpdateClan from './pages/Clan/UpdateClan';
import ClanMembers from './pages/Clan/ClanMembers';
import ApproveClanMembers from './pages/Clan/ApproveClanMembers';
import PlayerPost from './pages/Player/PlayerPost';
import PromotePlayer from './pages/Player/PromotePlayer';
import PlayerHistory from './pages/Player/PlayerHistory';
import LockPlayerAccount from './pages/Player/LockPlayerAccount';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultLayout />}>
                    <Route index element={<Home />} />
                    <Route path="info" element={<Info />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forget-password" element={<ForgetPassword />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="/verify" element={<ConfirmEmail />} />

                    <Route element={<ForumLayout />}>
                        <Route path="forum" element={<Forum />} />
                        <Route path="post/:postId" element={<PostDetail />} />

                        <Route element={<RequireAuth />}>
                            <Route path="player/:playerId/post" element={<PlayerPost />} />

                            <Route path="post/new" element={<NewPost />} />
                            <Route path="notification" element={<Notification />} />
                            <Route path="following-post" element={<FollowingPosts />} />
                            <Route path="player/:playerId" element={<PlayerProfile />} />
                            <Route path="clan" element={<Clan />} />
                            <Route path="clan/:clanId" element={<ClanInfo />} />
                            <Route path="clan/new" element={<CreateClan />} />
                            <Route path="clan/:clanId/update" element={<UpdateClan />} />
                            <Route path="clan/:clanId/members" element={<ClanMembers />} />
                            <Route path="clan/:clanId/approve" element={<ApproveClanMembers />} />
                            <Route path="change-username" element={<ChangeUserName />} />
                            <Route path="change-password" element={<ChangePassword />} />
                            <Route path="inventory" element={<Inventory />} />
                            <Route path="upgrade-points" element={<UpdragePoinst />} />
                        </Route>

                        <Route path="admin" element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.SuperAdmin]} />}>
                            <Route path="notification/new" element={<NewNotification />} />
                            <Route path="player" element={<PlayerManagement />} />
                            <Route path="post" element={<PostManagement />} />
                            <Route path="post/:postId" element={<UpdatePost />} />
                            <Route path="category" element={<CategoryManagement />} />
                            <Route path="category/new" element={<AddCategory />} />
                            <Route path="category/:categoryId" element={<EditCategory />} />

                            <Route path="player/:playerId/promote" element={<PromotePlayer />} />
                            <Route path="player/:playerId/history" element={<PlayerHistory />} />
                            <Route path="player/:playerId/lock-account" element={<LockPlayerAccount />} />
                        </Route>
                    </Route>

                    <Route path="access-denied" element={<AccessDenied />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
