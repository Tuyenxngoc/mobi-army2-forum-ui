import { Outlet } from 'react-router-dom';

import PlayerActions from '~/components/PlayerActions/PlayerActions';

function ForumLayout() {
    return (
        <div className="custom-bg-primary">
            <PlayerActions />
            <Outlet />
        </div>
    );
}

export default ForumLayout;
