import axios, { axiosPrivate } from '~/apis/configHttp';

export const getCommentByPostId = (postId) => {
    return axios.get(`comments/by-post/${postId}`);
};

export const createComment = (values) => {
    return axiosPrivate.post('comments', values);
};
