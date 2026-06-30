import { useQuery } from "@tanstack/react-query";
import {
  FechCompanyMaster,
  FetchAllEmployeeMaster,
  FetchAllQualificationMaster,
  FetchRolemaster,
  FetchStatusMaster,
  FetchAllModuleMaster,
  FetchAllSubmoduleMaster,
  FetchAllMenuMaster,
  FetchLeadMaster,
  FetchVehicleTypeMaster,
  FetchInsuranceCompanyMaster,
  FetchAllCustomers,
  FetchAllVehicles,
  FetchNewCustomer,
  getFreshCalls,
  getMyActiveCalls,
  getCallFollowUp,
  getLeadCallHistory,
  getDashboardCounts,
  getDashboardReminders,
} from "./CommonFun";

export const useRoleMaster = () => {
  return useQuery({
    queryKey: ["role-master"],
    queryFn: FetchRolemaster,
    staleTime: Infinity, // optional (5 min cache)
  });
};

export const useCompanyMaster = () => {
  return useQuery({
    queryKey: ["company-master"],
    queryFn: FechCompanyMaster,
    staleTime: Infinity, // optional (5 min cache)
  });
};

export const useStatusMaster = () => {
  return useQuery({
    queryKey: ["status-master"],
    queryFn: FetchStatusMaster,
    staleTime: Infinity, // optional (5 min cache)
  });
};

export const useQualificationMaster = () => {
  return useQuery({
    queryKey: ["quali-mast"],
    queryFn: FetchAllQualificationMaster,
    staleTime: Infinity, // optional (5 min cache)
  });
};

export const useEmployeeMaster = () => {
  return useQuery({
    queryKey: ["employee-master"],
    queryFn: FetchAllEmployeeMaster,
    staleTime: Infinity, // optional (5 min cache)
  });
};

export const useModuleMaster = () => {
  return useQuery({
    queryKey: ["module-master"],
    queryFn: FetchAllModuleMaster,
    staleTime: Infinity,
  });
};

export const useSubmoduleMaster = () => {
  return useQuery({
    queryKey: ["submodule-master"],
    queryFn: FetchAllSubmoduleMaster,
    staleTime: Infinity,
  });
};

export const useMenuMaster = () => {
  return useQuery({
    queryKey: ["menu-master"],
    queryFn: FetchAllMenuMaster,
    staleTime: Infinity,
  });
};

export const useLeadMaster = () => {
  return useQuery({
    queryKey: ["lead-master"],
    queryFn: FetchLeadMaster,
  });
};
export const useCustomerMaster = () => {
  return useQuery({
    queryKey: ["customer-master"],
    queryFn: FetchAllCustomers,
    staleTime: Infinity,
  });
};

export const useVehicleTypeMaster = () => {
  return useQuery({
    queryKey: ["vehicle-type-master"],
    queryFn: FetchVehicleTypeMaster,
    staleTime: Infinity,
  });
};

export const useInsuranceCompanyMaster = () => {
  return useQuery({
    queryKey: ["insurance-company-master"],
    queryFn: FetchInsuranceCompanyMaster,
  });
};
export const useVehicleMaster = () => {
  return useQuery({
    queryKey: ["vehicle-master"],
    queryFn: FetchAllVehicles,
    staleTime: Infinity,
  });
};

export const useNewCustomers = (month) => {
  return useQuery({
    queryKey: ["new-customer", month],
    queryFn: () => FetchNewCustomer(month),
    staleTime: 0,
    enabled: !!month,
  });
};

export const useFectchFreshCalls = (empid) => {
  return useQuery({
    queryKey: ["freshcalls", empid],
    queryFn: () => getFreshCalls(empid),
    staleTime: Infinity,
    enabled: !!empid,
    refetchOnWindowFocus: false,
  });
};


export const useFetchDashBoardCounts = (empid) => {
  return useQuery({
    queryKey: ["emp-dashbordcount", empid],
    queryFn: () => getDashboardCounts(empid),
    staleTime: Infinity,
    enabled: !!empid
  });
};


export const useFetchDashBoardReminders = (empid) => {
  return useQuery({
    queryKey: ["emp-reminders", empid],
    queryFn: () => getDashboardReminders(empid),
    enabled: !!empid,
    //  keeps data "fresh for a while"
    staleTime: 60 * 1000, // 1 minute
    //  refresh when user comes back
    refetchOnWindowFocus: true,
    //  avoid unnecessary refetch loops
    refetchOnMount: false,
    refetchOnReconnect: false
  });
};


export const useGetMyActiveCalls = (empid, statusFilter) => {
  return useQuery({
    queryKey: ["mycalls", empid, statusFilter],
    queryFn: () => getMyActiveCalls(empid, statusFilter),
    staleTime: 0,
    enabled: !!empid && !!statusFilter,
    refetchOnWindowFocus: false,
  });
};




export const useGetLeadHistory = (leadId, enabled) => {
  return useQuery({
    queryKey: ["call-history", leadId],
    queryFn: () => getLeadCallHistory(leadId),
    enabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};
export const useFollowUpDetail = (leadId, statusId, enabled) => {
  return useQuery({
    queryKey: ["call-followup", leadId, statusId],
    queryFn: () => getCallFollowUp(leadId, statusId),
    enabled,
    staleTime: 0,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};