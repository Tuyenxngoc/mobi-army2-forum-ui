import PropTypes from 'prop-types';

import { createContext, useEffect, useState } from 'react';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/common/contans';
import Loading from '~/components/Loading';
import { getCurrentUserLogin, logoutToken } from '~/services/authService';

const AuthContext = createContext();

const defaultAuth = {
    isAuthenticated: false,
    player: {
        username: '',
        roleName: '',
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
                const { username, roleName } = response.data.data;
                setAuthData({
                    isAuthenticated: true,
                    player: {
                        username,
                        roleName,
                    },
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

    const logout = async () => {
        try {
            await logoutToken();
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            setAuthData(defaultAuth);
        } catch (error) {
            console.log(error);
        }
    };

    const contextValues = {
        isAuthenticated: authData.isAuthenticated,
        customer: authData.customer,
        login,
        logout,
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
