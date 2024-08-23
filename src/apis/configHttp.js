import axios from 'axios';
import { ACCESS_TOKEN, API_URL, REFRESH_TOKEN } from '~/common/commonConstants';

export default axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const axiosPrivate = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosPrivate.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
            prevRequest.sent = true;

            try {
                const newAccessToken = await refresh();
                prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosPrivate(prevRequest);
            } catch (refreshError) {
                console.error('Error retrying request after token refresh:', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);

const refresh = async () => {
    try {
        const response = await axiosPrivate.post('auth/refresh-token', {
            refreshToken: localStorage.getItem(REFRESH_TOKEN),
        });

        const { accessToken, refreshToken } = response.data.data;
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);

        return accessToken;
    } catch (error) {
        console.error('Error refreshing token: ', error);
        throw error;
    }
};
