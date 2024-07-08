import axios from '~/apis/configHttp';

export const getAllCategories = () => {
    return axios.get('categories');
};
