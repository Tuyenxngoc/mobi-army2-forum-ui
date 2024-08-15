export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

export const ROLES = {
    SuperAdmin: 'ROLE_SUPER_ADMIN',
    Admin: 'ROLE_ADMIN',
    Moderator: 'ROLE_MODERATOR',
    Support: 'ROLE_SUPPORT',
    User: 'ROLE_USER',
};

export const ROLES_NAME = {
    ROLE_SUPER_ADMIN: 'Quản trị viên cấp cao',
    ROLE_ADMIN: 'Quản trị viên',
    ROLE_MODERATOR: 'Điều hành viên',
    ROLE_SUPPORT: 'Hỗ trợ viên',
    ROLE_USER: 'Người dùng',
};

export const INITIAL_META = { totalPages: 1, pageSize: 10 };
export const INITIAL_FILTERS = { pageNum: 1, pageSize: 10 };

export const API_URL = process.env.REACT_APP_API_BASE_URL;
export const BASE_URL = process.env.REACT_APP_BASE_URL;
