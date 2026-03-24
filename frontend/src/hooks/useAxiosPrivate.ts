import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import { useNavigate } from "react-router-dom";

import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

let accessToken = "";

export const setAccessToken = (token: string) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    sent?: boolean;
}

const useAxiosPrivate = () => {
    const navigate = useNavigate();

    useEffect(() => {

        // dokleja token do requsetow
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error: AxiosError) => Promise.reject(error)
        );

        // odbiera response
        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const prevRequest = error.config as ExtendedAxiosRequestConfig;

                if (error.response?.status === 403 && prevRequest && !prevRequest.sent) {
                    prevRequest.sent = true;

                    try {
                        console.log("Token wygasł - odświeżam...");
                        const response = await axiosPrivate.get('/auth/refresh');
                        const newAccessToken = response.data.accessToken;

                        setAccessToken(newAccessToken);

                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);

                    } catch (refreshError) {
                        console.error("Sesja wygasła.");
                        setAccessToken("");
                        navigate("/");
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [navigate]);

    return axiosPrivate;
};

export default useAxiosPrivate;