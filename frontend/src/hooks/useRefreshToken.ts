import axios from "../api/axios";
import { setAccessToken } from "./useAxiosPrivate";
import { useAuth } from "../context/AuthProvider";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    return async () => {
        try {
            const response = await axios.get('/auth/refresh', {
                withCredentials: true
            });

            //console.log("Refresh success:", response.data);

            setAccessToken(response.data.accessToken);

            setAuth((prev: any) => {
                return {
                    ...prev,
                    user: response.data.user,
                    accessToken: response.data.accessToken
                };
            });

            return response.data.accessToken;
        } catch (err) {
            throw err;
        }
    };
};

export default useRefreshToken;