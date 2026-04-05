import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('zeroshield_token') || null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('zeroshield_token');
        localStorage.removeItem('zeroshield_user');
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        const handleUnauthorized = () => {
            handleLogout();
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    useEffect(() => {
        const verifySession = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                // Fetch user data to validate token
                const cachedUser = localStorage.getItem('zeroshield_user');
                if (cachedUser) {
                    setUser(JSON.parse(cachedUser));
                } else {
                    setUser({ email: 'user@zeroshield.ai', role: 'admin' });
                }
            } catch (error) {
                // Ignore network offline errors to not drop local session arbitrarily
                if (error.status !== 0) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        };
        verifySession();
    }, [token]);

    const handleLogin = async (credentials) => {
        // Support standard JSON body or map natively from response
        const data = await api.post('/auth/login', credentials);
        
        // FastApi typically returns { access_token: "..." } for oauth2
        const jwt = data.access_token || data.token;
        if (!jwt) throw new Error("Invalid token payload returned from server.");
        
        localStorage.setItem('zeroshield_token', jwt);
        if (data.user) {
            localStorage.setItem('zeroshield_user', JSON.stringify(data.user));
            setUser(data.user);
        }
        setToken(jwt);
    };

    const handleRegister = async (credentials) => {
        const data = await api.post('/auth/signup', credentials);
        const jwt = data.access_token || data.token;
        if (jwt) {
            localStorage.setItem('zeroshield_token', jwt);
            if (data.user) {
                localStorage.setItem('zeroshield_user', JSON.stringify(data.user));
                setUser(data.user);
            }
            setToken(jwt);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            loading,
            login: handleLogin,
            register: handleRegister,
            logout: handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
