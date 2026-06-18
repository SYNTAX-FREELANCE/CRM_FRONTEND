// src/utils/Protected/ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Box } from "@mui/material";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

  

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <span>Loading...</span>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
};

export default ProtectedRoute;