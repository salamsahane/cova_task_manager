import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as authApi from '../api/auth';
import { tokenStorage } from '../api/client';

type AuthContextValue = {
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => tokenStorage.get());

    const login = useCallback(async (email: string, password: string) => {
        const { token } = await authApi.login({ email, password });
        tokenStorage.set(token);
        setToken(token);
    }, []);

    const register = useCallback(async (email: string, password: string) => {
        const { token } = await authApi.register({ email, password });
        tokenStorage.set(token);
        setToken(token);
    }, []);

    const logout = useCallback(() => {
        tokenStorage.clear();
        setToken(null);
    }, []);

    const value = useMemo(
        () => ({ token, isAuthenticated: token !== null, login, register, logout }),
        [token, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
}