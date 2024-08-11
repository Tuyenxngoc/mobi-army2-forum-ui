import { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Button, message, Modal, Spin } from 'antd';

import {
    deletePlayerNotificationById,
    getPlayerNotificationById,
    getPlayerNotifications,
} from '~/services/playerNotificationService';

import Style from './Notification.module.scss';
import classNames from 'classnames/bind';

import { INITIAL_FILTERS, INITIAL_META } from '~/common/contans';
import DateFormatter from '~/components/DateFormatter/DateFormatter';
import Pagination from '~/components/Pagination';
import { Link } from 'react-router-dom';

const cx = classNames.bind(Style);

function Notification() {
    const [meta, setMeta] = useState(INITIAL_META);
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [notifications, setNotifications] = useState([]);

    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
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
        setFilters((prev) => ({
            ...prev,
            pageNum: 1,
            pageSize: parseInt(event.target.value, 10),
        }));
    };

    const handleViewNotification = async (id) => {
        if (!notificationDetails || id !== notificationDetails.id) {
            setIsDetailLoading(true);
            setIsModalOpen(true);
            try {
                const response = await getPlayerNotificationById(id);
                setNotificationDetails(response.data.data);
                setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
            } catch (error) {
                messageApi.error('Có lỗi xảy ra khi lấy chi tiết thông báo');
            } finally {
                setIsDetailLoading(false);
            }
        } else {
            setIsModalOpen(true);
        }
    };

    const handleRemoveNotification = async (id) => {
        setIsDeleteLoading(true);
        try {
            const response = await deletePlayerNotificationById(id);
            messageApi.success(response.data.data.message);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            messageApi.error('Có lỗi xảy ra khi xóa thông báo');
        } finally {
            setIsModalOpen(false);
            setIsDeleteLoading(false);
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true);
            setErrorMessage(null);
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
                <div className="alert alert-primary p-2" role="alert">
                    Loading... <Spin />
                </div>
            );
        }

        if (errorMessage) {
            return (
                <div className="alert alert-danger p-2" role="alert">
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
                            className={cx({ read: !notification.read }, 'content')}
                            onClick={() => handleViewNotification(notification.id)}
                        >
                            <div>{notification.title}</div>
                            <div>
                                <DateFormatter datetime={notification.createdDate} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Chưa có thông báo nào.</p>
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

            <Modal
                title="Chi tiết thông báo"
                footer={
                    <>
                        <Button onClick={() => setIsModalOpen(false)}>Đóng</Button>
                        {notificationDetails && (
                            <Button
                                type="primary"
                                onClick={() => handleRemoveNotification(notificationDetails.id)}
                                loading={isDeleteLoading}
                            >
                                Xóa
                            </Button>
                        )}
                    </>
                }
                loading={isDetailLoading}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                confirmLoading={isDeleteLoading}
            >
                {notificationDetails && (
                    <div className={cx('modal-content-scrollable')}>
                        <h2>{notificationDetails.title}</h2>
                        <div
                            className="ql-snow ql-editor p-0"
                            dangerouslySetInnerHTML={{ __html: notificationDetails.message }}
                        />
                    </div>
                )}
            </Modal>

            <div className="p-2">
                <h4 className="title">Thông báo</h4>

                {renderContent()}
            </div>

            <Pagination
                totalPages={meta.totalPages || 1}
                currentPage={filters.pageNum - 1}
                rowsPerPage={meta.pageSize}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                isLoading={isLoading}
            />
        </div>
    );
}

export default Notification;
