import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '~/hooks/useAuth';
import images from '~/assets';

import { ROLES } from '~/common/contans';
import { checkUserHasRequiredRole } from '~/utils/helper';

const allowedRoles = [ROLES.Admin, ROLES.SuperAdmin];

function PlayerActions() {
    const navigate = useNavigate();
    const { isAuthenticated, player, logout } = useAuth();

    const hasRequiredRole = useMemo(() => checkUserHasRequiredRole(player.roleName, allowedRoles), [player.roleName]);

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
                                <Link to={'/post/review'}>Duyệt bài viết</Link>
                            </div>
                            <div>
                                <Link to={'/notification/new'}>Thêm thông báo</Link>
                            </div>
                            <div>
                                <Link to={'/player'}>Quản lý thành viên</Link>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <button onClick={handleLoginClick}>Đăng nhập</button>
                    <button onClick={handleRegisterClick}>Đăng ký</button>
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
