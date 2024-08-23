import { Badge } from 'antd';
import { Link } from 'react-router-dom';
import { ROLE_COLORS, ROLES, ROLE_LABELS } from '~/common/roleConstants';

function Player({ data }) {
    const { id, username, roleName, online } = data;

    const roleColor = ROLE_COLORS[roleName] || 'black';

    return (
        <>
            {online ? <Badge status="success" /> : <Badge status="default" />}
            <Link to={`/player/${id}`} className="fw-bold ms-1" style={{ color: roleColor }}>
                {username} {roleName !== ROLES.User && ` - ${ROLE_LABELS[roleName]}`}
            </Link>
        </>
    );
}

export default Player;
