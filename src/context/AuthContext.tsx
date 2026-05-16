import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    userId: number | null;
    login: (token: string, userId: number) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children } : { children: ReactNode }) {

    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token') || null
    )

    const [userId, setUserId] = useState<number | null>(
        Number(localStorage.getItem('userId')) || null
    )

    function login(token: string, userId: number) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', String(userId));
        setToken(token);
        setUserId(userId);
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setToken(null);
        setUserId(null);
    }

    return (
        <AuthContext.Provider value={{ token, userId, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}