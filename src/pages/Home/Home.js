import Style from './Home.module.scss';
import classNames from 'classnames/bind';
import DownloadItem from '~/components/DownloadItem/DownloadItem';
import Notification from '~/components/Notification/Notification';
import CreateNotification from '~/components/Notification/CreateNotification';
import useAuth from '~/hooks/useAuth';
import { ROLES } from '~/common/roleConstants';
import { useEffect, useState } from 'react';
import { getAllNotifications } from '~/services/NotificationService';
import images from '~/assets';
import { message } from 'antd';

const cx = classNames.bind(Style);

const downloadInfo = [
    {
        title: 'Phiên bản: 244',
        link: 'http://localhost:8080/files/army2_v244.apk',
        icon1: images.ggplay0,
        icon2: images.ggplay1,
    },
    {
        title: 'Phiên bản: 244',
        link: 'http://localhost:8080/files/army2_v244.apk',
        icon1: images.apk0,
        icon2: images.apk1,
    },
    {
        title: 'Phiên bản: 243',
        link: 'http://localhost:8080/files/Army2_v241_PC.zip',
        icon1: images.pc0,
        icon2: images.pc1,
    },
    {
        title: 'Phiên bản: 243',
        link: 'http://localhost:8080/files/Army2_v241_PC.zip',
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

    const addNotification = (data) => {
        setNotifications((prev) => [...prev, data]);
    };

    const updateNotification = (data) => {
        setNotifications((prev) => {
            const index = prev.findIndex((notification) => notification.id === data.id);

            if (index !== -1) {
                const updatedNotifications = [...prev];
                updatedNotifications[index] = data;

                return updatedNotifications;
            } else {
                return prev;
            }
        });
    };

    const removeNotification = (id) => {
        setNotifications((prev) => {
            const updatedNotifications = prev.filter((notification) => notification.id !== id);

            return updatedNotifications;
        });
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const notifications = await getAllNotifications();
                setNotifications(notifications.data.data);
            } catch (error) {
                messageApi.error('Lỗi: Không thể lấy dữ liệu thông báo');
            }
        };

        fetchNotifications();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="custom-bg-primary">
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

            {notifications.map((notification, index) => (
                <Notification
                    key={index}
                    data={notification}
                    onNotificationUpdate={updateNotification}
                    onNotificationDelete={removeNotification}
                    canEdit={hasRequiredRole}
                    messageApi={messageApi}
                    className={index < notifications.length - 1 ? 'mb-1' : ''}
                />
            ))}
            {hasRequiredRole && <CreateNotification onAddNotification={addNotification} messageApi={messageApi} />}
        </main>
    );
}

export default Home;
