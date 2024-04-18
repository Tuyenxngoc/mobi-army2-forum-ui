import Style from './Pagination.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function Pagination() {
    return (
        <div className={cx('wrapper')}>
            <button className={cx('btn')}>1</button>
            <button className={cx('btn')}>2</button>
        </div>
    );
}

export default Pagination;