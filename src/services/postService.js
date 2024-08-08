import axios, { axiosPrivate } from '~/apis/configHttp';

export const getPostById = (postId) => {
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

export const approvePost = (postId) => {
    return axiosPrivate.post(`posts/${postId}/approve`);
};

export const toggleLock = (postId) => {
    return axiosPrivate.post(`posts/${postId}/lock`);
};

export const toggleFollow = (postId) => {
    return axiosPrivate.post(`posts/${postId}/follow`);
};

export const getPostsForAdmin = (params) => {
    return axiosPrivate.get(`admin/posts?${params}`);
};

export const getPostForAdminById = (postId) => {
    return axiosPrivate.get(`admin/posts/${postId}`);
};

export const getPostsByPlayerId = (params) => {
    return axiosPrivate.get(`posts/my-posts?${params}`);
};
