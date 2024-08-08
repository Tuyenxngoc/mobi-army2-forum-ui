import { axiosPrivate } from '~/apis/configHttp';

export const rejectMember = (clanId, approvalId) => {
    return axiosPrivate.post(`/clans/${clanId}/approvals/${approvalId}/reject`);
};

export const approveMember = (clanId, approvalId) => {
    return axiosPrivate.post(`/clans/${clanId}/approvals/${approvalId}/approve`);
};

export const getApprovals = (clanId, params) => {
    return axiosPrivate.get(`/clans/${clanId}/approvals?${params}`);
};
