import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import { useAuth } from "../context/AuthProvider";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        // jesli nie ma tokenu to wysylam request
        if (!auth?.accessToken) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => { isMounted = false; }
    }, []);

    return (
        <>
            {isLoading
                ? <div style={{ color: "white", textAlign: "center", marginTop: "20%" }}>Wczytywanie...</div>
                : <Outlet />
            }
        </>
    );
};

export default PersistLogin;