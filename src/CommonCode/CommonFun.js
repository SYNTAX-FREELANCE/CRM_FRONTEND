import { axioslogin } from "../Axios/axios";
import { infoNotify } from "../constant/Constant";

export const FetchRolemaster = async () => {
  try {
    const response = await axioslogin.get("/rolemast/getall");
    const { success, data } = response.data;
    //  Record exist
    if (success !== 0) return data;
    //  No Record found
    return [];
  } catch (error) {
    console.error("FetchExistingPdf error:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch PDFs");
  }
};

export const FechCompanyMaster = async () => {
  try {
    const response = await axioslogin.get("/companimast/getall");
    const { success, data } = response.data;
    //  Record exist
    if (success !== 0) return data;
    //  No Record found
    return [];
  } catch (error) {
    console.error("FetchExistingPdf error:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch PDFs");
  }
};

export const FetchStatusMaster = async () => {
  try {
    const response = await axioslogin.get("/statusmast/getall");
    const { success, data } = response.data;
    //  Record exist
    if (success !== 0) return data;
    //  No Record found
    return [];
  } catch (error) {
    console.error("FetchExistingPdf error:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch PDFs");
  }
};

export const FetchAllQualificationMaster = async () => {
  try {
    const response = await axioslogin.get("/qualimast/getall");
    const { success, data } = response.data;
    //  Record exist
    if (success !== 0) return data;
    //  No Record found
    return [];
  } catch (error) {
    console.error("FetchExistingPdf error:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch PDFs");
  }
};

export const FetchAllEmployeeMaster = async () => {
  try {
    const response = await axioslogin.get("/employee/getall");
    const { success, data } = response.data;
    //  Record exist
    if (success !== 0) return data;
    //  No Record found
    return [];
  } catch (error) {
    console.error("FetchExistingPdf error:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch PDFs");
  }
};

export const FetchAllModuleMaster = async () => {
  try {
    const response = await axioslogin.get("/modulemast/getall");
    const { success, data } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("FetchAllModuleMaster error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch modules",
    );
  }
};

export const FetchAllSubmoduleMaster = async () => {
  try {
    const response = await axioslogin.get("/submodulemast/getall");
    const { success, data } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("FetchAllSubmoduleMaster error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch submodules",
    );
  }
};

export const FetchAllMenuMaster = async () => {
  try {
    const response = await axioslogin.get("/menumaster/getall");
    const { success, data } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("FetchAllMenuMaster error:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch menus");
  }
};

export const FetchLeadMaster = async () => {
  try {
    const response = await axioslogin.get("/leadmast/getall");
    const { success, data } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("FetchLeadMaster error:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch leads");
  }
};

export const FetchAllCustomers = async () => {
  try {
    const response = await axioslogin.get("/customer/getall");
    const { success, data } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("FetchAllCustomers error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch customers",
    );
  }
};

export const FetchVehicleTypeMaster = async () => {
  try {
    const response = await axioslogin.get("/vehicletype/getall");
    const { success, data } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("FetchVehicleTypeMaster error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch vehicle types",
    );
  }
};

export const FetchAllVehicles = async () => {
  try {
    const response = await axioslogin.get("/customer/getall-vehicles");
    const { success, data } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("FetchAllVehicles error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch vehicles",
    );
  }
};

export const FetchNewCustomer = async (month) => {
  try {
    const response = await axioslogin.get(`/customer/new-customer/${month}`);
    const { success, data } = response.data;

    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("FetchAllVehicles error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch vehicles",
    );
  }
};

export const getFreshCalls = async (empid) => {
  if (!empid) return [];
  try {
    const response = await axioslogin.get(`/lead/get-fresh-lead/${empid}`);
    const { success, data, message } = response.data;
    if (success === 0) {
      infoNotify(message);
      return [];
    }
    if (success !== 0) {
      infoNotify(message);
      return data;
    }
    return [];
  } catch (error) {
    console.error("FetchAllVehicles error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch vehicles",
    );
  }
};


export const getDashboardCounts = async (empid) => {
  if (!empid) return [];
  try {
    const response = await axioslogin.get(`/lead/get-dashboard-count/${empid}`);
    const { success, data, message } = response.data;
    if (success !== 1) return [];
    return data ?? [];
  } catch (error) {
    console.error("FetchAllVehicles error:", error);
  }
};

export const getDashboardReminders = async (empid) => {
  if (!empid) return [];
  try {
    const response = await axioslogin.get(`/lead/dashboard-reminders/${empid}`);
    const { success, data, message } = response.data;
    if (success !== 1) return [];
    return data ?? [];
  } catch (error) {
    console.error("FetchAllVehicles error:", error);
  }
};


export const getMyActiveCalls = async (empid, filter) => {
  if (!empid) return [];
  try {
    const response = await axioslogin.get(
      `/lead/get-active-batch/${empid}/${filter}`,
    );
    const { success, data, message } = response.data;
    if (success !== 0) return data;

    return [];
  } catch (error) {
    console.error("getMyActiveCalls error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch vehicles",
    );
  }
};

export const getAdminDashboardCount = async (from, to) => {
  console.log({
    from, to
  });

  if (!from || !to) return [];
  try {
    const response = await axioslogin.post(
      `/lead/admin-count`, {
      from: from,
      to: to
    },
    );
    const { success, data, message } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("getMyActiveCalls error:", error);
  }
};


export const getCallFollowUp = async (leadid, statusId) => {
  if (!leadid || !statusId) return [];
  try {
    const response = await axioslogin.get(
      `/lead/get-call-followup/${leadid}/${statusId}`,
    );
    const { success, data, message } = response.data;
    if (success !== 0) return data;

    return [];
  } catch (error) {
    console.error("getMyActiveCalls error:", error);
  }
};


export const getLeadCallHistory = async (leadid) => {
  if (!leadid) return [];
  try {
    const response = await axioslogin.get(`/lead/get-lead-history/${leadid}`);
    const { success, data, message } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("getMyActiveCalls error:", error);
  }
};

export const getRecentActivity = async () => {
  try {
    const response = await axioslogin.get(`/lead/employee-recent-activity`);
    const { success, data, message } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("getMyActiveCalls error:", error);
  }
};




export const FetchInsuranceCompanyMaster = async () => {
  try {
    const response = await axioslogin.get("/insurancecompany/getall");
    const { success, data } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("FetchInsuranceCompanyMaster error:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch insurance companies",
    );
  }
};

export const FetchEmployeeProfile = async (employeeId) => {
  if (!employeeId) return null;
  try {
    const response = await axioslogin.get("/userinfo/employees");
    if (response.data && response.data.success === 1) {
      const list = response.data.data || [];
      const found = list.find((e) => String(e.user_id) === String(employeeId));
      if (found) return found;
    }
    return null;
  } catch (error) {
    console.error("FetchEmployeeProfile error:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch employee profile");
  }
};

export const FetchEmployeePerformance = async (employeeId) => {
  if (!employeeId) return null;
  try {
    const response = await axioslogin.get(`/userinfo/performance/${employeeId}?range=monthly`);
    if (response.data && response.data.success === 1) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("FetchEmployeePerformance error:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch employee performance");
  }
};

export const getAttendanceByDate = async (userId, date) => {
  if (!userId || !date) return null;
  try {
    const response = await axioslogin.get(`/userinfo/attendance?userId=${userId}&date=${date}`);
    const { success, data } = response.data;
    if (success === 1) return data;
    return null;
  } catch (error) {
    console.error("getAttendanceByDate error:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch attendance details");
  }
};
