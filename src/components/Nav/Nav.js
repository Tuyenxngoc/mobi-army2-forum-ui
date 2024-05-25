import { useEffect, useState } from 'react';
import Style from './Nav.module.scss';
import classNames from 'classnames/bind';
import { NavLink, useLocation } from 'react-router-dom';

const cx = classNames.bind(Style);

const navItems = [
    { path: '/', text: 'Trang Chủ' },
    { path: '/info', text: 'Giới Thiệu' },
    { path: '/forum', text: 'Diễn Đàn' },
];

function Nav() {
    const location = useLocation();
    const [activeNavItem, setActiveNavItem] = useState(0);

    useEffect(() => {
        const currentPath = location.pathname;
        let index = -1;
        for (let i = navItems.length - 1; i >= 0; i--) {
            if (currentPath.startsWith(navItems[i].path)) {
                index = i;
                break;
            }
        }
        setActiveNavItem(index !== -1 ? index : 0);
    }, [location.pathname]);

    return (
        <nav>
            <ul className={cx('navList')}>
                {navItems.map((item, index) => (
                    <li key={index} className={cx('navItem', { active: activeNavItem === index })}>
                        <NavLink className={cx('navLink')} to={item.path} onClick={() => setActiveNavItem(index)}>
                            {item.text}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Nav;
