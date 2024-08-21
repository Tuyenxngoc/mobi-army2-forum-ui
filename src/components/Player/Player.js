import { Badge } from 'antd';
import { Link } from 'react-router-dom';
import { ROLE_COLORS, ROLES, ROLES_NAME } from '~/common/contans';

function Player({ data }) {
    const { id, username, roleName, online } = data;

    const roleColor = ROLE_COLORS[roleName] || 'black';

    return (
        <>
            {online ? <Badge status="success" /> : <Badge status="default" />}
            <Link to={`/player/${id}`} className="fw-bold" style={{ color: roleColor }}>
                {username} {roleName !== ROLES.User && ` - ${ROLES_NAME[roleName]}`}
            </Link>
        </>
    );
}

export default Player;
