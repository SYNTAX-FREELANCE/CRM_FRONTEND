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
}
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
}
export const useVehicleMaster = () => {
  return useQuery({
    queryKey: ["vehicle-master"],
    queryFn: FetchAllVehicles,
    staleTime: Infinity,
  });
};


export const useNewCustomers = (month) => {
  return useQuery({
    queryKey: ["new-customer",month],
    queryFn: ()=>FetchNewCustomer(month),
    staleTime: Infinity,
    enabled:!!month
  });
};

