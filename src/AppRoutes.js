// src/AppRoutes.js
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GlobalLoader from "./CommonComponents/GlobalLoader";
import ProtectedRoute from "./utils/Protected/ProtectedRoute";
import PublicRoute from "./utils/Protected/PublicRoute";
import ErrorBoundaryPage from "./pages/ErrorBoundaryPage";

// Lazy imports
const Intro = lazy(() => import("./pages/Intro"));
const Login = lazy(() => import("./UserManagement/Login"));
const NotFoundPage = lazy(() => import("./CommonComponents/NotFoundPage"));
const RouteLayout = lazy(() => import("./utils/Protected/RouteLayout"));
const Settings = lazy(() => import("./Settings/Settings"));
const BankMaster = lazy(() => import("./Masters/BankMaster/BankMaster"));
const UserReg = lazy(
  () => import("./Masters/UserRegistration/UserRegistration"),
);
const CommonViewPage = lazy(
  () => import("./Settings/CommonMasterComponent/CommonViewPage"),
);
const FreshCallsWorkspace = lazy(
  () => import("./FreshCall/FreshCallsWorkspace"),
);
const CustomerAllocation = lazy(
  () => import("./DataDistribution/CustomerAllocation"),
);

// const EmployeeDashboard = lazy(() => import("./Employee/EmployeeDashboard"));

const CustomerSearchPage = lazy(() => import("./pages/CustomerSearchPage"));

const ViewAllocation = lazy(() => import("./DataDistribution/ViewAllocation"));

const EmployeeBatchDetail = lazy(
  () => import("./EmployeeBatchControl/EmployeeBatchDetail"),
);
const EmployeeBatchControl = lazy(
  () => import("./EmployeeBatchControl/EmployeeBatchControl"),
);

const MyProfilePage = lazy(() => import("./MyProfile/MyProfilePage"));

const HomePage = lazy(() => import("./pages/HomePage"));

const ReportSetting = lazy(() => import("./Reports/ReportSetting"));

const ForgetPassword = lazy(() => import("./UserManagement/ForgetPassword"));

// Masters imports
const MenuCreation = lazy(() => import("./Masters/MenuMaster/MenuCreation"));
const UserCreation = lazy(() => import("./Masters/UserCreation/UserCreation"));
const UserInfo = lazy(() => import("./UserInfo/UserInfo"));
const EmployeeDetails = lazy(() => import("./UserInfo/EmployeeDetails"));
const MyCustomers = lazy(() => import("./Customers/MyCustomers"));
const CustomerDetail = lazy(() => import("./Customers/CustomerDetail"));
const PolicyUploadDetails = lazy(
  () => import("./Customers/PolicyUploadDetails"),
);
const EmployeeTargetCreation = lazy(
  () => import("./Masters/TargetMaster/EmployeeTargetCreation"),
);

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
const LeadCreation = lazy(() => import("./Masters/LeadMaster/LeadCreation"));
const VehicleTypeCreation = lazy(
  () => import("./Masters/VehicleTypeMaster/VehicleTypeCreation"),
);
const InsuranceCompanyCreation = lazy(
  () => import("./Masters/InsuranceCompany/InsuranceCompanyCreation"),
);
const UserModuleRightMaster = lazy(
  () => import("./Masters/UserModuleRights/UserModuleRightMaster"),
);
const UserRightCreation = lazy(
  () => import("./Masters/UserRightMaster/UserRightCreation"),
);
const Uploadmaster = lazy(
  () => import("./Masters/ExcelUploadmaster/Uploadmaster"),
);
const RenewalUploads = lazy(
  () => import("./Masters/ExcelUploadmaster/RenewalUploads"),
);
const CustomerCreation = lazy(
  () => import("./Masters/CustomerMaster/CustomerCreation"),
);
const VehicleCreation = lazy(
  () => import("./Masters/VehicleMaster/VehicleCreation"),
);
const PolicyReport = lazy(() => import("./Reports/PolicyReport"));

const EmployeePerformanceReport = lazy(
  () => import("./Reports/EmployeePreformanceReport"),
);
const AllEmployeePerformanceReport = lazy(
  () => import("./Reports/AllEmployeePerformanceReport"),
);
const EmployeeLoginReport = lazy(() => import("./Reports/UserLogReports"));
const DetailedEmployeeLoginReport = lazy(
  () => import("./Reports/DetailedUserLogReports"),
);
const CallOutcomeCreation = lazy(
  () => import("./Masters/CallOutComeMaster/CallOutcomeCreation"),
);

