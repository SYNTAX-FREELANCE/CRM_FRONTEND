import {  axioslogin } from "../Axios/axios";


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
    throw new Error(error?.response?.data?.message || "Failed to fetch modules");
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
    throw new Error(error?.response?.data?.message || "Failed to fetch submodules");
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

export const FetchAllCustomers = async () => {
  try {
    const response = await axioslogin.get("/customer/getall");
    const { success, data } = response.data;
    if (success !== 0) return data;
    return [];
  } catch (error) {
    console.error("FetchAllCustomers error:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch customers");
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
    throw new Error(error?.response?.data?.message || "Failed to fetch vehicles");
  }
};




