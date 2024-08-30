import { axiosPrivate } from '~/apis/configHttp';

export const getEquipsByCharacterIdAndType = (characterId, type) => {
    return axiosPrivate.get(`equips/${characterId}/${type}`);
};
