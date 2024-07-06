import axios, { axiosPrivate } from '~/apis/configHttp.js';

export const loginUser = (values) => {
    return axios.post('auth/login', values);
};

export const getCurrentUserLogin = () => {
    return axiosPrivate.get('user/current');
};

export const logoutToken = () => {
    return axiosPrivate.post('auth/logout');
};
