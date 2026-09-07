
import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import EmployeeSelect from "../../CommonComponents/EmployeeSelect";
import { useAllEmployeeDetails } from "../../CommonCode/useQuery";
import { getAuthUser } from "../../constant/Constant";

const PreviousCustomerHeader = ({ isDark, selectedEmployee, setSelectedEmployee, isEmployee }) => {
    const { data: Employee_master = [] } = useAllEmployeeDetails();

    const authUser = getAuthUser();
    const { id } = authUser ?? {};





    const Employees =
        Array.isArray(Employee_master) && !isEmployee
            ? Employee_master
            : Employee_master?.filter(
                emp => Number(emp?.user_id) === Number(id)
            );


    // Automatically select logged-in employee
    useEffect(() => {

        if (isEmployee && Employees.length > 0) {

            setSelectedEmployee(Employees[0].user_id);

        }

    }, [isEmployee, Employees, setSelectedEmployee]);




    return (
        <Box
            sx={{
                position: "sticky",
                width: '100%',
                top: -10,
                zIndex: 1000,
                backgroundColor: isDark
                    ? "background.default"
                    : "#f8fafc",

                borderBottom: "1px solid",
                borderColor: isDark
                    ? "rgba(255,255,255,0.12)"
                    : "#e2e8f0",

                py: 3,
                mb: 3,

                // Slight shadow when scrolling
                boxShadow: isDark
                    ? "0 4px 12px rgba(0,0,0,0.2)"
                    : "0 4px 12px rgba(15,23,42,0.05)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    gap: 2,

                    px: {
                        xs: 2,
                        md: 3,
                    },

                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                }}
            >
                {/* TITLE */}
                <Box>
                    <Typography
                        sx={{
                            fontSize: {
                                xs: 24,
                                md: 30,
                            },
                            fontWeight: 900,
                            color: isDark
                                ? "text.primary"
                                : "#0f172a",
                            lineHeight: 1.2,
                        }}
                    >
                        Previous Customer Entry
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.7,
                            fontSize: {
                                xs: 11,
                                md: 13,
                            },
                            color: "text.secondary",
                        }}
                    >
                        Add customer, vehicle and previous
                        sale details in one place.
                    </Typography>
                </Box>

                {/* ENTRY TYPE */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: "12px",

                        bgcolor: isDark
                            ? "rgba(34,197,94,0.12)"
                            : "#ecfdf5",

                        border: "1px solid",

                        borderColor: isDark
                            ? "rgba(34,197,94,0.25)"
                            : "#bbf7d0",

                        flexShrink: 0,
                    }}
                >
                    <CheckCircle
                        sx={{
                            fontSize: 20,
                            color: "#16a34a",
                        }}
                    />

                    <Box>

                        <EmployeeSelect
                            value={selectedEmployee}
                            onChange={setSelectedEmployee}
                            employees={Employees}
                        />

                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default PreviousCustomerHeader;

