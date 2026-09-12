import React, { useState } from "react";
import { Box, Typography } from "@mui/joy";
import DownloadIcon from "@mui/icons-material/Download";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";

const LegacySaleMaster = () => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDownloadTemplate = () => {

        const columns = [
            "customer_name",
            "mobile_number_1",
            "registration_number",
            "known_policy_expiry_date",

            "sale_date",
            "insurance_company",
            "policy_number",
            "renewal_cycle",
            "start_date",
            "expiry_date",
            "source",
            "premium_amount",
            "insured_declared_value",
            "paid_amount",
            "reminder_days",
            "renewal_year",
            "remarks"
        ];

        const worksheet = XLSX.utils.aoa_to_sheet([columns]);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Legacy Sales"
        );

        XLSX.writeFile(
            workbook,
            "legacy_sale_template.xlsx"
        );
    };


    const handleFileChange = (e) => {

        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        setFile(selectedFile);
    };


    const handleUpload = async () => {

        if (!file) {
            alert("Please select an Excel file.");
            return;
        }

        setLoading(true);

        try {

            const formData = new FormData();

            formData.append("file", file);

            // API call will come here
            // const response = await axioslogin.post(
            //     "/legacy-sale-import",
            //     formData
            // );

            console.log("Uploading:", file.name);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };


    return (
        <Box sx={{ p: 2 }}>

            <Typography
                level="h3"
                sx={{ mb: 0.5 }}>
                Legacy Sale Master
            </Typography>
            <Typography
                level="body-sm"
                sx={{ mb: 3, color: "neutral.500" }}>
                Upload previous customer sales using Excel.
            </Typography>

            {/* Download Template */}
            <Box
                sx={{
                    p: 2,
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                <Box>
                    <Typography level="title-sm">
                        Excel Template
                    </Typography>

                    <Typography
                        level="body-xs"
                        sx={{ color: "neutral.500" }}
                    >
                        Download the template and fill the legacy sale details.
                    </Typography>
                </Box>

                <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    style={{
                        border: "none",
                        borderRadius: "6px",
                        padding: "9px 14px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                    }}
                >
                    <DownloadIcon sx={{ fontSize: 18 }} />

                    Download Template
                </button>

            </Box>


            {/* File Upload */}

            <Box
                sx={{
                    p: 3,
                    border: "1px dashed #cbd5e1",
                    borderRadius: "10px",
                    textAlign: "center"
                }}
            >

                <CloudUploadIcon
                    sx={{
                        fontSize: 40,
                        color: "primary.500",
                        mb: 1
                    }}
                />

                <Typography level="title-sm">
                    Select Excel File
                </Typography>

                <Typography
                    level="body-xs"
                    sx={{
                        color: "neutral.500",
                        mb: 2
                    }}
                >
                    Only .xlsx or .xls files
                </Typography>


                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                />


                {file && (
                    <Typography
                        level="body-sm"
                        sx={{
                            mt: 2,
                            fontWeight: 600
                        }}
                    >
                        {file.name}
                    </Typography>
                )}

            </Box>


            {/* Upload Button */}

            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end"
                }}>

                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || loading}
                    style={{
                        border: "none",
                        borderRadius: "6px",
                        padding: "10px 18px",
                        cursor: file && !loading
                            ? "pointer"
                            : "not-allowed"
                    }}>
                    {loading
                        ? "Uploading..."
                        : "Upload Legacy Sales"
                    }
                </button>

            </Box>

        </Box>
    );
};

export default LegacySaleMaster;