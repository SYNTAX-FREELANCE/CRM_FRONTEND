import React, { lazy, Suspense } from "react";
import { useAuth } from "../Context/AuthContext";
import GlobalLoader from "../CommonComponents/GlobalLoader";

const AdminDashboard = lazy(() => import("../Admin/AdminDashboard"));
const EmployeeDashboard = lazy(() => import("../Employee/EmployeeDashboard"));

const HomePage = () => {
    const { user } = useAuth();

    return (
        <Suspense fallback={<GlobalLoader/>}>
            {user?.role?.toLowerCase() === "admin" ? (
                <AdminDashboard />
            ) : (
                <EmployeeDashboard />
            )}
        </Suspense>
    );
};

export default HomePage;