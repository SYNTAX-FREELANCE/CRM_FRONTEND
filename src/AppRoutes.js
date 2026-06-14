import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GlobalLoader from "./CommonComponents/GlobalLoader";
import Menumaster from "./Masters/MenuMaster/Menumaster";

// Lazy imports
const Intro = lazy(() => import("./pages/Intro"));
const Login = lazy(() => import("./UserManagement/Login"));
const WorkingPage = lazy(() => import("./CommonComponents/WorkingPage"));
const RouteLayout = lazy(() => import("./utils/Protected/RouteLayout"));
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard"));
const Settings = lazy(() => import("./Settings/Settings"));

const withSuspense = (Component) => (
  <Suspense fallback={<GlobalLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(Intro),
    errorElement: <h1 className="text-center mt-10">Page Not Found</h1>,
  },
  {
    path: "/login",
    element: withSuspense(Login),
  },
  {
    path: "/home",
    element: withSuspense(RouteLayout),
    children: [
      {
        index: true,
        element: withSuspense(AdminDashboard),
      },
      {
        path: "settings",
        element: withSuspense(Settings),
      },
      {
        path: "setting/menumaster",
        element: withSuspense(Menumaster),
      },
      {
        path: "*",
        element: withSuspense(WorkingPage),
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
