import { Link, useNavigate } from 'react-router-dom';

import useAuth from '~/hooks/useAuth';
import images from '~/assets';

import { Button } from 'antd';

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
                <ul className="nav">
                    <li className="me-2">
                        <Link to="/player/info">Bản thân</Link>
                    </li>
                    <li className="me-2">
                        <Link to="/notification">Thông báo</Link>
                    </li>
                    <li>
                        <Link to="/">Tin nhắn</Link>
                    </li>

                    <li className="ms-auto">
                        <div className={cx('player-info')}>
                            <div className="me-2">
                                Xin chào <b>{player.username}</b>
                            </div>
                            <Button size="small" onClick={handleLogoutClick}>
                                Đăng xuất
                            </Button>
                        </div>
                    </li>
                </ul>
            ) : (
                <>
                    <Button size="small" type="primary" onClick={handleLoginClick}>
                        Đăng nhập
                    </Button>
                    <Button size="small" type="primary" onClick={handleRegisterClick}>
                        Đăng ký
                    </Button>
                </>
            )}

            <div className="p-2">
                <Link to="/">
                    <img src={images.army} alt="nap the" />
                </Link>
            </div>
        </div>
    );
}

export default PlayerActions;
