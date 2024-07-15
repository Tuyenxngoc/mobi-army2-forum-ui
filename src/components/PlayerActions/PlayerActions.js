import { Link, useNavigate } from 'react-router-dom';

import useAuth from '~/hooks/useAuth';
import images from '~/assets';

import Style from './PlayerActions.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function PlayerActions() {
    const navigate = useNavigate();
    const { isAuthenticated, player, logout } = useAuth();

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
                </>
            ) : (
                <>
                    <button onClick={handleLoginClick}>Đăng nhập</button>
                    <button onClick={handleRegisterClick}>Đăng ký</button>
                </>
            )}
            <div>
                <a href="/">
                    <img src={images.army} alt="nap the" />
                </a>
            </div>

            <div>
                <ul>
                    <li>
                        <Link to={'/post/new'}>Bài viết mới</Link>
                    </li>
                    <li>
                        <Link to={'/post/review'}>Duyệt bài viết</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default PlayerActions;
