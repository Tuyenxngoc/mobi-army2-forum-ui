import { Link } from 'react-router-dom';
import Style from './Footer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function Footer() {
    return (
        <footer className={cx('copyright')}>
            <h2 className={cx('name')}>Mobi Army 2</h2>
            <div className={cx('des')}>Bản Quyền thuộc về @TeaMobi - 2022</div>
            <div className={cx('link')}>
                <Link to="/terms">Điều Khoản Sử Dụng</Link>
            </div>
        </footer>
    );
}

export default Footer;
