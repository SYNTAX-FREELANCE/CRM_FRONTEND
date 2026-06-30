// src/utils/Protected/PublicRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Box } from "@mui/material";

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <span>Loading...</span>
            </Box>
        );
    }

    // If logged in, redirect to home (block access to login page)
    if (isAuthenticated) {
        return <Navigate to="/home" replace state={{ from: location.pathname }} />;
    }

    return children;
};

export default PublicRoute;