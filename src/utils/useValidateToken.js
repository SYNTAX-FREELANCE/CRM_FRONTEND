import { useEffect, useState } from "react";
import axios from "axios";
import { axiosApi } from "../Axios/axios";
import { warningNofity } from "../constant/Constant";

const useValidateToken = () => {

    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsValid(false);
            setIsLoading(false);
            return;
        }

        const controler = new AbortController();
        const validateToken = async () => {
            setIsLoading(true);
            try {
                const res = await axiosApi.get("/validateAccessToken", {
                    signal: controler.signal
                });

                if (res.status === 200) {
                    const { isValidToken } = res.data;
                    setIsValid(isValidToken);
                } else {
                    setIsValid(false);
                }
            } catch (e) {
                if (axios.isCancel(e)) {
                    return; // Ignore cancellation errors
                }
                // console.log("Error validating token:", e);
                warningNofity("Please Login to Continue..!");
                localStorage.removeItem("app_auth"); // REMOVE THE AUTH VALUES
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("authUser");
                setIsValid(false);
                setIsLoading(false);
            } finally {
                // Only set loading false if request was not canceled
                if (!controler.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        validateToken();

        return () => {
            controler.abort();
        };

    }, []);

    return { isValid, isLoading }

}

export default useValidateToken;
