import { axiosPrivate } from '~/apis/configHttp';

export const kickClanMember = (clanId, memberId) => {
    return axiosPrivate.delete(`/clans/${clanId}/members/${memberId}`);
};

export const promoteClanMember = (clanId, memberId) => {
    return axiosPrivate.post(`/clans/${clanId}/members/${memberId}/promote`);
};
