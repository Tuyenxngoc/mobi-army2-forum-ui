import { axiosPrivate } from '~/apis/configHttp';

export const getFollowingPosts = (params) => {
    return axiosPrivate.get(`players/following-post?${params}`);
};

export const getPlayerById = (playerId) => {
    return axiosPrivate.get(`players/${playerId}`);
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

export const getPlayerCharacter = () => {
    return axiosPrivate.get('players/character');
};

export const getPlayerPoints = (id) => {
    return axiosPrivate.get(`players/character/${id}/points`);
};

export const updatePoints = (values) => {
    return axiosPrivate.put('players/additional-points', values);
};