const OutcomeStatusMappingCreation = lazy(
  () => import("./Masters/CallOutcomeMapMaster/OutcomeStatusMappingCreation"),
);

const FullLeadDetailUpadate = lazy(
  () => import("../src/LegacySale/FullLeadDetailUpadate"),
);

const PolicySourceCreation = lazy(
  () => import("../src/Masters/SourceMaster/PolicySourceCreation"),
);
const LegacySaleMaster = lazy(
  () => import("../src/Masters/LegacySaleUploadMaster/LegacySaleMaster"),
);
const EmployeeLevelMaster = lazy(
  () => import("../src/Masters/EmployeeLevelMaster/EmployeeLevelMaster"),
);

const IncentiveSchemeMaster = lazy(
  () => import("../src/Masters/IncentiveSchemeMaster/IncentiveSchemeMaster"),
);
const Incentiveschemaslab = lazy(
  () => import("../src/Masters/IncentiveSchemaSlab/Incentiveschemaslab"),
);

const CustomerPayTypeMaster = lazy(
  () => import("../src/Masters/CustomerPayTypeMaster/CustomerPayTypeMaster"),
);
const PaymentMethodMaster = lazy(
  () => import("../src/Masters/PaymentMethodMaster/PaymentMethodMaster"),
);
const LeadTransfer = lazy(() => import("../src/LeadTransfer/LeadTransfer"));

const MotorVehicleCategoryCreation = lazy(
  () => import("../src/Masters/MotorCalculator/MotorVehicleCategoryCreation"),
);

const MotorVehicleClassCreation = lazy(
  () => import("../src/Masters/MotorCalculator/MotorVehicleClassCreation"),
);
const MotorFuelTypeCreation = lazy(
  () => import("../src/Masters/MotorCalculator/MotorFuelTypeCreation"),
);
const MotorVehicleUsageCreation = lazy(
  () => import("../src/Masters/MotorCalculator/MotorVehicleUsageCreation"),
);
const MotorEngineCCSlabCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorEngineCCSlabCreation"),
);
const MotorGVWSlabCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorGVWSlabCreation"),
);
const MotorProductCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorProductCreation"),
);
const MotorPolicyTypeCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorPolicyTypeCreation"),
);
const MotorBusinessTypeCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorBusinessTypeCreation"),
);
const MotorPolicyTermCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorPolicyTermCreation"),
);
const MotorOdRateCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorOdRateCreation"),
);
const MotorOdAgeSlabCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorOdAgeSlabCreation"),
);
const MotorOdDepreciationCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorOdDepreciationCreation"),
);
const MotorTpRateCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorTpRateCreation"),
);
const MotorTpRateSlabCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorTpRateSlabCreation"),
);
const MotorNcbRuleCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorNcbRuleCreation"),
);
const MotorNcbClaimRuleCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorNcbClaimRuleCreation"),
);
const MotorDiscountRuleCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorDiscountRuleCreation"),
);
const MotorDiscountConditionCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorDiscountConditionCreation"),
);
const MotorZdRateCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorZdRateCreation"),
);
const MotorAddonCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorAddonCreation"),
);
const MotorAddonRuleCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorAddonRuleCreation"),
);
const MotorAddonConditionCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorAddonConditionCreation"),
);
const MotorCoverCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorCoverCreation"),
);
const MotorCoverRateCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorCoverRateCreation"),
);
const MotorCoverUnitRateCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorCoverUnitRateCreation"),
);
const MotorCommissionRuleCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorCommissionRuleCreation"),
);
const MotorCashbackRuleCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorCashbackRuleCreation"),
);
const MotorTaxCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorTaxCreation"),
);

const MotorCalculatorContainer = lazy(
  () => import("./MotorCalculator/MotorCalculatorContainer"),
);

const MotorVehicleCalculator = lazy(
  () => import("./MotorCalculator/MotorVehicleCalculator"),
);

const MotorVehicleInputFieldCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorVehicleInputFieldCreation"),
);

const MotorOdRateSlabCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorOdRateSlabCreation"),
);

const MotorTaxRuleCreation = lazy(
  () => import("./Masters/MotorCalculator/MotorTaxRuleCreation"),
);

