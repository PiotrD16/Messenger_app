import { createContext, useState, type ReactNode, useContext } from "react";

type AuthContextType = {
    auth: {
        user: any | null;
        accessToken: string | null;
    };
    setAuth: (auth: any) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState({
        user: null,
        accessToken: null
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;