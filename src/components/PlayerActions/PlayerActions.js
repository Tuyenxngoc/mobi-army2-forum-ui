import { Link, useNavigate } from 'react-router-dom';

import useAuth from '~/hooks/useAuth';
import images from '~/assets';

import { ROLES } from '~/common/contans';
import { Button } from 'antd';

const allowedRoles = {
    [ROLES.SuperAdmin]: true,
    [ROLES.Admin]: true,
};

function PlayerActions() {
    const navigate = useNavigate();
    const { isAuthenticated, player, logout } = useAuth();

    const hasRequiredRole = allowedRoles[player.roleName];

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        logout();
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="text-center p-2">
            {isAuthenticated ? (
                <>
                    <div>Xin chào {player.username}</div>
                    <button onClick={handleLogoutClick}>Đăng xuất</button>

                    <div>
                        <Link to={'/post/new'}>Bài viết mới</Link>
                    </div>

                    <div>
                        <Link to={'/notification'}>Thông báo</Link>
                    </div>

                    <div>
                        <Link to={'/following-post'}>Theo giõi</Link>
                    </div>

                    {hasRequiredRole && (
                        <>
                            <div>
                                <Link to={'/admin/notification/new'}>Thêm thông báo</Link>
                            </div>
                            <div>
                                <Link to={'/admin/player'}>Quản lý thành viên</Link>
                            </div>
                            <div>
                                <Link to={'/admin/post'}>Quản lý bài viết</Link>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <Button type="primary" onClick={handleLoginClick}>
                        Đăng nhập
                    </Button>
                    <Button type="primary" onClick={handleRegisterClick}>
                        Đăng ký
                    </Button>
                </>
            )}

            <div>
                <Link to="/">
                    <img src={images.army} alt="nap the" />
                </Link>
            </div>
        </div>
    );
}

export default PlayerActions;
