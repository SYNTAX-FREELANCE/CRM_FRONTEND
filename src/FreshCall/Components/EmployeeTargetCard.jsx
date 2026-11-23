
import React, { memo } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    useTheme
} from "@mui/material";

import { useGetCallsLeft } from "../../CommonCode/useQuery";

const EmployeeTargetCard = ({ data = [] }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const emp = data[0];

    const { data: callsLeftCount = 0 } = useGetCallsLeft(
        emp?.employee_id
    );

    if (!emp) return null;

    const totalTarget =
        Number(emp.normal_target || 0) +
        Number(emp.renewal_target || 0);

    const achievement =
        totalTarget > 0
            ? (
                (Number(emp.total_sold || 0) / totalTarget) *
                100
            ).toFixed(2)
            : "0.00";

    const cards = [
        {
            title: "Normal Target",
            value: emp.normal_target ?? 0,
        },
        {
            title: "Normal Sold",
            value: emp.normal_sold ?? 0,
        },
        {
            title: "Renewal Target",
            value: emp.renewal_target ?? 0,
        },
        {
            title: "Renewal Sold",
            value: emp.renewal_sold ?? 0,
        },
        {
            title: "Total Sold",
            value: emp.total_sold ?? 0,
        },
        {
            title: "Calls Left",
            value: callsLeftCount,
        },
        {
            title: "Achievement",
            value: `${achievement}%`,
        },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "9px",
                width: "100%",
                justifyContent: "flex-end",
                alignItems: "stretch",
            }}
        >
            {cards?.map((card) => (
                <Card
                    key={card.title}
                    elevation={0}
                    sx={{
                        flex: "1 1 105px",
                        minWidth: {
                            xs: "calc(50% - 9px)",
                            sm: "105px",
                        },
                        maxWidth: {
                            xs: "none",
                            sm: "125px",
                        },
                        borderRadius: "15px",

                        background: isDark
                            ? "rgba(9, 31, 23, 0.82)"
                            : "#ffffff",

                        border: isDark
                            ? "1px solid rgba(74, 222, 128, 0.05)"
                            : "1px solid #dce9df",

                        transition: "all 0.2s ease",

                        "&:hover": {
                            background: isDark
                                ? "rgba(7, 26, 19, 0.98)"
                                : "#f4faf5",
                            transform: "translateY(-2px)",
                        },
                    }}
                >
                    <CardContent
                        sx={{
                            px: 1.5,
                            py: 1.25,
                            "&:last-child": {
                                pb: 1.25,
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 10,
                                fontWeight: 800,
                                letterSpacing: "0.35px",
                                textTransform: "uppercase",
                                color: isDark
                                    ? "#9fb5aa"
                                    : "#718579",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: 1.3,
                            }}
                            title={card.title}
                        >
                            {card.title}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.35,
                                fontSize: {
                                    xs: 17,
                                    sm: 19,
                                },
                                fontWeight: 900,
                                lineHeight: 1.2,
                                color: isDark
                                    ? "#f1f5f9"
                                    : "#153d2c",
                                letterSpacing: "-0.3px",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {card.value}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default memo(EmployeeTargetCard);
