import React from "react";
import {
    Box,
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
                        value={formData.insurance_company_id}
                        onChange={handleChange}
                        required
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        mt: 0.5,
                                        borderRadius: 2,
                                        maxHeight: 360,

                                        backgroundColor: isDark
                                            ? "#1e293b"
                                            : "#ffffff",

                                        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"
                                            }`,

                                        boxShadow: isDark
                                            ? "0 12px 30px rgba(0,0,0,0.35)"
                                            : "0 12px 30px rgba(15,23,42,0.12)",

                                        p: 0.5,

                                        // HIDE SCROLLBAR
                                        "&::-webkit-scrollbar": {
                                            display: "none",
                                        },

                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",

                                        "& .MuiMenuItem-root": {
                                            borderRadius: 1.5,
                                            mb: 0.3,
                                            minHeight: 58,
                                            px: 1,
                                            transition: "all 0.15s ease",

                                            "&:hover": {
                                                backgroundColor: isDark
                                                    ? "#273449"
                                                    : "#f8fafc",
                                            },

                                            "&.Mui-selected": {
                                                backgroundColor: isDark
                                                    ? "#334155"
                                                    : "#eff6ff",

                                                "&:hover": {
                                                    backgroundColor: isDark
                                                        ? "#3b4a61"
                                                        : "#dbeafe",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        }}
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

                                py: 1,
                            },

                            "& .MuiSvgIcon-root": {
                                color: isDark
                                    ? "#94a3b8"
                                    : "#64748b",
                            },

                        }}

                    >
                        {/* DEFAULT */}
                        <MenuItem value="">
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.2,
                                    width: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: isDark
                                            ? "#334155"
                                            : "#f1f5f9",
                                        color: isDark
                                            ? "#cbd5e1"
                                            : "#64748b",
                                        fontSize: 17,
                                        fontWeight: 700,
                                    }}
                                >
                                    +
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: isDark
                                                ? "#e2e8f0"
                                                : "#334155",
                                        }}
                                    >
                                        Select Insurance Company
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            color: isDark
                                                ? "#94a3b8"
                                                : "#94a3b8",
                                        }}
                                    >
                                        Choose an insurer
                                    </Typography>
                                </Box>
                            </Box>
                        </MenuItem>

                        {/* COMPANIES */}
                        {ActiveInsuranceCompanies
                            ?.sort((a, b) => a.display_order - b.display_order)
                            ?.map((item) => {
                                const imageUrl = item?.company_image
                                    ? `${BACKEND_IMAGE}${item.company_image}`
                                    : null;

                                const companyColor =
                                    item?.company_color || "#1976d2";

                                const companyName =
                                    item?.company_name || "Insurance Company";

                                const initials = companyName
                                    .split(" ")
                                    .filter(Boolean)
                                    .slice(0, 2)
                                    .map((word) => word[0])
                                    .join("")
                                    .toUpperCase();

                                return (
                                    <MenuItem
                                        key={item.insurance_company_id}
                                        value={item.insurance_company_id}
                                        sx={{
                                            scrollbarWidth: "none",
                                            msOverflowStyle: "none",
                                            "&::-webkit-scrollbar": {
                                                display: "none",
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.2,
                                                width: "100%",
                                                minWidth: 0,
                                            }}
                                        >
                                            {/* COMPANY LOGO */}
                                            <Box
                                                sx={{
                                                    width: 42,
                                                    height: 42,
                                                    minWidth: 42,
                                                    borderRadius: 1.5,
                                                    overflow: "hidden",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",

                                                    backgroundColor: `${companyColor}15`,

                                                    border: `1px solid ${companyColor}35`,

                                                    position: "relative",
                                                }}
                                            >
                                                {imageUrl ? (
                                                    <Box
                                                        component="img"
                                                        src={imageUrl}
                                                        alt={companyName}
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
                                                            fontSize: 12,
                                                            fontWeight: 800,
                                                            color: companyColor,
                                                            letterSpacing: 0.3,
                                                        }}
                                                    >
                                                        {initials}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {/* COMPANY DETAILS */}
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 12.5,
                                                        fontWeight: 700,
                                                        color: isDark
                                                            ? "#f1f5f9"
                                                            : "#1e293b",

                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {companyName}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 0.6,
                                                        mt: 0.3,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 7,
                                                            height: 7,
                                                            borderRadius: "50%",
                                                            backgroundColor:
                                                                companyColor,
                                                        }}
                                                    />

                                                    <Typography
                                                        sx={{
                                                            fontSize: 9.5,
                                                            color: isDark
                                                                ? "#94a3b8"
                                                                : "#94a3b8",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        General Insurance
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* COLOR INDICATOR */}
                                            <Box
                                                sx={{
                                                    width: 4,
                                                    height: 30,
                                                    borderRadius: 5,
                                                    backgroundColor:
                                                        companyColor,
                                                    opacity: 0.9,
                                                }}
                                            />
                                        </Box>
                                    </MenuItem>
                                );
                            })}
                    </TextField>


                </Box>




                {/* =====================================================
                    VEHICLE
                ===================================================== */}



                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: 'flex-end',
                        gap: 1.5,
                        minWidth: 0,
                        flex: 1,
                    }}
                >


                    {/* DETAILS */}

                    <Box >
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
                </Box>


            </Box>
        </Paper>
    );
};

export default VehicleCategoryHeader;