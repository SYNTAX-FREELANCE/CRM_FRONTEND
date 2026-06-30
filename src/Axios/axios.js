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
// =======
// export const axiosApi = axios.create({
//     baseURL: BACKEND_API,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// // Request interceptor to add bearer token dynamically
// const attachTokenInterceptor = (instance) => {
//     instance.interceptors.request.use(
//         (config) => {
//             const token = localStorage.getItem("token");
//             if (token) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//             return config;
//         },
//         (error) => {
//             return Promise.reject(error);
//         }
//     );
// };

// attachTokenInterceptor(axiosLogin);
// attachTokenInterceptor(axiosApi);
// >>>>>>> 134bf9c22c84c5ff11e553828c7018ac93e9c9f4
