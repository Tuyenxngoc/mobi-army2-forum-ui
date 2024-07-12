import axios, { axiosPrivate } from '~/apis/configHttp';

export const getPost = (postId) => {
    return axios.get(`posts/${postId}`);
};

export const getPosts = () => {
    return axios.get('posts');
};

export const createPost = (values) => {
    return axiosPrivate.post('posts', values);
};

export const deletePost = (postId) => {
    return axiosPrivate.delete(`posts/${postId}`);
};

export const getPostsForReview = () => {
    return axiosPrivate.get('posts/review');
};

export const approvePost = (postId) => {
    return axiosPrivate.post(`posts/${postId}/approve`);
};

export const lockPost = (postId) => {
    return axiosPrivate.post(`posts/${postId}/lock`);
};

export const unlockPost = (postId) => {
    return axiosPrivate.post(`posts/${postId}/unlock`);
};
