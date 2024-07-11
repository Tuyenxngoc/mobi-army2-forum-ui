import axios, { axiosPrivate } from '~/apis/configHttp';

export const getAllNotifications = () => {
    return axios.get('notifications');
};

export const createNotification = (values) => {
    return axiosPrivate.post('notifications', values);
};

export const deleteNotification = (id) => {
    return axiosPrivate.delete(`notifications/${id}`);
};

export const updateNotification = (id, values) => {
    return axiosPrivate.put(`notifications/${id}`, values);
};
