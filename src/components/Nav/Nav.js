import { useState } from 'react';
import Style from './Nav.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(Style);

function Nav() {
    const [activeNavItem, setActiveNavItem] = useState(0);

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