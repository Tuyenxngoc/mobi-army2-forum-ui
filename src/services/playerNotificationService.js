import { axiosPrivate } from '~/apis/configHttp';

export const getPlayerNotifications = (params) => {
    return axiosPrivate.get(`player-notifications?${params}`);
};

export const getPlayerNotificationById = (id) => {
    return axiosPrivate.get(`player-notifications/${id}`);
};

export const deletePlayerNotificationById = (id) => {
    return axiosPrivate.delete(`player-notifications/${id}`);
};

export const createPlayerNotification = (values) => {
    return axiosPrivate.post('player-notifications', values);
};

export const getPlayerInfo = () => {
    return axiosPrivate.get('players/info');
};
