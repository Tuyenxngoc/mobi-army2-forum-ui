import Style from './Home.module.scss';
import classNames from 'classnames/bind';

import background from '~/assets/images/background.jpg';
import apk_0 from '~/assets/images/apk_0.png';
import apk_1 from '~/assets/images/apk_1.png';

import DownloadItem from '~/components/DownloadItem/DownloadItem';
import Notification from '~/components/Notification/Notification';
import CreateNotification from '~/components/Notification/CreateNotification';
import useAuth from '~/hooks/useAuth';
import { ROLES } from '~/common/contans';
import { useEffect, useState } from 'react';
import { getAllNotifications } from '~/services/NotificationService';

const cx = classNames.bind(Style);

const downloadInfo = [
    {
        title: 'Phiên bản: 244',
        link: '~/assets/files/army2local.jar',
        icon1: apk_0,
        icon2: apk_1,
    },
    {
        title: 'Phiên bản: 244',
        link: '~/assets/files/army2local.jar',
        icon1: apk_0,
        icon2: apk_1,
    },
    {
        title: 'Phiên bản: 244',
        link: '~/assets/files/army2local.jar',
        icon1: apk_0,
        icon2: apk_1,
    },
    {
        title: 'Phiên bản: 244',
        link: '~/assets/files/army2local.jar',
        icon1: apk_0,
        icon2: apk_1,
    },
];

function Home() {
    const [notifications, setNotifications] = useState([]);

    const { isAuthenticated, player } = useAuth();

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
            <div className={cx('slide')}>
                <img src={background} alt="background" />
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
                        fetchNotifications={fetchNotifications}
                        canEdit={isAuthenticated && player.roleName === ROLES.Admin}
                    />
                ))}
                {isAuthenticated && player.roleName === ROLES.Admin && (
                    <CreateNotification fetchNotifications={fetchNotifications} />
                )}
            </div>
        </main>
    );
}

export default Home;
