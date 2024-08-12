import { axiosPrivate } from '~/apis/configHttp';

export const updateRole = (playerId, roleId) => {
    return axiosPrivate.post(`users/${playerId}/role/${roleId}`);
};

export const getCurrentUserLogin = () => {
    return axiosPrivate.get('users/current');
};

export const changeUserName = (values) => {
    return axiosPrivate.put('users/change-username', values);
};

export const lockPlayerAccount = (playerId, values) => {
    return axiosPrivate.put(`/users/${playerId}/lock`, values);
};
