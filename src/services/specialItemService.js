import { axiosPrivate } from '~/apis/configHttp';

export const getAllSpecialItems = () => {
    return axiosPrivate.get('special-items');
};
