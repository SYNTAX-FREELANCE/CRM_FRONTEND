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

