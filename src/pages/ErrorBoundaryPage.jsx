    import { memo } from "react";
import { Box, Button, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ErrorBoundaryPage = () => {

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: `
                    radial-gradient(circle at top left, rgba(239,65,12,.08), transparent 35%),
                    radial-gradient(circle at bottom right, rgba(59,130,246,.08), transparent 35%),
                    linear-gradient(135deg,#ffffff,#f8fafc)
                `,
                overflow: "hidden",
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 520,
                    textAlign: "center",
                }}
            >
                {/* Logo */}

                <Box
                    sx={{
                        position: "relative",
                        width: 130,
                        height: 130,
                        mx: "auto",
                        mb: 3,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            bgcolor: "rgba(239,65,12,.08)",
                            animation: "pulse 2s infinite",
                        }}
                    />

                    <Box
                        sx={{
                            position: "relative",
                            width: 110,
                            height: 110,
                            mx: "auto",
                            mt: 1.2,
                            borderRadius: "50%",
                            bgcolor: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 12px 35px rgba(0,0,0,.12)",
                        }}
                    >
                        <ErrorOutlineIcon
                            sx={{
                                fontSize: 60,
                                color: "#ef410c",
                            }}
                        />
                    </Box>
                </Box>

                <Typography
                    sx={{
                        fontSize: {
                            xs: 24,
                            md: 32,
                        },
                        fontWeight: 800,
                        color: "#1E293B",
                    }}
                >
                    Oops!
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        color: "#64748B",
                        fontSize: 15,
                    }}
                >
                    Something went wrong while loading this page.
                    <br />
                    Please reload and try again.
                </Typography>

                <Button
                    onClick={handleReload}
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    sx={{
                        mt: 4,
                        px: 4,
                        py: 1.3,
                        borderRadius: 3,
                        bgcolor: "#ef410c",
                        fontWeight: 700,
                        textTransform: "none",
                        boxShadow: "0 10px 25px rgba(239,65,12,.25)",
                        "&:hover": {
                            bgcolor: "#d63b0b",
                        },
                    }}
                >
                    Reload Application
                </Button>
            </Box>

            <style>
                {`
                    @keyframes pulse {
                        0% {
                            transform: scale(.9);
                            opacity:.6;
                        }
                        70%{
                            transform: scale(1.2);
                            opacity:0;
                        }
                        100%{
                            transform: scale(1.2);
                            opacity:0;
                        }
                    }
                `}
            </style>
        </Box>
    );
};

export default memo(ErrorBoundaryPage);