import { Link } from 'react-router-dom';
import Style from './Topic.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);
function Topic({ data }) {

    return (
        <div className={cx('topic-wrapper')}>
            <div className={cx('avatar-container')}>
                <img src={data.user.avatar} alt="avatar" />
            </div>
            <div className={cx('topic-details')}>
                <div className={cx('topic-title')}>
                    <Link to='topic/1'>{data.title}</Link>
                </div>
                <div className={cx('topic-metadata')}>
                    bởi
                    <span> {data.user.username}</span>
                    <span> Trả lời: {data.comment}</span>
                    <span> - Xem: {data.view}</span>
                </div>
            </div>
        </div>
    );
}

export default Topic;