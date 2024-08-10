import { Link, useNavigate } from 'react-router-dom';

import useAuth from '~/hooks/useAuth';
import images from '~/assets';

import { Button } from 'antd';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Style from './PlayerActions.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

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
        <div className={cx('content')}>
            {isAuthenticated ? (
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to={`/player/${player.id}`}>
                            Bản thân
                        </Link>

                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>

                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/notification">
                                        Thông báo
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">
                                        Tin nhắn
                                    </Link>
                                </li>
                            </ul>

                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item dropdown">
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Xin chào <b>{player.username}</b>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li>
                                            <button className="dropdown-item" onClick={handleLogoutClick}>
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            ) : (
                <div className="p-2">
                    <Button size="small" className="me-2" type="primary" onClick={handleLoginClick}>
                        Đăng nhập
                    </Button>
                    <Button size="small" type="primary" onClick={handleRegisterClick}>
                        Đăng ký
                    </Button>
                </div>
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
