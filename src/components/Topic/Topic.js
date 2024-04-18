import Style from './Topic.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);
function Topic({ data }) {

    return (
        <div className={cx('wrapper')}>
            <div>
                <img src={data.user.avatar} alt="avatar" />
            </div>
            <div>
                <div>{data.title}</div>
                <div>
                    <span>bởi {data.user.username}</span>
                    <span> Trả lời: {data.comment}</span>
                    <span> - Xem: {data.view}</span>
                </div>
            </div>
        </div>
    );
}

export default Topic;