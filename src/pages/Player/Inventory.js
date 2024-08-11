import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '~/common/contans';
import useAuth from '~/hooks/useAuth';
import { getPlayerInventory } from '~/services/playerService';

function Inventory() {
    const [items, setItems] = useState([]);
    const [equips, setEquips] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const { player } = useAuth();

    useEffect(() => {
        const fetchPlayerInfo = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await getPlayerInventory();
                const { equipments, items } = response.data.data;
                setItems(items);
                setEquips(equipments);
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
                <h4 className="title">Rương Item</h4>
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

                <h4 className="title">Rương Trang Bị</h4>
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Chỉ số</th>
                            <th scope="col">Ngọc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equips.length > 0 ? (
                            equips.map((equip, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img src={BASE_URL + equip.imageUrl} alt="" />
                                        <span>&nbsp;{equip.name}</span>
                                    </td>
                                    <td>
                                        {JSON.stringify(equip.points)}
                                        <br />
                                        {JSON.stringify(equip.percents)}
                                    </td>
                                    <td>
                                        [
                                        {equip.slots.map((slot, index) =>
                                            slot ? (
                                                <img key={index} src={`${BASE_URL}${slot}`} alt={`Slot ${index}`} />
                                            ) : (
                                                <span key={index}>-1</span>
                                            ),
                                        )}
                                        ]
                                    </td>
                                </tr>
                            ))
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
            <div className="header">
                <Link to={`/player/${player.id}`}>Quay lại</Link>
            </div>

            {renderContent()}
        </div>
    );
}

export default Inventory;
