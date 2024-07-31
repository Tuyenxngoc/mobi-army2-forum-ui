import { axiosPrivate } from '~/apis/configHttp';

export const getclans = (params) => {
    return axiosPrivate.get(`clans?${params}`);
};

export const getclanIcons = () => {
    return axiosPrivate.get('clans/icons');
};

export const getClanById = (clanId) => {
    return axiosPrivate.get(`clans/${clanId}`);
};

export const createClan = (values) => {
    return axiosPrivate.post('clans', values);
};

export const updateClan = (clanId, values) => {
    return axiosPrivate.put(`clans/${clanId}`, values);
};

export const deleteClan = (clanId) => {
    return axiosPrivate.delete(`clans/${clanId}`);
};
