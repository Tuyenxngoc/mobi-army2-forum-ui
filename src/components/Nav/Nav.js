import { useEffect, useState } from 'react';
import Style from './Nav.module.scss';
import classNames from 'classnames/bind';
import { Link, useLocation } from 'react-router-dom';

const cx = classNames.bind(Style);

function Nav() {
    const [activeNavItem, setActiveNavItem] = useState(0);

    const location = useLocation();

    useEffect(() => {
        // Xác định thẻ được kích hoạt dựa trên đường dẫn hiện tại
        const path = location.pathname;
        if (path === '/') {
            setActiveNavItem(0);
        } else if (path.startsWith('/forum')) {
            setActiveNavItem(2);
        } else if (path === '/info') {
            setActiveNavItem(1);
        } else {
            setActiveNavItem(0);
        }
    }, [location.pathname]);

    const handleNavItemClick = (index) => {
        setActiveNavItem(index);
    };

    return (
        <nav>
            <div className="row g-0">
                <div className="col-4">
                    <div className={cx('navItem', { active: activeNavItem === 0 })} >
                        <Link className={cx('navLink')} to='/' onClick={() => handleNavItemClick(0)}>Trang chủ</Link>
                    </div>
                </div>
                <div className="col-4">
                    <div className={cx('navItem', { active: activeNavItem === 1 })} >
                        <Link className={cx('navLink')} to='/info' onClick={() => handleNavItemClick(1)}>Giới thiệu</Link>
                    </div>
                </div>
                <div className="col-4">
                    <div className={cx('navItem', 'lastNavItem', { active: activeNavItem === 2 })} >
                        <Link className={cx('navLink')} to='/forum' onClick={() => handleNavItemClick(2)}>Diễn đàn</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Nav;