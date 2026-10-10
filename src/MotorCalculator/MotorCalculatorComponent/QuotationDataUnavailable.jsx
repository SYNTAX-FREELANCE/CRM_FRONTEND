import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

const QuotationDataUnavailable = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "75vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                backgroundColor: "#f8fafc",
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 460,
                    p: { xs: 3, sm: 4 },
                    textAlign: "center",
                    borderRadius: 4,
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 12px 35px rgba(15, 23, 42, 0.06)",
                }}
            >
                <Box
                    sx={{
                        width: 76,
                        height: 76,
                        mx: "auto",
                        mb: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "24px",
                        backgroundColor: "#fff1f2",
                        color: "#e11d48",
                    }}
                >
                    <DescriptionOutlinedIcon sx={{ fontSize: 40 }} />
                </Box>

                <Typography
                    sx={{
                        fontSize: 21,
                        fontWeight: 750,
                        color: "#172033",
                        mb: 1,
                    }}
                >
                    Quotation Unavailable
                </Typography>

                <Typography
                    sx={{
                        fontSize: 14,
                        lineHeight: 1.8,
                        color: "#64748b",
                        mb: 3,
                    }}
                >
                    We couldn't find the calculation details for this
                    quotation. Please return to the motor calculator
                    and calculate the premium again.
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.2,
                    }}
                >
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ArrowBackRoundedIcon />}
                        onClick={() => navigate(-1)}
                        sx={{
                            py: 1.25,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: 14,
                            fontWeight: 700,
                            backgroundColor: "#2563eb",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#1d4ed8",
                                boxShadow: "none",
                            },
                        }}
                    >
                        Back to Calculator
                    </Button>

                    <Button
                        variant="text"
                        fullWidth
                        startIcon={<RefreshRoundedIcon />}
                        onClick={() => navigate("/home/calculator")}
                        sx={{
                            py: 1,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#64748b",
                            "&:hover": {
                                backgroundColor: "#f1f5f9",
                            },
                        }}
                    >
                        Go to Calculator Home
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default QuotationDataUnavailable;