import { axiosPrivate } from '~/apis/configHttp';

export const toggleLike = (postId) => {
    return axiosPrivate.post(`likes/${postId}`);
};
