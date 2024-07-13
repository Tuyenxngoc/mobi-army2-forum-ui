import images from '~/assets';
import DateFormatter from '../DateFormatter/DateFormatter';
import Style from './Comment.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function Comment({ data }) {
    return (
        <div className={cx('comment-item')}>
            <div className="text-center">
                <img src={images.plGif} alt="status" />
                <div>Bài: 1</div>
            </div>

            <div className={cx('comment-body')}>
                <div className={cx('comment-header')}>
                    <div>
                        <img src={images.online} alt="status" />
                        <span className={cx('username')}>tuyenngoc</span>
                    </div>

                    <div>
                        <span className={cx('time')}>
                            <DateFormatter datetime={data.lastModifiedDate} />
                        </span>
                    </div>
                </div>

                <div className={cx('comment-content')}>
                    {data.content}
                    <br />
                    <br />
                </div>
            </div>
        </div>
    );
}

export default Comment;
