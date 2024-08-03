import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '~/common/contans';
import { getPlayerInventory } from '~/services/playerService';

function Inventory() {
    const [items, setItems] = useState([]);
    const [equip, setEquip] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchPlayerInfo = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getPlayerInventory();
                const { equipments, items } = response.data.data;
                setItems(items);
                setEquip(equipments);
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
                <div className="forum-border-bottom text-primary mt-2">Rương Item</div>
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Item</th>
                            <th scope="col">Chi tiết</th>
                            <th scope="col">Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{item.id}</th>
                                    <td>
                                        <img src={BASE_URL + item.imageUrl} alt={item.name} />
                                        <span>&nbsp;{item.name}</span>
                                    </td>
                                    <td>{item.detail}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" align="center">
                                    Chưa có vật phẩm nào trong rương
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="forum-border-bottom text-primary mt-2">Rương Trang Bị</div>
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Item</th>
                            <th scope="col">Chi tiết</th>
                            <th scope="col">Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equip.length > 0 ? (
                            <>hi</>
                        ) : (
                            <tr>
                                <td colSpan="4" align="center">
                                    Chưa có trang bị nào trong rương
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="box-container">
            <div className="forum-header">
                <Link to="/player/info">Quay lại</Link>
            </div>

            {renderContent()}
        </div>
    );
}

export default Inventory;