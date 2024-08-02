import { Badge, Button, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '~/common/contans';
import useAuth from '~/hooks/useAuth';
import { getPlayerInfo } from '~/services/playerNotificationService';

import Style from './PlayerInfo.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function PlayerInfo() {
    const { player } = useAuth();

    const [playerProfile, setPlayerProfile] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

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
                <h3 className="forum-border-bottom">Hồ Sơ Của Tôi</h3>

                <div className="text-center">
                    <img width={100} src={BASE_URL + player.avatar} alt="avt" />
                </div>
                <ol className={cx('list')}>
                    <li>
                        ID: <span className="text-black">{playerProfile.id}</span>
                    </li>
                    <li>Online: {playerProfile.online ? <Badge status="success" /> : <Badge status="default" />}</li>
                    <li>
                        Xu: <span className="text-black">{playerProfile.xu}</span>
                    </li>
                    <li>
                        X2 EXP Time: <span className="text-black">{playerProfile.x2XpTime || 'Không có'}</span>
                    </li>
                    <li>
                        Biệt đội:{' '}
                        {player.clan ? (
                            <>
                                <Link to={`/clan/${player.clan.id}`}>{player.clan.name}</Link>
                                [<img src={BASE_URL + player.clan.icon} alt="icon" />]
                            </>
                        ) : (
                            <span className="text-black">Chưa tham gia biệt đội</span>
                        )}
                    </li>
                    <li>
                        Lượng: <span className="text-black">{playerProfile.luong}</span>
                    </li>
                    <li>
                        Email: <span className="text-black">{playerProfile.email}</span>
                    </li>
                    <li>
                        Số điện thoại: <span className="text-black">{playerProfile.phoneNumber}</span>
                    </li>
                </ol>

                <b>Nhân Vật</b>
                <table className="table align-middle">
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

                <h4 className="forum-border-bottom mb-2">Chức Năng Tài Khoản</h4>
                <div className="button-group">
                    <Button>Đổi tên tài khoản</Button>
                    <Button>Đổi mật khẩu</Button>
                    <Button>Rương đồ</Button>
                    <Button>Cộng điểm nâng cấp</Button>
                </div>

                <h4 className="forum-border-bottom mb-2">Chức Năng Đặc Biệt</h4>
                <div className="button-group">
                    <Button>Mở rương đồ</Button>
                    <small>Mở Rương Đồ: Để Bán Đồ Trong Game</small>
                </div>
                <div className="button-group">
                    <Button>Mở tìm bạn</Button>
                    <small>Mở Tìm Bạn Chơi: Cho Phép Mọi Người Mời Chơi</small>
                </div>

                <h4 className="forum-border-bottom mb-2">Chức Năng Khác</h4>
                <div className="button-group">
                    <Button>Biệt đội</Button>
                    <small>Biệt Đội - Hãy cùng nhau chung tay làm nên 1 tên tuổi</small>
                </div>
            </div>
        );
    };

    return (
        <div className="box-container">
            <div className="forum-header">
                <Link to="/forum">Quay lại</Link>
            </div>

            {renderContent()}
        </div>
    );
}

export default PlayerInfo;
