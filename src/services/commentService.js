import axios, { axiosPrivate } from '~/apis/configHttp';

export const getCommentByPostId = (postId, params) => {
    return axios.get(`comments/by-post/${postId}?${params}`);
};

export const createComment = (values) => {
    return axiosPrivate.post('comments', values);
};

export const updateComment = (id, values) => {
    return axiosPrivate.put(`comments/${id}`, values);
};

export const deleteComment = (id) => {
    return axiosPrivate.delete(`comments/${id}`);
};
