
import React, { useCallback, useState } from "react";
import {
    Box,
    Paper,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";

import EditDocumentIcon from "@mui/icons-material/EditDocument";

import UploadBox from "../../Customers/CustomersComponents/UploadBox";
import UploadPreview from "../../Customers/CustomersComponents/UploadPreview";
import { axioslogin } from "../../Connection/axios";
import {
    errorNotify,
    getAuthUser,
    successNotify,
    warningNofity,
} from "../../constant/Constant";
import { useGetLeadFiles } from "../../CommonCode/useQuery";

const LeadVehicleUploads = ({ lead }) => {

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const colors = {
        border: isDark ? "#303b35" : "#e5ebe7",
        background: isDark ? "#171f1a" : "#ffffff",
        heading: isDark ? "#f1f5f2" : "#1e293b",
        muted: isDark ? "#9ca9a0" : "#64748b",
        primary: "#21834b",
        iconBg: isDark ? "rgba(33,131,75,0.16)" : "#edf7f0",
    };

    const authUser = getAuthUser();
    const { id } = authUser ?? {};
    const { lead_id } = lead ?? {};

    const [loading, setLoading] = useState(false);

    const [rcFiles, setRcFiles] = useState([]);
    const [quotationFiles, setQuotationFiles] = useState([]);
    const [otherFiles, setOtherFiles] = useState([]);

    const {
        data: LeadFiles = [],
        refetch: refetchLeadFiles,
        isLoading: LoadingLeadFiles,
    } = useGetLeadFiles(lead_id);

    const uploadedFiles = LeadFiles ?? {};

    const uploadedRC = uploadedFiles?.RC ?? [];
    const uploadedQuotation = uploadedFiles?.QUOTATION ?? [];
    const uploadedOther = uploadedFiles?.OTHER ?? [];

    const createFiles = (files) =>
        Array.from(files).map((file, index) => ({
            id: `${Date.now()}-${index}`,
            file,
            preview: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : null,
        }));

    const handleUpload = (e, setter) => {
        const files = createFiles(e.target.files);
        setter((prev) => [...prev, ...files]);
        e.target.value = "";
    };

    const resetAllFields = useCallback(() => {
        setRcFiles([]);
        setQuotationFiles([]);
        setOtherFiles([]);
    }, []);

    const uploadFiles = async (files, fileType) => {

        if (!files.length) {
            return warningNofity("Please select files.");
        }

        const formData = new FormData();

        files.forEach((item) => {
            formData.append("files", item.file);
        });

        formData.append("lead_id", lead_id);
        formData.append("file_type", fileType);
        formData.append("uploaded_by", id);

        try {
            setLoading(true);

            const { data } = await axioslogin.post(
                `/employee/upload-lead-document?lead_id=${lead_id}&file_type=${encodeURIComponent(fileType)}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const { success, message } = data;

            if (success !== 1) {
                return warningNofity(message);
            }

            successNotify(message);
            resetAllFields();
            refetchLeadFiles?.();

        } catch (err) {

            errorNotify(
                err.response?.data?.message ||
                "Error Uploading Files"
            );

        } finally {
            setLoading(false);
        }
    };

    const removeFile = async (item, setter) => {

        try {

            if (item.file_id) {

                const { data } = await axioslogin.delete(
                    `/employee/lead-document/${item.file_id}`
                );

                const { success, message } = data;

                if (success !== 1) {
                    return warningNofity(message);
                }

                successNotify(message);
                refetchLeadFiles?.();

                return;
            }

            setter((prev) => {

                const file = prev.find((x) => x.id === item.id);

                if (file?.preview) {
                    URL.revokeObjectURL(file.preview);
                }

                return prev.filter((x) => x.id !== item.id);

            });

        } catch (err) {

            errorNotify(
                err.response?.data?.message ||
                err.message ||
                "Unable to remove file."
            );

        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: "20px",
                border: `1px solid ${colors.border}`,
                background: colors.background,
                width: "100%",
                boxShadow: isDark
                    ? "none"
                    : "0 2px 12px rgba(15, 23, 42, 0.035)",
                transition: "background 0.2s ease",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2.5,
                }}
            >
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: colors.iconBg,
                        flexShrink: 0,
                    }}
                >
                    <EditDocumentIcon
                        sx={{
                            fontSize: 21,
                            color: colors.primary,
                        }}
                    />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: { xs: 14, sm: 16 },
                            fontWeight: 700,
                            color: colors.heading,
                            letterSpacing: "0.2px",
                            lineHeight: 1.4,
                        }}
                    >
                        Vehicle Documents
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 12,
                            color: colors.muted,
                            mt: 0.3,
                        }}
                    >
                        Upload and manage documents related to this lead
                    </Typography>
                </Box>
            </Box>

            <Stack spacing={2.5}>

                {/* RC Documents */}
                <Box>
                    <UploadBox
                        title="Registration Certificate (RC)"
                        subtitle="Upload the vehicle Registration Certificate (Smart Card or RC Book)."
                        multiple
                        loading={loading}
                        onChange={(e) => handleUpload(e, setRcFiles)}
                        onAdd={() => uploadFiles(rcFiles, "RC")}
                    />

                    <UploadPreview
                        LoadingPolicyFiles={LoadingLeadFiles}
                        files={[...uploadedRC, ...rcFiles]}
                        onRemove={(item) => removeFile(item, setRcFiles)}
                    />
                </Box>

                {/* Quotation Documents */}
                <Box>
                    <UploadBox
                        title="Quotation"
                        subtitle="Upload the insurance quotation received from the insurer or broker."
                        multiple
                        loading={loading}
                        onChange={(e) => handleUpload(e, setQuotationFiles)}
                        onAdd={() => uploadFiles(quotationFiles, "QUOTATION")}
                    />

                    <UploadPreview
                        LoadingPolicyFiles={LoadingLeadFiles}
                        files={[...uploadedQuotation, ...quotationFiles]}
                        onRemove={(item) => removeFile(item, setQuotationFiles)}
                    />
                </Box>

                {/* Other Documents */}
                <Box>
                    <UploadBox
                        title="Other Documents"
                        subtitle="Upload any additional supporting documents related to this lead."
                        multiple
                        loading={loading}
                        onChange={(e) => handleUpload(e, setOtherFiles)}
                        onAdd={() => uploadFiles(otherFiles, "OTHER")}
                    />

                    <UploadPreview
                        LoadingPolicyFiles={LoadingLeadFiles}
                        files={[...uploadedOther, ...otherFiles]}
                        onRemove={(item) => removeFile(item, setOtherFiles)}
                    />
                </Box>

            </Stack>
        </Paper>
    );
};

export default LeadVehicleUploads;
