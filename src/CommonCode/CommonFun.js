import { axiosApi } from "../Axios/axios";

export const FetchAllAluminiDetail = async () => {
  try {
    const response = await axiosApi.get("/training/alumini/fetchall");
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
