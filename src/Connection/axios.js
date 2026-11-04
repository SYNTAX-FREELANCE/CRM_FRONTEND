// src/utils/api.js
import axios from "axios";
import { BACKEND_API } from "../constant/Static";

export const axioslogin = axios.create({
    baseURL: BACKEND_API,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "lang": "en",
    },
    withCredentials: true,
    timeout: 10000,
});

axioslogin.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle rate limiting
        if (error.response?.status === 429) {
            window.dispatchEvent(
                new CustomEvent("api-rate-limit", {
                    detail: {
                        message:
                            error.response.data?.message ||
                            "Too many requests. Please wait before trying again."
                    }
                })
            );

            return Promise.reject(error);
        }

        if (originalRequest.url === "/user/refresh-token") {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axioslogin.post("/user/refresh-token");
                return axioslogin(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        //  Better error logging
        if (error.response) {
            console.error("Server Error:", {
                status: error.response.status,
                message: error.response.data?.message,
            });
        } else if (error.request) {
            console.error("Network Error:", error.request);
        } else {
            console.error("Request Error:", error.message);
        }

        return Promise.reject(error);
    }
);
