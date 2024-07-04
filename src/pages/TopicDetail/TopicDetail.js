import { Link, useParams } from 'react-router-dom';
import Style from './TopicDetail.module.scss';
import classNames from 'classnames/bind';

import imm from '~/assets/images/new.gif';

const cx = classNames.bind(Style);

function TopicDetail() {
    const { id } = useParams();
    return (
        <main className="box-container">
            <div>
                <Link to="/forum">Quay lại</Link>
            </div>

            <div className={cx('ads')}>
                <img src={imm} alt="new" />
                <Link to="/">Avatar Bùm</Link>
                <img src={imm} alt="new" />
            </div>
            <div></div>
            <div></div>
        </main>
    );
}

export default TopicDetail;
