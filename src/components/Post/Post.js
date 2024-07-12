import { Link } from 'react-router-dom';

import Style from './Post.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);
function Post({ data }) {
    return (
        <div className={cx('post-wrapper')}>
            <div className={cx('avatar-container')}>
                <img src={data.author} alt="avatar" />
            </div>
            <div className={cx('post-details')}>
                <div className={cx('post-title')}>
                    <Link to={`/post/${data.id}`}>{data.title}</Link>
                </div>
                <div className={cx('post-metadata')}>
                    bởi
                    <span> {data.author}</span>
                    <span> Trả lời: {data.comments}</span>
                    <span> - Xem: {data.views}</span>
                </div>
            </div>
        </div>
    );
}

export default Post;
