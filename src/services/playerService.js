import { axiosPrivate } from '~/apis/configHttp';

export const getFollowingPosts = (params) => {
    return axiosPrivate.get(`players/following-post?${params}`);
};

export const getPlayerInfo = () => {
    return axiosPrivate.get('players/info');
};

export const toggleInvitationLock = () => {
    return axiosPrivate.put('players/toggle-invitation-lock');
};

export const toggleEquipmentChestLock = () => {
    return axiosPrivate.put('players/toggle-chest-lock');
};

export const getPlayerInventory = () => {
    return axiosPrivate.get('players/inventory');
};
