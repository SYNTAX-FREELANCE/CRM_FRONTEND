
import { Card, CardContent, Typography } from "@mui/material";
import { memo } from "react";

const DashboardStatCard = ({
    title,
    count,
    isDark = false,
    borderColor = "#ffb52c",
    onClick,
}) => {
    return (
        <Card
            elevation={0}
            onClick={onClick}
            sx={{
                minWidth: 0,
                height: "100%",
                minHeight: 102,

                borderRadius: "22px",
                cursor: onClick ? "pointer" : "default",

                // Colored top border
                border: "none",
                borderTop: `4px solid ${borderColor}`,

                // Dark green dashboard background
                background: isDark
                    ? "linear-gradient(145deg, #19372a 0%, #193328 100%)"
                    : "linear-gradient(145deg, #ffffff 0%, #f1f7f2 100%)",

                boxShadow: isDark
                    ? "0 5px 15px rgba(0,0,0,0.12)"
                    : "0 5px 15px rgba(15,23,42,0.06)",

                transition: "all 0.25s ease",

                "&:hover": {
                    transform: onClick ? "translateY(-3px)" : "none",
                    boxShadow: isDark
                        ? "0 10px 25px rgba(0,0,0,0.25)"
                        : "0 10px 25px rgba(15,23,42,0.12)",
                },
            }}
        >
            <CardContent
                sx={{
                    px: 2.2,
                    py: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",

                    "&:last-child": {
                        pb: 2,
                    },
                }}
            >
                {/* TITLE */}
                <Typography
                    sx={{
                        color: isDark ? "#a8b9ae" : "#718579",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        fontSize: 11,
                        lineHeight: 1.4,
                    }}
                >
                    {title}
                </Typography>

                {/* VALUE */}
                <Typography
                    fontWeight={900}
                    sx={{
                        mt: 0.8,
                        fontSize: {
                            xs: 24,
                            sm: 29,
                            md: 34,
                        },
                        lineHeight: 1.1,
                        color: isDark ? "#f1f5f9" : "#173d2d",
                        letterSpacing: "-0.7px",
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                    }}
                >
                    {count}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default memo(DashboardStatCard);
