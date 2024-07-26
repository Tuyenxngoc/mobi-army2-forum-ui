import axios, { axiosPrivate } from '~/apis/configHttp';

export const getPost = (postId) => {
    return axiosPrivate.get(`posts/${postId}`);
};

export const getPosts = (params) => {
    return axios.get(`posts?${params}`);
};

export const createPost = (values) => {
    return axiosPrivate.post('posts', values);
};

export const updatePost = (postId, values) => {
    return axiosPrivate.put(`posts/${postId}`, values);
};

export const deletePost = (postId) => {
    return axiosPrivate.delete(`posts/${postId}`);
};

export const getPostsForReview = (params) => {
    return axiosPrivate.get(`posts/review?${params}`);
};

export const approvePost = (postId) => {
    return axiosPrivate.post(`posts/${postId}/approve`);
};

export const toggleLock = (postId) => {
    return axiosPrivate.post(`posts/${postId}/lock`);
};

export const toggleFollow = (postId) => {
    return axiosPrivate.post(`posts/${postId}/follow`);
};
