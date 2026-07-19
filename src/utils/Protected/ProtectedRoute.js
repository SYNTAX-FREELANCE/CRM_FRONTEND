// src/utils/Protected/ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Box } from "@mui/material";
import { getAuthUser } from "../../constant/Constant";
import { getMenu, MENU } from "../../Menu/menu";
import { useGetActiveModuleRightDetail } from "../../CommonCode/useQuery";
import GlobalLoader from "../../CommonComponents/GlobalLoader";
import Intro from "../../pages/Intro";

const ProtectedRoute = ({ children }) => {

    const authUser = getAuthUser();

    const { role_id } = authUser ?? {};

    const { data: RoleRights = [], isLoading: rightsLoading, } = useGetActiveModuleRightDetail(role_id);

    const { isAuthenticated, loading } = useAuth();

    const location = useLocation();


    const flattenMenu = (menu) =>
        menu.flatMap((item) =>
            item.nested
                ? [
                    { module_id: item.module_id, path: item.path },
                    ...item.nested,
                ]
                : [item]
        );

    if (loading || rightsLoading) {
        // return <GlobalLoader text={"Starting Please Wait...!"} />;
        return <Intro />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }


    const routes = flattenMenu(MENU);

    const current = routes?.find((r) => r.path === location.pathname);

    if (current) {
        const allowed = RoleRights?.some(
            x => x.module_id === current.module_id
        );

        if (!allowed) {
            return <Navigate to="/notfound" replace />;
        }
    }


    return children;
};

export default ProtectedRoute;