import React from "react";
import {
    Box,
    Checkbox,
    Grid,
    Paper,
    Typography,
    useTheme,
} from "@mui/material";

const AdditionalCoversSection = ({
    calculationLoading,
    fetchedCovers = [],
    formData,
    getId,
    handleCoverChange,
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
                                ? "#14532d"
                                : "#f0fdf4",

                            color: isDark
                                ? "#86efac"
                                : "#000000",

                            fontSize: "13px",
                            fontWeight: 800,
                        }}
                    >
                        03
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
                                fontFamily: "Bahnschrift",
                            }}
                        >
                            Additional Covers
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.25,
                                fontSize: "11px",
                                color: isDark
                                    ? "#94a3b8"
                                    : "#94a3b8",
                                fontFamily: "Bahnschrift",
                            }}
                        >
                            Select additional protection available for this policy
                        </Typography>
                    </Box>
                </Box>

                {!calculationLoading &&
                    fetchedCovers.length > 0 && (
                        <Box
                            sx={{
                                px: 1.2,
                                py: 0.5,
                                borderRadius: 5,

                                backgroundColor:
                                    formData.cover_ids.length > 0
                                        ? isDark
                                            ? "#14532d"
                                            : "#f0fdf4"
                                        : isDark
                                            ? "#334155"
                                            : "#f1f5f9",

                                color:
                                    formData.cover_ids.length > 0
                                        ? isDark
                                            ? "#86efac"
                                            : "#16a34a"
                                        : isDark
                                            ? "#cbd5e1"
                                            : "#64748b",

                                fontSize: "11px",
                                fontWeight: 600,
                            }}
                        >
                            {formData.cover_ids.length} selected
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
                        Loading applicable covers...
                    </Box>
                ) : fetchedCovers.length === 0 ? (
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
                            No applicable covers found
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
                            Additional covers will appear based on the
                            calculation configuration.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={1.2}>
                        {fetchedCovers?.map((item) => {
                            const id = getId(
                                item,
                                ["cover_id"]
                            );

                            const isSelected =
                                formData.cover_ids.includes(id);

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
                                            handleCoverChange(id)
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
                                                    ? "#15803d"
                                                    : "#86efac"
                                                : isDark
                                                    ? "#475569"
                                                    : "#e2e8f0",

                                            borderRadius: 1.8,

                                            backgroundColor:
                                                isSelected
                                                    ? isDark
                                                        ? "#14532d"
                                                        : "#f0fdf4"
                                                    : isDark
                                                        ? "#1e293b"
                                                        : "#fff",

                                            transition:
                                                "all 0.18s ease",

                                            "&:hover": {
                                                borderColor:
                                                    isSelected
                                                        ? isDark
                                                            ? "#22c55e"
                                                            : "#4ade80"
                                                        : isDark
                                                            ? "#64748b"
                                                            : "#94a3b8",

                                                backgroundColor:
                                                    isSelected
                                                        ? isDark
                                                            ? "#166534"
                                                            : "#f0fdf4"
                                                        : isDark
                                                            ? "#273449"
                                                            : "#f8fafc",
                                            },
                                        }}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() =>
                                                handleCoverChange(id)
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
                                                    color: "#16a34a",
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
                                                {item.cover_name}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    mt: 0.4,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.7,
                                                    flexWrap: "wrap",
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
                                                    {item.cover_type}
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
                                                            ? "#16a34a"
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

export default AdditionalCoversSection;