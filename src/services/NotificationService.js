import axios, { axiosPrivate } from '~/apis/configHttp';

export const getAllNotifications = () => {
    return axios.get('notifications');
};

export const createNotification = (values) => {
    return axiosPrivate.post('notifications', values);
};
