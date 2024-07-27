import axios, { axiosPrivate } from '~/apis/configHttp';

export const getCommentByPostId = (postId, params) => {
    return axios.get(`posts/${postId}/comments?${params}`);
};

export const createComment = (postId, values) => {
    return axiosPrivate.post(`posts/${postId}/comments`, values);
};

export const updateComment = (id, values) => {
    return axiosPrivate.put(`comments/${id}`, values);
};

export const deleteComment = (id) => {
    return axiosPrivate.delete(`comments/${id}`);
};
