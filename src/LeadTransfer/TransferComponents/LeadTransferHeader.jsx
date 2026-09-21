import React, { memo, useEffect } from "react";
import {
    Box,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";

import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";

import EmployeeSelect from "../../CommonComponents/EmployeeSelect";
import { useAllEmployeeDetails } from "../../CommonCode/useQuery";
import { getAuthUser } from "../../constant/Constant";

const LeadTransferHeader = ({
    selectedEmployee,
    setSelectedEmployee,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const authUser = getAuthUser();
    const { role, id } = authUser ?? {}

    const { data: Employee_master = [] } = useAllEmployeeDetails();

    const isEmployee = role?.toUpperCase() === 'EMPLOYEE';

    const employees =
        Array.isArray(Employee_master) && !isEmployee
            ? Employee_master
            : Employee_master?.filter(
                emp => Number(emp?.user_id) === Number(id)
            );

    // Automatically select logged-in employee
    useEffect(() => {
        if (isEmployee && employees.length > 0) {

            setSelectedEmployee(employees[0].user_id);

        }
    }, [isEmployee, employees, setSelectedEmployee]);


    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 2,
                p: 1.2,
                pl: 1.3,
                borderRadius: 2.5,
                border: isDark
                    ? "1px solid rgba(255,255,255,.08)"
                    : "1px solid #e2e8f0",
                bgcolor: isDark
                    ? "rgba(15,23,42,.72)"
                    : "#ffffff",
                boxShadow:
                    "0 4px 18px rgba(15,23,42,.045)",
            }}
        >
            {/* LEFT — HEADER */}
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                    minWidth: 0,
                    flex: 1,
                }}
            >
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        flexShrink: 0,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isDark
                            ? "rgba(249,115,22,.13)"
                            : "#fff3ed",
                        color: "#d24719",
                        border:
                            "1px solid rgba(249,115,22,.15)",
                    }}
                >
                    <SwapHorizRoundedIcon
                        sx={{
                            fontSize: 22,
                        }}
                    />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: {
                                xs: 17,
                                md: 20,
                            },
                            fontWeight: 950,
                            lineHeight: 1.1,
                            color: isDark
                                ? "#fff"
                                : "#0f172a",
                        }}
                    >
                        Lead Transfer
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.35,
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#64748b",
                            whiteSpace: {
                                xs: "normal",
                                sm: "nowrap",
                            },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        Reassign this lead to another employee
                    </Typography>
                </Box>
            </Stack>

            {/* RIGHT — TRANSFER TO */}
            <Box
                sx={{
                    width: {
                        xs: 170,
                        sm: 220,
                        md: 260,
                    },
                    flexShrink: 0,
                }}
            >
                <Typography
                    sx={{
                        mb: 0.45,
                        ml: 0.3,
                        fontSize: 8,
                        fontWeight: 900,
                        letterSpacing: 0.7,
                        color: "#64748b",
                    }}
                >
                    TRANSFER TO
                </Typography>

                <EmployeeSelect
                    employees={employees}
                    value={selectedEmployee}
                    onChange={setSelectedEmployee}
                />
            </Box>
        </Box>
    );
};

export default memo(LeadTransferHeader);
