// src/AppRoutes.js
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GlobalLoader from "./CommonComponents/GlobalLoader";
import ProtectedRoute from "./utils/Protected/ProtectedRoute";
import { useAuth } from "./Context/AuthContext";
import PublicRoute from "./utils/Protected/PublicRoute";

// Lazy imports
const Intro = lazy(() => import("./pages/Intro"));
const Login = lazy(() => import("./UserManagement/Login"));
const WorkingPage = lazy(() => import("./CommonComponents/WorkingPage"));
const RouteLayout = lazy(() => import("./utils/Protected/RouteLayout"));
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard"));
const Settings = lazy(() => import("./Settings/Settings"));
const BankMaster = lazy(() => import("./Masters/BankMaster/BankMaster"));
const UserReg = lazy(() => import("./Masters/UserRegistration/UserRegistration"));
const CommonViewPage = lazy(() => import("./Settings/CommonMasterComponent/CommonViewPage"),);

// Masters imports
const MenuCreation = lazy(() => import("./Masters/MenuMaster/MenuCreation"));
const UserCreation = lazy(() => import("./Masters/UserCreation/UserCreation"));
const UserInfo = lazy(() => import("./UserManagement/UserInfo"));


const ModuleCreation = lazy(
  () => import("./Masters/ModuleMaster/ModuleCreation"),
);
const Submodulecreation = lazy(
  () => import("./Masters/SubmoduleMaster/Submodulecreation"),
);
const QualificationCreation = lazy(
  () => import("./Masters/QualificationMaster/QualificationCreation"),
);
const CompanyCreation = lazy(
  () => import("./Masters/CompanyMaster/CompanyCreation"),
);
const RoleCreation = lazy(() => import("./Masters/RoleMaster/RoleCreation"));
const StatusCreation = lazy(
  () => import("./Masters/StatusCreation/StatusCreation"),
);
const LeadCreation = lazy(
  () => import("./Masters/LeadMaster/LeadCreation"),
);
const VehicleTypeCreation = lazy(
  () => import("./Masters/VehicleTypeMaster/VehicleTypeCreation"),
);
const InsuranceCompanyCreation = lazy(
  () => import("./Masters/InsuranceCompany/InsuranceCompanyCreation"),
);
// const UserModuleRightCreation = lazy(
//   () => import("./Masters/UserGroupMaster/UserModuleRightCreation"),
// );
const UserRightCreation = lazy(
  () => import("./Masters/UserRightMaster/UserRightCreation"),
);
const Uploadmaster = lazy(
  () => import("./Masters/ExcelUploadmaster/Uploadmaster"),
);


const withSuspense = (Component) => (
  <Suspense fallback={<GlobalLoader />}>
    <Component />
  </Suspense>
);

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(Intro),
    errorElement: <h1 className="text-center mt-10">Page Not Found</h1>,
  },
  {
    path: "/login",
    //  Wrap Login with PublicRoute (blocks if authenticated)
    element: <PublicRoute>{withSuspense(Login)}</PublicRoute>,
  },
  {
    path: "/home",
    element: <ProtectedRoute>{withSuspense(RouteLayout)}</ProtectedRoute>,
    errorElement: <h1 className="text-center mt-10">Page Not Found</h1>,
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
        element: withSuspense(MenuCreation),
      },
      {
        path: "setting/employeemaster",
        element: withSuspense(UserCreation),
      },
      {
        path: "setting/modulemaster",
        element: withSuspense(ModuleCreation),
      },
      {
        path: "setting/submodulemaster",
        element: withSuspense(Submodulecreation),
      },
      {
        path: "setting/qualificationmaster",
        element: withSuspense(QualificationCreation),
      },
      {
        path: "setting/companymaster",
        element: withSuspense(CompanyCreation),
      },
      {
        path: "setting/rolemaster",
        element: withSuspense(RoleCreation),
      },
      {
        path: "setting/statusmaster",
        element: withSuspense(StatusCreation),
      },
      {
        path: "setting/leadmaster",
        element: withSuspense(LeadCreation),
      },
      {
        path: "setting/vehicletypemaster",
        element: withSuspense(VehicleTypeCreation),
      },
      {
        path: "setting/insurancecompany",
        element: withSuspense(InsuranceCompanyCreation),
      },
      // {
      //   path: "setting/usermodulerightmaster",
      //   element: withSuspense(UserModuleRightCreation),
      // },
      {
        path: "setting/userrightmaster",
        element: withSuspense(UserRightCreation),
      },
      {
        path: "setting/commonview",
        element: withSuspense(CommonViewPage),
      },
      {
        path: "setting/bankmaster",
        element: withSuspense(BankMaster),
      },
      {
        path: "setting/userreg",
        element: withSuspense(UserReg),
      },
      {
        path: "userinfo",
        element: withSuspense(UserInfo),
      },
      {
        path: "setting/Uploadmaster",
        element: withSuspense(Uploadmaster),
      },
      {
        path: "setting/uploadmaster",
        element: withSuspense(Uploadmaster),
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
