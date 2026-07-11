// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { axioslogin } from "../Axios/axios";
import { infoNotify } from "../constant/Constant";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        validateToken();
    }, []);

    const getUserFromStorage = () => {
        try {
            const encryptedUser = localStorage.getItem("user");
            if (encryptedUser) {
                return JSON.parse(atob(encryptedUser));
            }
            return null;
        } catch (error) {
            console.error("Decryption error:", error);
            return null;
        }
    };

    const validateToken = async () => {
        const storedUser = getUserFromStorage();

        if (!storedUser) {
            setLoading(false);
            setIsAuthenticated(false);
            return;
        }

        try {
            //  Cookie is auto-sent by browser (HTTP-only, no frontend access needed)
            const response = await axioslogin.get("/validate-token");

            if (response.data.valid) {
                setUser(storedUser);
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("user");
                infoNotify("Session Time Out")
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Token validation error:", error);
            localStorage.removeItem("user");
            setIsAuthenticated(false);
        }

        setLoading(false);
    };

    const login = (userData) => {
        //  Store ONLY user data (encrypted) - NO tokens
        try {
            const encryptedUser = btoa(JSON.stringify(userData));
            localStorage.setItem("user", encryptedUser);

            setUser(userData);
            setIsAuthenticated(true);

        } catch (error) {
            console.error("Encryption error:", error);
        }
    };

    const logout = async () => {
        try {
            const attendance_id = localStorage.getItem("attendance_id");
            //  Cookie is auto-sent by browser for logout
            await axioslogin.post("/user/logout", { attendance_id });
        } catch (error) {
            console.error("Logout error:", error);
        }

        // Remove ONLY user data - NO tokens to remove
        localStorage.removeItem("user");
        localStorage.removeItem("attendance_id");
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, validateToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);