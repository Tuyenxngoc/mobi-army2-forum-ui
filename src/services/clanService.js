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

export const getClanMembers = (clanId, params) => {
    return axiosPrivate.get(`clans/${clanId}/members?${params}`);
};

export const getClanMembersForOwner = (clanId, params) => {
    return axiosPrivate.get(`admin/clans/${clanId}/members?${params}`);
};

export const createClan = (values) => {
    return axiosPrivate.post('clans', values);
};

export const updateClan = (clanId, values) => {
    return axiosPrivate.put(`clans/${clanId}`, values);
};

export const increaseClanMembers = (clanId) => {
    return axiosPrivate.patch(`clans/${clanId}/increase-members`);
};

export const joinClan = (clanId) => {
    return axiosPrivate.post(`clans/${clanId}/members/join`);
};

export const leaveClan = (clanId) => {
    return axiosPrivate.post(`clans/${clanId}/members/leave`);
};
