import axios, { axiosPrivate } from '~/apis/configHttp';

export const getAllCategories = () => {
    return axios.get('categories');
};

export const getCategoriesForAdmin = (params) => {
    return axiosPrivate.get(`admin/categories?${params}`);
};

export const getCategoryByIdForAdmin = (categoryId) => {
    return axiosPrivate.get(`admin/categories/${categoryId}`);
};

export const createCategory = (values) => {
    return axiosPrivate.post('categories', values);
};

export const updateCategory = (categoryId, values) => {
    return axiosPrivate.put(`categories/${categoryId}`, values);
};

export const deleteCategory = (categoryId) => {
    return axiosPrivate.delete(`categories/${categoryId}`);
};
