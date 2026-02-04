import { createContext, useState } from 'react';

interface AuthContextType {
    login: (token: string) => void;
    logout: () => void;
    token: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState(localStorage.getItem('token') ?? '');

    const login = (token: string) => {
        setToken(token);
    };

    const logout = () => {
        setToken('');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};