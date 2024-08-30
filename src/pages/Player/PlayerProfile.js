import { Badge, Button, message, Spin, Space } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '~/common/commonConstants';
import useAuth from '~/hooks/useAuth';

import { getPlayerById, toggleEquipmentChestLock, toggleInvitationLock } from '~/services/playerService';
import { checkIdIsNumber } from '~/utils/helper';
import NumberFormatter from '~/components/NumberFormatter/NumberFormatter';
import { ROLE_COLORS, ROLE_LABELS, ROLES } from '~/common/roleConstants';

function PlayerProfile() {
    const { playerId } = useParams();
    const navigate = useNavigate();

    const [playerProfile, setPlayerProfile] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();
    const { player } = useAuth();

    const isCurrentPlayer = useMemo(() => player.id === Number.parseInt(playerId, 10), [player.id, playerId]);

    const handleButtonNavigation = (path) => {
        navigate(path);
    };

    const handleToggleChestLock = async () => {
        try {
            const response = await toggleEquipmentChestLock();
            const { message: ms, data } = response.data.data;
            setPlayerProfile((prevProfile) => ({
                ...prevProfile,
                chestLocked: data,
            }));

            messageApi.success(ms);
        } catch (error) {
            messageApi.error('Không thể cập nhật trạng thái rương đồ: ' + error.message);
        }
    };

    const handleToggleInvitationLock = async () => {
        try {
            const response = await toggleInvitationLock();
            const { message: ms, data } = response.data.data;
            setPlayerProfile((prevProfile) => ({
                ...prevProfile,
                invitationLocked: data,
            }));

            messageApi.success(ms);
        } catch (error) {
            messageApi.error('Không thể cập nhật trạng thái tìm bạn: ' + error.message);
        }
    };

    useEffect(() => {
        if (!checkIdIsNumber(playerId)) {
            navigate('/forum');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchPlayerInfo = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                if (!checkIdIsNumber(playerId)) {
                    return;
                }

                const response = await getPlayerById(playerId);
                setPlayerProfile(response.data.data);
            } catch (error) {
                setErrorMessage(error.response?.data?.message || error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayerInfo();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerId]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="alert alert-primary m-2 p-2" role="alert">
                    Loading... <Spin />
                </div>
            );
        }

        if (errorMessage) {
            return (
                <div className="alert alert-danger m-2 p-2" role="alert">
                    Lỗi: {errorMessage}
                </div>
            );
        }

        const {
            id,
            avatar,
            username,
            roleName,
            online,
            xu,
            luong,
            cup,
            x2XpTime,
            clan,
            email,
            phoneNumber,
            characters,
        } = playerProfile;

        const avatarUrl = BASE_URL + avatar;
        const roleColor = ROLE_COLORS[roleName] || 'black';
        const roleLabel = roleName !== ROLES.User ? ` - ${ROLE_LABELS[roleName]}` : '';

        return (
            <div className="p-2">
                <h4 className="title">{isCurrentPlayer ? 'Hồ Sơ Của Tôi' : 'Thông tin tài khoản'}</h4>

                <div className="text-center">
                    <img width={200} src={avatarUrl} className="pixel-art" alt="avt" />
                </div>

                <ul className="mb-2 ps-3" style={{ listStyle: 'disc' }}>
                    <li>ID: {id}</li>
                    <li>
                        Tên tài khoản:&nbsp;
                        <span style={{ color: roleColor }}>
                            {username}
                            {roleLabel}
                        </span>
                    </li>
                    <li>Online: {online ? <Badge status="success" /> : <Badge status="default" />}</li>
                    <li>
                        Xu: <NumberFormatter number={xu} />
                    </li>
                    <li>
                        Lượng: <NumberFormatter number={luong} />
                    </li>
                    <li>
                        Danh dự: <NumberFormatter number={cup} />
                    </li>
                    {x2XpTime && <li>Thời gian nhân đôi xp: {x2XpTime}</li>}
                    <li>
                        Biệt đội:&nbsp;
                        {clan ? (
                            <>
                                <Link to={`/clan/${clan.id}`}>{clan.name}</Link>
                                [<img src={BASE_URL + clan.icon} className="pixel-art" alt="icon" />]
                            </>
                        ) : (
                            'Chưa tham gia biệt đội'
                        )}
                    </li>
                    {email && <li>Email: {email}</li>}
                    {phoneNumber && <li>Số điện thoại: {phoneNumber}</li>}
                </ul>

                <b>Nhân Vật</b>
                <div className="table-responsive">
                    <table className="table table-hover align-middle table-hover mb-0">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Tên</th>
                                <th scope="col">Level</th>
                                <th scope="col">Xp</th>
                                <th scope="col">Điểm đã cộng</th>
                                <th scope="col">Điểm còn lại</th>
                            </tr>
                        </thead>
                        <tbody>
                            {characters.map((character, index) => (
                                <tr key={index}>
                                    <th scope="row">
                                        <img src={BASE_URL + character.avatar} className="pixel-art" alt="avt" />
                                    </th>
                                    <td>{character.name}</td>
                                    <td>{character.level}</td>
                                    <td>{character.xp}</td>
                                    <td>{JSON.stringify(character.additionalPoints)}</td>
                                    <td>{character.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isCurrentPlayer ? (
                    <>
                        <h4 className="title my-2">Chức Năng Tài Khoản</h4>
                        <Space direction="vertical">
                            <Button onClick={() => handleButtonNavigation('/change-username')}>
                                Đổi tên tài khoản
                            </Button>
                            <Button onClick={() => handleButtonNavigation('/change-password')}>Đổi mật khẩu</Button>
                            <Button onClick={() => handleButtonNavigation('/inventory')}>Rương đồ</Button>
                            <Button onClick={() => handleButtonNavigation('/upgrade-points')}>
                                Cộng điểm nâng cấp
                            </Button>
                        </Space>

                        <h4 className="title my-2">Chức Năng Đặc Biệt</h4>
                        <Space direction="vertical">
                            <div>
                                <Button
                                    type="primary"
                                    danger={playerProfile.chestLocked}
                                    onClick={handleToggleChestLock}
                                >
                                    {playerProfile.chestLocked ? 'Mở rương đồ' : 'Khóa rương đồ'}
                                </Button>
                                <div className="form-text">Mở Rương Đồ: Để Bán Đồ Trong Game</div>
                            </div>
                            <div>
                                <Button
                                    type="primary"
                                    danger={playerProfile.invitationLocked}
                                    onClick={handleToggleInvitationLock}
                                >
                                    {playerProfile.invitationLocked ? 'Mở tìm bạn' : 'Khóa tìm bạn'}
                                </Button>
                                <div className="form-text">Mở Tìm Bạn Chơi: Cho Phép Mọi Người Mời Chơi</div>
                            </div>
                        </Space>

                        <h4 className="title my-2">Chức Năng Khác</h4>
                        <Space direction="vertical">
                            <div>
                                <Button onClick={() => handleButtonNavigation('/clan')}>Biệt đội</Button>
                                <div className="form-text">Biệt Đội - Hãy cùng nhau chung tay làm nên 1 tên tuổi</div>
                            </div>

                            <div>
                                <Button onClick={() => handleButtonNavigation(`/player/${player.id}/post`)}>
                                    Bài viết của bạn
                                </Button>
                                <div className="form-text">Xem danh sách bài viết đã tạo</div>
                            </div>
                        </Space>
                    </>
                ) : (
                    <>
                        <h4 className="title my-2">Chức Năng Khác</h4>
                        <Space direction="vertical">
                            <div>
                                <Button onClick={() => handleButtonNavigation('/clan')}>Biệt đội</Button>
                                <div className="form-text">Biệt Đội - Hãy cùng nhau chung tay làm nên 1 tên tuổi</div>
                            </div>

                            <div>
                                <Button onClick={() => handleButtonNavigation(`/player/${playerProfile.id}/post`)}>
                                    Bài viết
                                </Button>
                                <div className="form-text">Xem danh sách bài viết đã tạo</div>
                            </div>
                        </Space>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="box-container">
            {contextHolder}

            <div className="header">
                <Link to="/forum">Quay lại</Link>
            </div>

            {renderContent()}
        </div>
    );
}

export default PlayerProfile;
