import React from "react";
import {
    Box,
    Checkbox,
    Grid,
    Paper,
    Typography,
    useTheme,
} from "@mui/material";

const AddonsSection = ({
    calculationLoading,
    fetchedAddons = [],
    formData,
    getId,
    getName,
    handleAddonChange,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Paper
            sx={{
                mb: 2,
                borderRadius: 2.5,
                border: `1px solid ${isDark ? "#334155" : "#e2e8f0"
                    }`,
                backgroundColor: isDark ? "#1e293b" : "#fff",
                overflow: "hidden",
                boxShadow: isDark
                    ? "0 2px 8px rgba(0, 0, 0, 0.20)"
                    : "0 2px 8px rgba(15, 23, 42, 0.04)",
            }}
        >
            {/* HEADER */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${isDark ? "#334155" : "#eef2f7"
                        }`,
                    backgroundColor: isDark
                        ? "#172033"
                        : "#fafbfc",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                    }}
                >
                    <Box
                        sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            backgroundColor: isDark
                                ? "#1e3a5f"
                                : "#eff6ff",

                            color: isDark
                                ? "#93c5fd"
                                : "#080808",

                            fontSize: "13px",
                            fontWeight: 800,
                        }}
                    >
                        02
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: isDark
                                    ? "#f8fafc"
                                    : "#1e293b",
                                lineHeight: 1.2,
                            }}
                        >
                            Add-ons
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.25,
                                fontSize: "11px",
                                color: isDark
                                    ? "#94a3b8"
                                    : "#94a3b8",
                            }}
                        >
                            Select additional covers applicable to this policy
                        </Typography>
                    </Box>
                </Box>

                {!calculationLoading &&
                    fetchedAddons.length > 0 && (
                        <Box
                            sx={{
                                px: 1.2,
                                py: 0.5,
                                borderRadius: 5,

                                backgroundColor:
                                    formData.addon_ids.length > 0
                                        ? isDark
                                            ? "#1e3a5f"
                                            : "#eff6ff"
                                        : isDark
                                            ? "#334155"
                                            : "#f1f5f9",

                                color:
                                    formData.addon_ids.length > 0
                                        ? isDark
                                            ? "#93c5fd"
                                            : "#2563eb"
                                        : isDark
                                            ? "#cbd5e1"
                                            : "#64748b",

                                fontSize: "11px",
                                fontWeight: 600,
                            }}
                        >
                            {formData.addon_ids.length} selected
                        </Box>
                    )}
            </Box>

            {/* CONTENT */}
            <Box sx={{ p: 2 }}>
                {calculationLoading ? (
                    <Box
                        sx={{
                            py: 3,
                            textAlign: "center",
                            color: isDark
                                ? "#94a3b8"
                                : "#64748b",
                            fontSize: "13px",
                        }}
                    >
                        Loading applicable add-ons...
                    </Box>
                ) : fetchedAddons.length === 0 ? (
                    <Box
                        sx={{
                            py: 2.5,
                            textAlign: "center",

                            border: `1px dashed ${isDark ? "#475569" : "#cbd5e1"
                                }`,

                            borderRadius: 2,

                            backgroundColor: isDark
                                ? "#172033"
                                : "#f8fafc",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: isDark
                                    ? "#cbd5e1"
                                    : "#64748b",
                                fontFamily: "Bahnschrift",
                            }}
                        >
                            No applicable add-ons found
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.4,
                                fontSize: "11px",
                                color: isDark
                                    ? "#64748b"
                                    : "#94a3b8",
                                fontFamily: "Bahnschrift",
                            }}
                        >
                            Add-ons will appear based on the selected
                            vehicle and policy details.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={1.2}>
                        {fetchedAddons?.map((item) => {
                            const id = getId(
                                item,
                                ["addon_id"]
                            );

                            const name = getName(
                                item,
                                ["addon_name"]
                            );

                            const isSelected =
                                formData.addon_ids.includes(id);

                            return (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={id}
                                >
                                    <Box
                                        onClick={() =>
                                            handleAddonChange(id)
                                        }
                                        sx={{
                                            minHeight: 64,
                                            p: 1.1,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            cursor: "pointer",

                                            border: "1px solid",

                                            borderColor: isSelected
                                                ? isDark
                                                    ? "#b45309"
                                                    : "#fdd693"
                                                : isDark
                                                    ? "#475569"
                                                    : "#e2e8f0",

                                            borderRadius: 1.8,

                                            backgroundColor:
                                                isSelected
                                                    ? isDark
                                                        ? "#1e3a5f"
                                                        : "#eff6ff"
                                                    : isDark
                                                        ? "#1e293b"
                                                        : "#fff",

                                            transition:
                                                "all 0.18s ease",

                                            "&:hover": {
                                                borderColor:
                                                    isSelected
                                                        ? "#ea5911"
                                                        : isDark
                                                            ? "#64748b"
                                                            : "#94a3b8",

                                                backgroundColor:
                                                    isSelected
                                                        ? isDark
                                                            ? "#243f63"
                                                            : "#eff6ff"
                                                        : isDark
                                                            ? "#273449"
                                                            : "#f8fafc",
                                            },
                                        }}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() =>
                                                handleAddonChange(id)
                                            }
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                            size="small"
                                            sx={{
                                                p: 0.3,

                                                color: isDark
                                                    ? "#64748b"
                                                    : "#94a3b8",

                                                "&.Mui-checked": {
                                                    color: "#df500e",
                                                },
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                minWidth: 0,
                                                flex: 1,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: "13px",
                                                    fontWeight: 600,

                                                    color: isDark
                                                        ? "#f1f5f9"
                                                        : "#334155",

                                                    lineHeight: 1.3,
                                                    fontFamily:
                                                        "Bahnschrift",
                                                }}
                                            >
                                                {name}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    mt: 0.4,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.7,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: "10px",
                                                        fontWeight: 600,

                                                        color: isDark
                                                            ? "#94a3b8"
                                                            : "#64748b",

                                                        fontFamily:
                                                            "Bahnschrift",
                                                        textTransform:
                                                            "uppercase",
                                                    }}
                                                >
                                                    {item.rate_type}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        width: 3,
                                                        height: 3,
                                                        borderRadius: "50%",
                                                        backgroundColor:
                                                            isDark
                                                                ? "#64748b"
                                                                : "#94a3b8",
                                                    }}
                                                />

                                                <Typography
                                                    sx={{
                                                        fontSize: "11px",
                                                        fontWeight: 600,
                                                        fontFamily:
                                                            "Bahnschrift",

                                                        color: isSelected
                                                            ? "#f95007"
                                                            : isDark
                                                                ? "#94a3b8"
                                                                : "#64748b",
                                                    }}
                                                >
                                                    {item.rate_value}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        </Paper>
    );
};

export default AddonsSection;