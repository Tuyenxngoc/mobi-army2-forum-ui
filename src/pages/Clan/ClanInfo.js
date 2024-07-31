import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClanById } from '~/services/clanService';

function ClanInfo() {
    const { clanId } = useParams();

    const [clan, setClan] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

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
                <ol>
                    <li>{clan.name}</li>
                </ol>
            </div>
        );
    };

    return (
        <>
            <h3 className="p-2 pb-0">Thông tin biệt đội</h3>

            {renderContent()}
        </>
    );
}

export default ClanInfo;
