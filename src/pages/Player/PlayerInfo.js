import { Badge, Spin } from 'antd';
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
                        Biệt đội:{' '}
                        {player.clan ? (
                            <>
                                <Link to={`/clan/${player.clan.id}`}>{player.clan.name}</Link>
                                [<img src={BASE_URL + player.clan.icon} alt="icon" />]
                            </>
                        ) : (
                            <Link to="/clan">Tham gia biệt đội</Link>
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
            </div>
        );
    };

    return (
        <div className="box-container">
            <div className="forum-header">
                <Link to="/forum">Quay lại</Link>
            </div>

            <h3 className="p-2 pb-0">Hồ Sơ Của Tôi</h3>

            {renderContent()}
        </div>
    );
}

export default PlayerInfo;
