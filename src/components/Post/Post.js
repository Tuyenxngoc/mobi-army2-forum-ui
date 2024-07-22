import { Link } from 'react-router-dom';

import Style from './Post.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets';

const cx = classNames.bind(Style);
function Post({ data }) {
    return (
        <div className={cx('post-wrapper', { admin: data.priority })}>
            <div className={cx('avatar-container')}>
                <img src={images.plGif} alt="avatar" />
            </div>
            <div className={cx('post-details')}>
                <div className={cx('post-title')}>
                    <Link to={`/post/${data.id}`}>
                        {data.locked && <img src={images.lock} alt="lock" />}
                        {data.title}
                    </Link>
                </div>
                <div className={cx('post-metadata')}>
                    bởi
                    <span> {data.author}</span>
                    <span> Trả lời: {data.comments}</span>
                    <span> - Xem: {data.views}</span>
                    {data.favorites > 0 && <span className="text-danger"> ♥{data.favorites}</span>}
                </div>
            </div>
        </div>
    );
}

export default Post;
