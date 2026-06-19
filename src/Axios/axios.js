import axios from "axios";
import { BACKEND_API } from "../constant/Static";

export const axiosLogin = axios.create({
    baseURL: BACKEND_API,
    headers: {
        "Content-Type": "application/json",
        Accept:'application/json',
        'Accept-Language':'en-GB,en'
    },
});
