import axios from '~/apis/configHttp';

export const getPost = () => {
    return axios.get('posts');
};
