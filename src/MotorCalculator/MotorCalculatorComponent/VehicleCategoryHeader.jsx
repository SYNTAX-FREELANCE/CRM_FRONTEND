import React from "react";
import {
    Box,
    Button,
    MenuItem,
    Paper,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { BACKEND_IMAGE } from "../../constant/Static";

const VehicleCategoryHeader = ({
    category,
    categoryId,
    formData,
    handleChange,
    ActiveInsuranceCompanies = [],
    selectSx,
    handleContinue,
    calculationLoading
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const imageUrl = category?.image_path
        ? `${BACKEND_IMAGE}${category.image_path}`
        : null;

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 2,
                px: 2,
                py: 1.5,
                borderRadius: 2.5,

                border: `1px solid ${isDark ? "#334155" : "#e2e8f0"
                    }`,

                backgroundColor: isDark
                    ? "#1e293b"
                    : "#ffffff",

                boxShadow: isDark
                    ? "0 2px 10px rgba(0, 0, 0, 0.20)"
                    : "0 2px 10px rgba(15, 23, 42, 0.04)",

                position: "relative",
                overflow: "hidden",

                /* TOP / LEFT ACCENT */
                "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    backgroundColor: "#f67606",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 3,
                    flexWrap: "wrap",
                }}
            >
                {/* =====================================================
                    VEHICLE
                ===================================================== */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0,
                        flex: 1,
                    }}
                >
                    {/* IMAGE */}

                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            minWidth: 64,

                            borderRadius: 2,
                            overflow: "hidden",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            backgroundColor: isDark
                                ? "#273449"
                                : "#f8fafc",

                            border: `1px solid ${isDark
                                ? "#334155"
                                : "#e2e8f0"
                                }`,
                        }}
                    >
                        {imageUrl ? (
                            <Box
                                component="img"
                                src={imageUrl}
                                alt={
                                    category?.category_name ||
                                    "Vehicle"
                                }
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    p: 0.5,
                                }}
                            />
                        ) : (
                            <Typography
                                sx={{
                                    fontSize: 26,
                                    opacity: 0.5,
                                    color: isDark
                                        ? "#cbd5e1"
                                        : "#64748b",
                                }}
                            >
                                ??
                            </Typography>
                        )}
                    </Box>

                    {/* DETAILS */}

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: "10px",
                                fontWeight: 700,

                                color: isDark
                                    ? "#94a3b8"
                                    : "#94a3b8",

                                textTransform: "uppercase",
                                letterSpacing: "0.8px",
                                mb: 0.2,
                                fontFamily: "Bahnschrift",
                            }}
                        >
                            Vehicle Category
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: 700,

                                    color: isDark
                                        ? "#f8fafc"
                                        : "#0f172a",

                                    lineHeight: 1.3,
                                    fontFamily: "Bahnschrift",
                                }}
                            >
                                {category?.category_name ||
                                    `Category ID: ${categoryId}`}
                            </Typography>

                            {category?.category_code && (
                                <Box
                                    sx={{
                                        px: 0.8,
                                        py: 0.25,
                                        borderRadius: 1,

                                        backgroundColor: isDark
                                            ? "#1e3a5f"
                                            : "#eff6ff",

                                        border: `1px solid ${isDark
                                            ? "#1d4ed8"
                                            : "#dbeafe"
                                            }`,

                                        color: isDark
                                            ? "#93c5fd"
                                            : "#2563eb",

                                        fontSize: "10px",
                                        fontWeight: 700,
                                    }}
                                >
                                    {category.category_code}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* =====================================================
                    INSURANCE COMPANY
                ===================================================== */}

                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "280px",
                            md: "350px",
                        },
                        display: 'flex',
                        gap: 1
                    }}
                >
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Insurance Company"
                        name="insurance_company_id"
                        value={
                            formData.insurance_company_id
                        }
                        onChange={handleChange}
                        required
                        sx={{
                            ...selectSx,

                            "& .MuiOutlinedInput-root": {
                                backgroundColor: isDark
                                    ? "#273449"
                                    : "#f8fafc",

                                borderRadius: 1.5,

                                "& fieldset": {
                                    borderColor: isDark
                                        ? "#475569"
                                        : "#dbe2ea",
                                },

                                "&:hover": {
                                    backgroundColor: isDark
                                        ? "#334155"
                                        : "#ffffff",
                                },

                                "&:hover fieldset": {
                                    borderColor: isDark
                                        ? "#64748b"
                                        : "#94a3b8",
                                },

                                "&.Mui-focused": {
                                    backgroundColor: isDark
                                        ? "#1e293b"
                                        : "#ffffff",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#3b82f6",
                                },
                            },

                            "& .MuiInputLabel-root": {
                                color: isDark
                                    ? "#94a3b8"
                                    : undefined,
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#3b82f6",
                            },

                            "& .MuiSelect-select": {
                                color: isDark
                                    ? "#f1f5f9"
                                    : "#334155",
                            },

                            "& .MuiSvgIcon-root": {
                                color: isDark
                                    ? "#94a3b8"
                                    : "#64748b",
                            },
                        }}
                    >
                        <MenuItem value="">
                            Select Insurance Company
                        </MenuItem>

                        {ActiveInsuranceCompanies?.map(
                            (item) => (
                                <MenuItem
                                    key={
                                        item.insurance_company_id
                                    }
                                    value={
                                        item.insurance_company_id
                                    }
                                >
                                    {item.company_name}
                                </MenuItem>
                            )
                        )}
                    </TextField>

                    <Button
                        variant="contained"
                        onClick={handleContinue}
                        disabled={calculationLoading}
                        sx={{
                            px: 4,
                            fontWeight: 600,
                            backgroundColor:
                                "#d88d1d",
                            "&:hover": {
                                backgroundColor:
                                    "#d88d1d",
                            },
                        }}>
                        {calculationLoading
                            ? "Loading..."
                            : "Calculate"}
                    </Button>

                </Box>
            </Box>
        </Paper>
    );
};

export default VehicleCategoryHeader;