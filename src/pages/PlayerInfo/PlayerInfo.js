import { Badge, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { BASE_URL } from '~/common/contans';
import { getPlayerInfo } from '~/services/playerNotificationService';

function PlayerInfo() {
    const [player, setPlayer] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchPlayerInfo = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getPlayerInfo();
                setPlayer(response.data.data);
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
                <div>ID: {player.id}</div>
                <div>Online: {player.online ? <Badge status="success" /> : <Badge status="default" />}</div>
                <div>Xu: {player.xu}</div>
                <div>Lượng: {player.luong}</div>
                <div>Email: {player.email}</div>
                <div>Số điện thoại: {player.phoneNumber}</div>
            </div>
        );
    };

    return (
        <>
            <h3 className="p-2 pb-0">Hồ Sơ Của Tôi</h3>

            {renderContent()}
        </>
    );
}

export default PlayerInfo;
