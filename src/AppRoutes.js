import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GlobalLoader from "./CommonComponents/GlobalLoader";

// Lazy imports
const Intro = lazy(() => import("./pages/Intro"));
const Login = lazy(() => import("./UserManagement/Login"));
const WorkingPage = lazy(() => import("./CommonComponents/WorkingPage"));
const RouteLayout = lazy(() => import("./utils/Protected/RouteLayout"));
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard"));
const Settings = lazy(() => import("./Settings/Settings"));
const BankMaster = lazy(()=>import("./Masters/BankMaster/BankMaster"));
const UserReg = lazy(()=>import("./Masters/UserRegistration/UserRegistration"));

// Master imports (non-lazy for faster initial load)
const MenuCreation = lazy(() => import("./Masters/MenuMaster/MenuCreation"));
const UserCreation = lazy(() => import("./Masters/UserCreation/UserCreation"));
const ModuleCreation = lazy(() => import("./Masters/ModuleMaster/ModuleCreation"));
const Submodulecreation = lazy(() => import("./Masters/SubmoduleMaster/Submodulecreation"));
const QualificationCreation = lazy(() => import("./Masters/QualificationMaster/QualificationCreation"));
const CompanyCreation = lazy(() => import("./Masters/CompanyMaster/CompanyCreation"));
const RoleCreation = lazy(() => import("./Masters/RoleMaster/RoleCreation"));
const StatusCreation = lazy(() => import("./Masters/StatusCreation/StatusCreation"));
const UserModuleRightCreation = lazy(() => import("./Masters/UserGroupMaster/UserModuleRightCreation"));
const UserRightCreation = lazy(() => import("./Masters/UserRightMaster/UserRightCreation"));


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
      // Menu Master
      {
        path: "setting/menumaster",
        element: withSuspense(MenuCreation),
      },
      // User/Employee Master
      {
        path: "setting/employeemaster",
        element: withSuspense(UserCreation),
      },
      // Module Master
      {
        path: "setting/modulemaster",
        element: withSuspense(ModuleCreation),
      },
      // Submodule Master
      {
        path: "setting/submodulemaster",
        element: withSuspense(Submodulecreation),
      },
      // Qualification Master
      {
        path: "setting/qualificationmaster",
        element: withSuspense(QualificationCreation),
      },
      // Company Master
      {
        path: "setting/companymaster",
        element: withSuspense(CompanyCreation),
      },
      // Role Master
      {
        path: "setting/rolemaster",
        element: withSuspense(RoleCreation),
      },
      // Status Master
      {
        path: "setting/statusmaster",
        element: withSuspense(StatusCreation),
      },
      // User Module Right Master
      {
        path: "setting/usermodulerightmaster",
        element: withSuspense(UserModuleRightCreation),
      },
      // User Right Master
      {
        path: "setting/userrightmaster",
        element: withSuspense(UserRightCreation),
      },
      {
        path: "*",
        element: withSuspense(WorkingPage),
      },
      {
        path: "setting/bankmaster",
        element: withSuspense(BankMaster),
      },
      {
        path: "setting/userreg",
        element: withSuspense(UserReg),
      },
    ],
  },
]);


const AppRoutes = () => {
  return <RouterProvider router={router} />;
};


export default AppRoutes;