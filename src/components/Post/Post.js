import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import Style from './Post.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets';
import { BASE_URL } from '~/common/commonConstants';

const cx = classNames.bind(Style);

function Post({ data }) {
    return (
        <div className={cx('post-wrapper', { admin: data.priority })}>
            <div>
                <img src={BASE_URL + data.player.avatar} className="pixel-art" alt="avt" />
            </div>
            <div>
                <div>
                    <Link to={`/post/${data.id}`}>
                        {data.locked && <img src={images.lock} alt="lock" />}
                        {data.title}
                    </Link>
                </div>
                <div className={cx('post-metadata')}>
                    bởi
                    <span> {data.player.username}</span>
                    <span> Trả lời: {data.comments}</span>
                    <span> - Xem: {data.views}</span>
                    {data.favorites > 0 && <span className="text-danger"> ♥{data.favorites}</span>}
                </div>
            </div>
        </div>
    );
}

Post.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        locked: PropTypes.bool,
        priority: PropTypes.number,
        player: PropTypes.shape({
            avatar: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
        }).isRequired,
        comments: PropTypes.number.isRequired,
        views: PropTypes.number.isRequired,
        favorites: PropTypes.number,
    }).isRequired,
};

export default Post;
