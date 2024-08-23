import PropTypes from 'prop-types';

import { createContext, useEffect, useState } from 'react';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/common/commonConstants';
import Loading from '~/components/Loading/Loading';
import { logoutToken } from '~/services/authService';
import { getCurrentUserLogin } from '~/services/userService';

const AuthContext = createContext();

const defaultAuth = {
    isAuthenticated: false,
    player: {
        id: null,
        username: '',
        roleName: '',
        avatar: '',
        online: false,
        points: 1,
        clanMember: null,
    },
};

const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(defaultAuth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        validateToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validateToken = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                setAuthData(defaultAuth);
                setLoading(false);
                return;
            }
            const response = await getCurrentUserLogin();
            if (response.status === 200) {
                const { id, username, roleName, avatar, online, points, clanMember } = response.data.data;
                setAuthData({
                    isAuthenticated: true,
                    player: { id, username, roleName, avatar, online, points, clanMember },
                });
            } else {
                setAuthData(defaultAuth);
            }
        } catch (error) {
            setAuthData(defaultAuth);
        } finally {
            setLoading(false);
        }
    };

    const login = ({ accessToken, refreshToken }) => {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
        validateToken();
    };

    const logout = async (isLogoutToken = true) => {
        if (isLogoutToken) {
            try {
                await logoutToken();
            } catch (error) {
                console.log(error);
            }
        }
        setAuthData(defaultAuth);
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
    };

    const loadUserInfo = () => {
        validateToken();
    };

    const contextValues = {
        isAuthenticated: authData.isAuthenticated,
        player: authData.player,
        login,
        logout,
        loadUserInfo,
    };

    if (loading) {
        return <Loading />;
    }

    return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export { AuthContext, AuthProvider };
