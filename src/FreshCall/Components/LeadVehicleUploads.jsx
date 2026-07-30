import React, { useState } from "react";
import {
    Box,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import EditDocumentIcon from "@mui/icons-material/EditDocument";

import UploadBox from "./UploadBox";
import UploadPreview from "./UploadPreview";

const LeadVehicleUploads = () => {

    // Theme (replace with your own theme/colors)
    const themeColors = {
        border: "#e5e7eb",
        textDark: "#111827",
    };

    // Upload loading state
    const loading = false;
    const LoadingPolicyFiles = false;

    // Selected files
    const [rcFiles, setRcFiles] = useState([]);
    const [policyFiles, setPolicyFiles] = useState([]);
    const [kycFiles, setKycFiles] = useState([]);
    const [vehicleImages, setVehicleImages] = useState([]);

    // Already uploaded files (replace with API data)
    const uploadedRC = [];
    const uploadedPolicy = [];
    const uploadedKYC = [];
    const uploadedVehicle = [];

    // ===========================
    // Add your existing functions here
    // ===========================

    const handleUpload = (e, setFiles) => {
        // Paste your existing handleUpload function
    };

    const uploadFiles = (files, fileType) => {
        // Paste your existing uploadFiles function
    };

    const removeFile = (item, setFiles) => {
        // Paste your existing removeFile function
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                border: `1px solid ${themeColors.border}`,
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <EditDocumentIcon sx={{ color: "#fb3e05" }} />

                <Typography
                    sx={{
                        fontSize: { xs: 15, sm: 20 },
                        fontWeight: 600,
                        color: themeColors.textDark,
                    }}
                >
                    LEAD VEHICLE DOCUMENT UPLOADS
                </Typography>
            </Box>

            <Stack spacing={2}>
                <UploadBox
                    title="Registration Certificate (RC)"
                    subtitle="Upload the vehicle Registration Certificate (Smart Card or RC Book)."
                    multiple
                    loading={loading}
                    onChange={(e) => handleUpload(e, setRcFiles)}
                    onAdd={() => uploadFiles(rcFiles, "RC")}
                />

                <UploadPreview
                    LoadingPolicyFiles={LoadingPolicyFiles}
                    files={[...(uploadedRC ?? []), ...rcFiles]}
                    onRemove={(item) => removeFile(item, setRcFiles)}
                />

                <UploadBox
                    title="Previous Insurance Policy"
                    subtitle="Upload the latest insurance policy document for renewal verification."
                    multiple
                    loading={loading}
                    onChange={(e) => handleUpload(e, setPolicyFiles)}
                    onAdd={() => uploadFiles(policyFiles, "PREVIOUS_POLICY")}
                />

                <UploadPreview
                    LoadingPolicyFiles={LoadingPolicyFiles}
                    files={[...(uploadedPolicy ?? []), ...policyFiles]}
                    onRemove={(item) => removeFile(item, setPolicyFiles)}
                />

                <UploadBox
                    title="Customer KYC Documents"
                    subtitle="Upload Aadhaar Card, PAN Card, Driving Licence, Passport or other valid identity/address proof."
                    multiple
                    loading={loading}
                    onChange={(e) => handleUpload(e, setKycFiles)}
                    onAdd={() => uploadFiles(kycFiles, "KYC")}
                />

                <UploadPreview
                    LoadingPolicyFiles={LoadingPolicyFiles}
                    files={[...(uploadedKYC ?? []), ...kycFiles]}
                    onRemove={(item) => removeFile(item, setKycFiles)}
                />

                <UploadBox
                    title="Vehicle Inspection Images"
                    subtitle="Upload clear photos of the Front, Rear, Left Side, Right Side and any existing damages if applicable."
                    multiple
                    loading={loading}
                    onChange={(e) => handleUpload(e, setVehicleImages)}
                    onAdd={() => uploadFiles(vehicleImages, "VEHICLE_IMAGE")}
                />

                <UploadPreview
                    LoadingPolicyFiles={LoadingPolicyFiles}
                    files={[...(uploadedVehicle ?? []), ...vehicleImages]}
                    onRemove={(item) => removeFile(item, setVehicleImages)}
                />
            </Stack>
        </Paper>
    );
};

export default LeadVehicleUploads;