const ThejaswiPreview = lazy(
  () => import("./MotorCalculator/MotorCalculatorComponent/ThejaswiPreview"),
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
    element: <Intro />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/login",
    //  Wrap Login with PublicRoute (blocks if authenticated)
    element: <PublicRoute>{withSuspense(Login)}</PublicRoute>,
  },

  {
    path: "/forget-password",
    //  Wrap Login with PublicRoute (blocks if authenticated)
    element: <PublicRoute>{withSuspense(ForgetPassword)}</PublicRoute>,
  },

  {
    path: "/home",
    element: <ProtectedRoute>{withSuspense(RouteLayout)}</ProtectedRoute>,
    errorElement: <ErrorBoundaryPage />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: "batchcontrol",
        element: withSuspense(EmployeeBatchControl),
      },
      {
        path: "batchcontrol/:empid",
        element: withSuspense(EmployeeBatchDetail),
      },
      {
        path: "customer/:customerid",
        element: withSuspense(CustomerDetail),
      },
      {
        path: "customer/:customerid/policy/:policyid",
        element: withSuspense(PolicyUploadDetails),
      },
      {
        path: "settings",
        element: withSuspense(Settings),
      },
      {
        path: "freshcalls",
        element: withSuspense(FreshCallsWorkspace),
      },
      {
        path: "mycustomer",
        element: withSuspense(MyCustomers),
      },
      {
        path: "allocation",
        element: withSuspense(CustomerAllocation),
      },
      {
        path: "view-allocation",
        element: withSuspense(ViewAllocation),
      },
      {
        path: "my-profile",
        element: withSuspense(MyProfilePage),
      },
      {
        path: "search",
        element: withSuspense(CustomerSearchPage),
      },
      {
        path: "reports",
        element: withSuspense(ReportSetting),
      },
      {
        path: "legacy",
        element: withSuspense(FullLeadDetailUpadate),
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
        path: "setting/policysource",
        element: withSuspense(PolicySourceCreation),
      },

      {
        path: "setting/vehicletypemaster",
        element: withSuspense(VehicleTypeCreation),
      },
      {
        path: "setting/insurancecompany",
        element: withSuspense(InsuranceCompanyCreation),
      },
      {
        path: "setting/usermodulerightmaster",
        element: withSuspense(UserModuleRightMaster),
      },
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
        path: "userinfo/:employeeId",
        element: withSuspense(EmployeeDetails),
      },
      {
        path: "setting/Uploadmaster",
        element: withSuspense(Uploadmaster),
      },
      {
        path: "setting/renewalupload",
        element: withSuspense(RenewalUploads),
      },
      {
        path: "setting/uploadmaster",
        element: withSuspense(Uploadmaster),
      },
      {
        path: "setting/customermaster",
        element: withSuspense(CustomerCreation),
      },
      {
        path: "setting/vehiclemaster",
        element: withSuspense(VehicleCreation),
      },
      {
        path: "reports/policyreport",
        element: withSuspense(PolicyReport),
      },
      {
        path: "reports/employeperformance",
        element: withSuspense(EmployeePerformanceReport),
      },
      {
        path: "reports/allemployeeperformance",
        element: withSuspense(AllEmployeePerformanceReport),
      },
      {
        path: "reports/UserLogReports",
        element: withSuspense(EmployeeLoginReport),
      },
      {
        path: "reports/DetailedUserLogReports",
        element: withSuspense(DetailedEmployeeLoginReport),
      },
      {
        path: "setting/targetmaster",
        element: withSuspense(EmployeeTargetCreation),
      },
      {
        path: "setting/calloutcome",
        element: withSuspense(CallOutcomeCreation),
      },
      {
        path: "setting/outcomemapmaster",
        element: withSuspense(OutcomeStatusMappingCreation),
      },
      {
        path: "setting/legacysalemaster",
        element: withSuspense(LegacySaleMaster),
      },
      {
        path: "setting/employeelevel",
        element: withSuspense(EmployeeLevelMaster),
      },
      {
        path: "setting/incentiveschema",
        element: withSuspense(IncentiveSchemeMaster),
      },
      {
        path: "setting/incentiveschemaslab",
        element: withSuspense(Incentiveschemaslab),
      },
      {
        path: "setting/customerpaytype",
        element: withSuspense(CustomerPayTypeMaster),
      },
      {
        path: "setting/paymentmethod",
        element: withSuspense(PaymentMethodMaster),
      },
      {
        path: "transfer",
        element: withSuspense(LeadTransfer),
      },
      {
        path: "setting/motorvehiclecategory",
        element: withSuspense(MotorVehicleCategoryCreation),
      },
      {
        path: "setting/motorvehicleclass",
        element: withSuspense(MotorVehicleClassCreation),
      },
      {
        path: "setting/motorfueltype",
        element: withSuspense(MotorFuelTypeCreation),
      },
      {
        path: "setting/motorvehicleusage",
        element: withSuspense(MotorVehicleUsageCreation),
      },
      {
        path: "setting/motorengineccslab",
        element: withSuspense(MotorEngineCCSlabCreation),
      },
      {
        path: "setting/motorgvwslab",
        element: withSuspense(MotorGVWSlabCreation),
      },
      {
        path: "setting/motorproduct",
        element: withSuspense(MotorProductCreation),
      },
      {
        path: "setting/motorpolicytype",
        element: withSuspense(MotorPolicyTypeCreation),
      },
      {
        path: "setting/motorbusinesstype",
        element: withSuspense(MotorBusinessTypeCreation),
      },

      {
        path: "setting/motorpolicyterm",
        element: withSuspense(MotorPolicyTermCreation),
      },
      {
        path: "setting/motorodrate",
        element: withSuspense(MotorOdRateCreation),
      },
      {
        path: "setting/motorodageslab",
        element: withSuspense(MotorOdAgeSlabCreation),
      },
      {
        path: "setting/motoroddepreciation",
        element: withSuspense(MotorOdDepreciationCreation),
      },
      {
        path: "setting/mortprate",
        element: withSuspense(MotorTpRateCreation),
      },
      {
        path: "setting/motortprateslab",
        element: withSuspense(MotorTpRateSlabCreation),
      },
      {
        path: "setting/motorncbrule",
        element: withSuspense(MotorNcbRuleCreation),
      },
      {
        path: "setting/motorncbclaimrule",
        element: withSuspense(MotorNcbClaimRuleCreation),
      },
      {
        path: "setting/motordiscountrule",
        element: withSuspense(MotorDiscountRuleCreation),
      },

      {
        path: "setting/motordiscountcondition",
        element: withSuspense(MotorDiscountConditionCreation),
      },

      {
        path: "setting/motorzdrate",
        element: withSuspense(MotorZdRateCreation),
      },

      {
        path: "setting/motoraddon",
        element: withSuspense(MotorAddonCreation),
      },
      {
        path: "setting/motoraddonrule",
        element: withSuspense(MotorAddonRuleCreation),
      },
      {
        path: "setting/motoraddoncondition",
        element: withSuspense(MotorAddonConditionCreation),
      },
      {
        path: "setting/motorcover",
        element: withSuspense(MotorCoverCreation),
      },

      {
        path: "setting/motorcoverrate",
        element: withSuspense(MotorCoverRateCreation),
      },
      {
        path: "setting/motorcoverunitrate",
        element: withSuspense(MotorCoverUnitRateCreation),
      },
      {
        path: "setting/motorcommissionrule",
        element: withSuspense(MotorCommissionRuleCreation),
      },
      {
        path: "setting/motorcashbackrule",
        element: withSuspense(MotorCashbackRuleCreation),
      },
      {
        path: "setting/motortax",
        element: withSuspense(MotorTaxCreation),
      },
      {
        path: "calculator",
        element: withSuspense(MotorCalculatorContainer),
      },
      {
        path: "motor-calculator/category/:categoryId",
        element: withSuspense(MotorVehicleCalculator),
      },
      {
        path: "setting/motorvehicleinputfield",
        element: withSuspense(MotorVehicleInputFieldCreation),
      },
      {
        path: "setting/motorodrateslab",
        element: withSuspense(MotorOdRateSlabCreation),
      },
      {
        path: "setting/motortaxrule",
        element: withSuspense(MotorTaxRuleCreation),
      },

  {
        path: "motor-calculator/category/preview",
        element: withSuspense(ThejaswiPreview),
      },
      

      // {
      //   path: "*",
      //   element: withSuspense(NotFoundPage),
      // },
    ],
  },
  {
    path: "/notfound",
    element: withSuspense(NotFoundPage),
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
