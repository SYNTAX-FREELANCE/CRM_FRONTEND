import { useQuery } from "@tanstack/react-query";
import {
  FechCompanyMaster,
  FetchAllEmployeeMaster,
  FetchAllQualificationMaster,
  FetchRolemaster,
  FetchStatusMaster,
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

