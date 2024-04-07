import Style from './Notification.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

const Notification = ({ title, content, date, isLast }) => {
    return (
        <div className={cx('textContent', isLast && "m-0")}>
            <div className={cx('title')}>
                <h4>{title}</h4>
            </div>
            <div className={cx('content')}>
                {content}
            </div>
            <div className={cx('date')}>{date}</div>
        </div>
    );
};

export default Notification;
