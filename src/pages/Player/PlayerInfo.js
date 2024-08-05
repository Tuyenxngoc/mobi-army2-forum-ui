import { Badge, Button, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '~/common/contans';
import useAuth from '~/hooks/useAuth';

import Style from './PlayerInfo.module.scss';
import classNames from 'classnames/bind';
import { getPlayerInfo, toggleEquipmentChestLock, toggleInvitationLock } from '~/services/playerService';

const cx = classNames.bind(Style);

function PlayerInfo() {
    const { player } = useAuth();

    const navigate = useNavigate();

    const [playerProfile, setPlayerProfile] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

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
        const fetchPlayerInfo = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getPlayerInfo();
                setPlayerProfile(response.data.data);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayerInfo();
    }, []);

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

        return (
            <div className="p-2">
                <h3 className="forum-border-bottom text-primary">Hồ Sơ Của Tôi</h3>

                <div className="text-center">
                    <img width={100} src={BASE_URL + player.avatar} alt="avt" />
                </div>
                <ol className={cx('list')}>
                    <li>ID: {playerProfile.id}</li>
                    <li>Online: {playerProfile.online ? <Badge status="success" /> : <Badge status="default" />}</li>
                    <li>Xu: {playerProfile.xu}</li>
                    <li>X2 EXP Time: {playerProfile.x2XpTime || 'Không có'}</li>
                    <li>
                        Biệt đội:{' '}
                        {player.clan ? (
                            <>
                                <Link to={`/clan/${player.clan.id}`}>{player.clan.name}</Link>
                                [<img src={BASE_URL + player.clan.icon} alt="icon" />]
                            </>
                        ) : (
                            'Chưa tham gia biệt đội'
                        )}
                    </li>
                    <li>Lượng: {playerProfile.luong}</li>
                    <li>Email: {playerProfile.email}</li>
                    <li>Số điện thoại: {playerProfile.phoneNumber}</li>
                </ol>

                <b>Nhân Vật</b>
                <div className="table-responsive">
                    <table className="table align-middle table-hover">
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
                            {playerProfile.characters.map((character, index) => (
                                <tr key={index}>
                                    <th scope="row">
                                        <img src={BASE_URL + character.avatar} alt="avt" />
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

                <div className="forum-border-bottom text-primary">Chức Năng Tài Khoản</div>
                <ul>
                    <li className="py-2">
                        <Button onClick={() => handleButtonNavigation('/change-username')}>Đổi tên tài khoản</Button>
                    </li>
                    <li className="py-2">
                        <Button onClick={() => handleButtonNavigation('/change-password')}>Đổi mật khẩu</Button>
                    </li>
                    <li className="py-2">
                        <Button onClick={() => handleButtonNavigation('/inventory')}>Rương đồ</Button>
                    </li>
                    <li className="py-2">
                        <Button onClick={() => handleButtonNavigation('/upgrade-points')}>Cộng điểm nâng cấp</Button>
                    </li>
                </ul>

                <div className="forum-border-bottom text-primary mt-2">Chức Năng Đặc Biệt</div>
                <ul>
                    <li className="py-2">
                        <Button type="primary" danger={playerProfile.chestLocked} onClick={handleToggleChestLock}>
                            {playerProfile.chestLocked ? 'Mở rương đồ' : 'Khóa rương đồ'}
                        </Button>
                        <div className="form-text">Mở Rương Đồ: Để Bán Đồ Trong Game</div>
                    </li>
                    <li className="py-2">
                        <Button
                            type="primary"
                            danger={playerProfile.invitationLocked}
                            onClick={handleToggleInvitationLock}
                        >
                            {playerProfile.invitationLocked ? 'Mở tìm bạn' : 'Khóa tìm bạn'}
                        </Button>
                        <div className="form-text">Mở Tìm Bạn Chơi: Cho Phép Mọi Người Mời Chơi</div>
                    </li>
                </ul>

                <div className="forum-border-bottom text-primary mt-2">Chức Năng Khác</div>
                <ul>
                    <li className="py-2">
                        <Button onClick={() => handleButtonNavigation('/clan')}>Biệt đội</Button>
                        <div className="form-text">Biệt Đội - Hãy cùng nhau chung tay làm nên 1 tên tuổi</div>
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <div className="box-container">
            {contextHolder}

            <div className="forum-header">
                <Link to="/forum">Quay lại</Link>
            </div>

            {renderContent()}
        </div>
    );
}

export default PlayerInfo;
