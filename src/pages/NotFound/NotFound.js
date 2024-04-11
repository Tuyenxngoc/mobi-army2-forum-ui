import { Link } from 'react-router-dom';
import Style from './NotFound.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);
function NotFound() {
    return (
        <main className={cx('box-container', 'wrapper')}>
            <div className={cx('title')}>Trang bạn tìm kiếm không tồn tại.</div>
            <Link to="/">Trở về trang chủ</Link>
        </main>
    );
}

export default NotFound;