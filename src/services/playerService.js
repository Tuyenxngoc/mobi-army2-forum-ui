import { axiosPrivate } from '~/apis/configHttp';

export const getFollowingPosts = (params) => {
    return axiosPrivate.get(`players/following-post?${params}`);
};
