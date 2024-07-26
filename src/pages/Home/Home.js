import Style from './Home.module.scss';
import classNames from 'classnames/bind';
import DownloadItem from '~/components/DownloadItem/DownloadItem';
import Notification from '~/components/Notification/Notification';
import CreateNotification from '~/components/Notification/CreateNotification';
import useAuth from '~/hooks/useAuth';
import { ROLES } from '~/common/contans';
import { useEffect, useState } from 'react';
import { getAllNotifications } from '~/services/NotificationService';
import images from '~/assets';
import { message } from 'antd';

const cx = classNames.bind(Style);

const downloadInfo = [
    {
        title: 'Phiên bản: 244',
        link: '~/assets/files/army2local.jar',
        icon1: images.ggplay0,
        icon2: images.ggplay1,
    },
    {
        title: 'Phiên bản: 244',
        link: '~/assets/files/army2local.jar',
        icon1: images.apk0,
        icon2: images.apk1,
    },
    {
        title: 'Phiên bản: 243',
        link: '~/assets/files/army2local.jar',
        icon1: images.pc0,
        icon2: images.pc1,
    },
    {
        title: 'Phiên bản: 243',
        link: '~/assets/files/army2local.jar',
        icon1: images.ios0,
        icon2: images.ios1,
    },
];

const allowedRoles = {
    [ROLES.SuperAdmin]: true,
    [ROLES.Admin]: true,
};

function Home() {
    const [notifications, setNotifications] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const { player } = useAuth();

    const hasRequiredRole = allowedRoles[player.roleName];

    const addNotification = (newNotification) => {
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    };

    const updateNotification = (updatedNotification) => {
        setNotifications((prevNotifications) => {
            const index = prevNotifications.findIndex((notification) => notification.id === updatedNotification.id);

            if (index !== -1) {
                const updatedNotifications = [...prevNotifications];
                updatedNotifications[index] = updatedNotification;

                return updatedNotifications;
            } else {
                return prevNotifications;
            }
        });
    };

    const removeNotification = (notificationIdToRemove) => {
        setNotifications((prevNotifications) => {
            const updatedNotifications = prevNotifications.filter(
                (notification) => notification.id !== notificationIdToRemove,
            );

            return updatedNotifications;
        });
    };

    const fetchNotifications = async () => {
        try {
            const notifications = await getAllNotifications();
            setNotifications(notifications.data.data);
        } catch (error) {
            console.error('Error fetching Notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <main>
            {contextHolder}

            <div className={cx('slide')}>
                <img src={images.background} alt="background" />
            </div>
            <div className={cx('download')}>
                <div className="container">
                    <div className="row">
                        {downloadInfo.map((item, index) => (
                            <div className="col-lg-3 col-md-6 col-sm-6 col-6" key={index}>
                                <DownloadItem content={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={cx('notificationWrapper')}>
                {notifications.map((notification, index) => (
                    <Notification
                        key={index}
                        data={notification}
                        onNotificationUpdate={updateNotification}
                        onNotificationDelete={removeNotification}
                        canEdit={hasRequiredRole}
                        messageApi={messageApi}
                    />
                ))}
                {hasRequiredRole && <CreateNotification onAddNotification={addNotification} messageApi={messageApi} />}
            </div>
        </main>
    );
}

export default Home;
