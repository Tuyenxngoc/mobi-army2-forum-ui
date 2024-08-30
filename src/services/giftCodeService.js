import { axiosPrivate } from '~/apis/configHttp';

export const getGiftCodes = (params) => {
    return axiosPrivate.get(`gift-codes?${params}`);
};

export const getGiftCodeById = (giftCodeId) => {
    return axiosPrivate.get(`gift-codes/${giftCodeId}`);
};

export const createGiftCode = (values) => {
    return axiosPrivate.post('gift-codes', values);
};

export const updateGiftCode = (giftCodeId, values) => {
    return axiosPrivate.put(`gift-codes/${giftCodeId}`, values);
};

export const deleteGiftCode = (giftCodeId) => {
    return axiosPrivate.delete(`gift-codes/${giftCodeId}`);
};
