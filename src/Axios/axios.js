import axios from "axios";
import { BACKEND_API } from "../constant/Static";

export const axiosLogin = axios.create({
    baseURL: BACKEND_API,
    headers: {
        "Content-Type": "application/json",
    },
});

export const axiosApi = axios.create({
    baseURL: BACKEND_API,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add bearer token dynamically
const attachTokenInterceptor = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

attachTokenInterceptor(axiosLogin);
attachTokenInterceptor(axiosApi);
