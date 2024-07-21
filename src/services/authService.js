import axios, { axiosPrivate } from '~/apis/configHttp.js';

export const loginUser = (values) => {
    return axios.post('auth/login', values);
};

export const register = (url, values) => {
    return axios.post(`auth/register?siteURL=${url}`, values);
};

export const confirmEmail = (code) => {
    return axios.get(`auth/confirm?code=${code}`);
};

export const resendConfirmationEmail = (email, url) => {
    return axios.post(`auth/resend-code?email=${email}&siteURL=${url}`);
};

export const checkEmailConfirmed = (email) => {
    return axios.get(`auth/check-email?email=${email}`);
};

export const getCurrentUserLogin = () => {
    return axiosPrivate.get('user/current');
};

export const logoutToken = () => {
    return axiosPrivate.post('auth/logout');
};
