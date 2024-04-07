import Style from './Header.module.scss';
import classNames from 'classnames/bind';


import icon12 from '../../assets/images/icon12.png';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';

const cx = classNames.bind(Style);

function Header() {
    return (
        <header>
            <div className={cx('info')}>
                <img src={icon12} alt='12' />
                <span>Dành cho người chơi trên 12 tuổi. Chơi quá 180 phút mỗi ngày sẽ hại sức khỏe.</span>
            </div>

            <div className={cx('logoContainer')}>
                <Link className={cx('logoLink')} to='/'>
                    <img src={logo} alt='logo' />
                </Link>
            </div>
        </header>
    );
}

export default Header;