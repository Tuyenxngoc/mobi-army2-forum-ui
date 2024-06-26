import Style from './Notification.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

const Notification = ({ title, content, date, isLast = false }) => {
    return (
        <div className={cx('box-container', 'textContent', isLast && 'm-0')}>
            {title && (
                <div className={cx('title')}>
                    <h4>{title}</h4>
                </div>
            )}
            <div className={cx('content')}>{content}</div>
            {date && <div className={cx('date')}>{date}</div>}
        </div>
    );
};

export default Notification;
