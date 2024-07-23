import queryString from 'query-string';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import Pagination from '~/components/Pagination';
import PlayerActions from '~/components/PlayerActions/PlayerActions';
import {
    deletePlayerNotificationById,
    getPlayerNotificationById,
    getPlayerNotifications,
} from '~/services/playerNotificationService';

import Style from './Notification.module.scss';
import classNames from 'classnames/bind';
import DateFormatter from '~/components/DateFormatter/DateFormatter';
import { Button, message, Modal, Spin } from 'antd';

const cx = classNames.bind(Style);

function Notification() {
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [notifications, setNotifications] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [notificationDetails, setNotificationDetails] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();

    const handleChangePage = (newPage) => {
        setFilters((prev) => ({ ...prev, pageNum: newPage + 1 }));
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    const handleViewNotification = async (id) => {
        setIsDetailLoading(true);
        setIsModalOpen(true);
        try {
            const response = await getPlayerNotificationById(id);
            setNotificationDetails(response.data.data);
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        } catch (error) {
            messageApi.error('Có lỗi xảy ra khi lấy chi tiết thông báo:', error);
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleRemoveNotification = async (id) => {
        setIsModalOpen(false);
        try {
            const response = await deletePlayerNotificationById(id);
            messageApi.success(response.data.data.message);
            setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
        } catch (error) {
            messageApi.error('Có lỗi xảy ra khi xóa thông báo:', error);
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const params = queryString.stringify(filters);
                const response = await getPlayerNotifications(params);
                const { meta, items } = response.data.data;
                setMeta(meta);
                setNotifications(items);
            } catch (error) {
                setErrorMessage(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [filters]);

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
                    Lỗi: {errorMessage.message}
                </div>
            );
        }

        return (
            <div>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={cx({ read: !notification.read }, 'notification-content', 'p-2')}
                            onClick={() => handleViewNotification(notification.id)}
                        >
                            <div>{notification.title}</div>
                            <div>
                                <DateFormatter datetime={notification.createdDate} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="px-2">Chưa có thông báo nào.</p>
                )}
            </div>
        );
    };
    return (
        <div className="box-container">
            <Modal
                title="Chi tiết thông báo"
                footer={
                    <>
                        <Button type="default" onClick={() => setIsModalOpen(false)}>
                            Đóng
                        </Button>
                        {notificationDetails && (
                            <Button type="primary" onClick={() => handleRemoveNotification(notificationDetails.id)}>
                                Xóa
                            </Button>
                        )}
                    </>
                }
                loading={isDetailLoading}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
            >
                {notificationDetails && (
                    <div className={cx('modal-content-scrollable')}>
                        <h2>{notificationDetails.title}</h2>
                        <div
                            className={cx('ql-snow', 'ql-editor', 'content')}
                            dangerouslySetInnerHTML={{ __html: notificationDetails.message }}
                        />
                    </div>
                )}
            </Modal>

            {contextHolder}

            <PlayerActions />

            <div className={cx('header')}>
                <Link to="/forum">Quay lại</Link>
            </div>

            <h3 className="p-2 pb-0">Thông báo</h3>

            {renderContent()}

            <Pagination
                totalPages={meta.totalPages || 1}
                currentPage={filters.pageNum - 1}
                rowsPerPage={meta.pageSize}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}

export default Notification;
