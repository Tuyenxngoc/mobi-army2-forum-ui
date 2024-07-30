export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';
export const ROLES = {
    SuperAdmin: 'ROLE_SUPER_ADMIN',
    Admin: 'ROLE_ADMIN',
    User: 'ROLE_USER',
};
export const INITIAL_META = { totalPages: 1, pageSize: 10 };
export const INITIAL_FILTERS = { pageNum: 1, pageSize: 10 };

export const API_URL = process.env.REACT_APP_BASE_URL;
export const BASE_RESOURCE_URL = process.env.REACT_APP_BASE_RESOURCE_URL;
