import axios, { axiosPrivate } from '~/apis/configHttp.js';

export const login = (values) => {
    return axios.post('auth/login', values);
};

export const getCurrentUserLogin = () => {
    return axiosPrivate.get('user/profile');
};

export const logoutToken = () => {
    return axiosPrivate.post('auth/logout');
};
