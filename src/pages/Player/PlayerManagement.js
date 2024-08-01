import { Link } from 'react-router-dom';

function PlayerManagement() {
    return (
        <div className="box-container">
            <div className="forum-header">
                <Link to="/forum">Quay lại</Link>
            </div>

            <h3 className="p-2 pb-0"> Quản lý người chơi </h3>
        </div>
    );
}

export default PlayerManagement;
