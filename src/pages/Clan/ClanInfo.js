import { Button, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '~/hooks/useAuth';
import { getClanById, joinClan } from '~/services/clanService';

function ClanInfo() {
    const { clanId } = useParams();

    const [clan, setClan] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const { player } = useAuth();

    const handleJoinClan = async () => {
        try {
            const response = await joinClan(clanId);
            if (response.status === 200) {
                messageApi.success(response.data.data.message);
            }
        } catch (error) {
            messageApi.error(`Lỗi: ${error.response?.data?.message || error.message}`);
        }
    };

    useEffect(() => {
        const fetchClanInfo = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getClanById(clanId);
                setClan(response.data.data);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClanInfo();
    }, [clanId]);

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
                {player.clan === null && (
                    <Button type="primary" onClick={handleJoinClan}>
                        Tham gia Clan
                    </Button>
                )}

                <ol>
                    <li>{clan.name}</li>
                </ol>
            </div>
        );
    };

    return (
        <div className="box-container">
            <h3 className="p-2 pb-0">Thông tin biệt đội</h3>

            {contextHolder}

            {renderContent()}
        </div>
    );
}

export default ClanInfo;
