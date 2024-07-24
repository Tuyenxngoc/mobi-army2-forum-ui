import { Link, Outlet } from 'react-router-dom';
import PlayerActions from '~/components/PlayerActions/PlayerActions';

import Style from './ForumLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function ForumLayout() {
    return (
        <div className="box-container">
            <PlayerActions />

            <div className={cx('header')}>
                <Link to="/forum">Quay lại</Link>
            </div>

            <Outlet />
        </div>
    );
}

export default ForumLayout;
