import React, { useMemo, useState } from "react";
import {
    Box,
    Typography,
    Card,
    Select,
    Option,
    Button,
    RadioGroup,
    Radio,
    Checkbox,
    Divider,
    Stack,
    Chip,
    Sheet,
} from "@mui/joy";
import { useTheme } from "@mui/material";
import { useAllEmployeeDetails, useNewCustomers } from "../CommonCode/useQuery";
import CustomerAllocationTable from "../Settings/CommonMasterComponent/CustomerAllocationTable";
import {
    errorNotify,
    getAuthUser,
    successNotify,
    warningNofity,
} from "../constant/Constant";
import { format } from "date-fns";
import { axioslogin } from "../Connection/axios";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
];

const CustomerAllocation = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const authUser = getAuthUser();
    const LogedEmpId = authUser?.id;
    const queryClient = useQueryClient();

    const [month, setMonth] = useState(dayjs());
    const [selectedCustomers, setSelectedCustomers] = useState({});
    const [allocationMode, setAllocationMode] = useState("single");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [availableEmployees, setAvailableEmployees] = useState([]);

    const formattedDate = month?.format("YYYY-MM");

    const { data: Employee_master = [], isLoading: EmployeeDetailloading } = useAllEmployeeDetails();
    const { data: newCustomers = [], refetch } = useNewCustomers(formattedDate);

    const customers = Array.isArray(newCustomers) ? newCustomers : newCustomers?.data ?? [];
    const employees = Array.isArray(Employee_master) ? Employee_master : Employee_master?.data ?? [];

    const selectedRows = useMemo(
        () => customers.filter((customer) => selectedCustomers[customer.customer_id]),
        [customers, selectedCustomers]
    );

    const handleAvailableEmployee = (userId) => {
        setAvailableEmployees((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleAllocate = async () => {
        if (loading) return;

        if (!selectedRows.length) {
            warningNofity("Please select customers.");
            return;
        }

        let allocations = [];

        if (allocationMode === "single") {
            if (!selectedEmployee) {
                warningNofity("Please select an employee.");
                return;
            }

            const employee = employees.find((emp) => emp.user_id === selectedEmployee);
            if (!employee) {
                warningNofity("Selected employee not found.");
                return;
            }

            allocations = selectedRows.map((customer) => ({
                customer_id: customer.customer_id,
                vehicle_id: customer.vehicle_id,
                employee_id: employee.user_id,
                employee_name: employee.name,
            }));
        } else {
            if (!availableEmployees.length) {
                warningNofity("Select available employees.");
                return;
            }

            const filteredEmployees = employees.filter((emp) =>
                availableEmployees.includes(emp.user_id)
            );

            allocations = selectedRows.map((customer, index) => {
                const employee = filteredEmployees[index % filteredEmployees.length];
                return {
                    customer_id: customer.customer_id,
                    vehicle_id: customer.vehicle_id,
                    employee_id: employee.user_id,
                    employee_name: employee.name,
                };
            });
        }

        const payload = allocations.map((item) => ({
            customer_id: item.customer_id,
            vehicle_id: item.vehicle_id,
            policy_id: null,
            status_id: 1,
            assigned_to: item.employee_id,
            assigned_date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            is_assigned: 1,
            work_status: 'PENDING',
            remarks: "",
            created_by: LogedEmpId,
        }));

        try {
            setLoading(true);

            const { data } = await axioslogin.post("/customer/allocate-customer", {
                allocations: payload,
            });

            if (data.success !== 1) {
                warningNofity(data.message || "Error in Distributing Customers");
                return;
            }

            successNotify(data.message);
            await queryClient.invalidateQueries({
                queryKey: ["new-customer", formattedDate],
            });

            setSelectedCustomers({});
            setSelectedEmployee(null);
            setAvailableEmployees([]);
        } catch (error) {
            errorNotify("Error in Distributing Customers");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "95vh",
                width: "100%",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                background: isDark
                    ? `
          radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.18) 0%, transparent 45%),
          radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.15) 0%, transparent 45%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
        `
                    : `
          radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.22) 0%, transparent 45%),
          radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
          linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
        `,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' }
                }}
            >
                <Card
                    sx={{
                        width: { xs: "95%", xl: 340 },
                        borderRadius: "14px",
                        p: 2.2,
                        background: isDark
                            ? "linear-gradient(180deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.90) 100%)"
                            : "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(247,250,255,0.84) 100%)",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(148,163,184,0.18)",
                        boxShadow: isDark ? "0 12px 32px rgba(0, 0, 0, 0.4)" : "0 12px 32px rgba(15, 23, 42, 0.06)",
                    }}
                >
                    <Stack spacing={2}>
                        <Box>
                            <Typography level="h3" sx={{ fontWeight: 800, color: isDark ? "#f8fafc" : "#17324a" }}>
                                Allocation Setup
                            </Typography>
                            <Typography level="body-sm" sx={{ color: isDark ? "#94a3b8" : "#6b7d90", mt: 0.5 }}>
                                Choose month and allocation preferences.
                            </Typography>
                        </Box>

                        <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : undefined }} />

                        <Box>
                            <Typography level="title-sm" sx={{ mb: 0.8, color: isDark ? "#cbd5e1" : "#284862" }}>
                                Expiry Month
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    views={["year", "month"]}
                                    openTo="month"
                                    value={month}
                                    onChange={(newValue) => setMonth(newValue)}
                                    format="MMM YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: "small",
                                            sx: {
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    height: 48,
                                                    backgroundColor: isDark ? "#1e293b" : "#fff",
                                                    color: isDark ? "#f8fafc" : undefined,
                                                    "& fieldset": {
                                                        borderColor: isDark ? "rgba(255,255,255,0.15)" : undefined,
                                                    },
                                                },
                                                "& .MuiInputBase-input": {
                                                    color: isDark ? "#f8fafc" : undefined,
                                                },
                                                "& .MuiSvgIcon-root": {
                                                    color: isDark ? "#94a3b8" : undefined,
                                                },
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>

                        <Box>
                            <Typography level="title-sm" sx={{ mb: 0.8, color: isDark ? "#cbd5e1" : "#284862" }}>
                                Allocation Mode
                            </Typography>
                            <RadioGroup
                                value={allocationMode}
                                onChange={(e) => setAllocationMode(e.target.value)}
                                sx={{
                                    gap: 1,
                                    p: 1,
                                    borderRadius: "16px",
                                    background: isDark ? "rgba(15,23,42,0.6)" : "#f8fbff",
                                    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(148,163,184,0.14)",
                                    color: isDark ? "#f8fafc" : undefined,
                                }}
                            >
                                <Radio value="single" label="Single Employee" sx={{ color: isDark ? "#f8fafc" : undefined }} />
                                <Radio value="equal" label="Equal Distribution" sx={{ color: isDark ? "#f8fafc" : undefined }} />
                            </RadioGroup>
                        </Box>

                        {allocationMode === "single" && (
                            <Box>
                                <Typography level="title-sm" sx={{ mb: 0.8, color: isDark ? "#cbd5e1" : "#284862" }}>
                                    Select Employee
                                </Typography>
                                <Select
                                    value={selectedEmployee}
                                    onChange={(_, value) => setSelectedEmployee(value)}
                                    placeholder="Choose employee"
                                    sx={{
                                        width: "100%",
                                        "--Select-minHeight": "48px",
                                        "--Select-radius": "14px",
                                        background: isDark ? "#1e293b" : "#fff",
                                        color: isDark ? "#f8fafc" : undefined,
                                        borderColor: isDark ? "rgba(255,255,255,0.15)" : undefined,
                                        fontSize: 14,
                                    }}
                                >
                                    {employees?.map((emp) => (
                                        <Option
                                            sx={{
                                                fontSize: 14,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                bgcolor: isDark ? "#1e293b" : undefined,
                                                color: isDark ? "#f8fafc" : undefined,
                                                "&:hover": {
                                                    bgcolor: isDark ? "#334155" : undefined,
                                                },
                                            }}
                                            key={emp?.user_id}
                                            value={emp?.user_id}
                                        >
                                            {emp?.name?.toUpperCase()}

                                            <Chip sx={{
                                                fontSize: 8,
                                                fontWeight: 800,
                                                color: isDark ? "#f8fafc" : "#0c0c0c",
                                                bgcolor: isDark ? "rgba(255,95,31,0.2)" : undefined,
                                                border: '2px solid #ff5f1f'
                                            }}>
                                                {emp?.status_name}
                                            </Chip>
                                        </Option>
                                    ))}
                                </Select>
                            </Box>
                        )}

                        {allocationMode === "equal" && (
                            <Box>
                                <Typography level="title-sm" sx={{ mb: 1, color: isDark ? "#cbd5e1" : "#284862" }}>
                                    Available Employees
                                </Typography>
                                <Stack spacing={1}>
                                    {employees?.map((emp) => (
                                        <Box
                                            key={emp.user_id}
                                            sx={{
                                                p: 1.2,
                                                borderRadius: "14px",
                                                background: availableEmployees.includes(emp.user_id)
                                                    ? (isDark ? "rgba(37,99,235,0.25)" : "rgba(37,99,235,0.08)")
                                                    : (isDark ? "#1e293b" : "#fff"),
                                                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(148,163,184,0.16)",
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <Checkbox
                                                sx={{
                                                    fontSize: 14,
                                                    color: isDark ? "#f8fafc" : undefined,
                                                }}
                                                label={emp?.name?.toUpperCase()}
                                                checked={availableEmployees.includes(emp.user_id)}
                                                onChange={() => handleAvailableEmployee(emp.user_id)}
                                            />
                                            <Chip sx={{
                                                fontSize: 8,
                                                fontWeight: 800,
                                                color: isDark ? "#f8fafc" : "#0c0c0c",
                                                bgcolor: isDark ? "rgba(255,95,31,0.2)" : undefined,
                                                border: '2px solid #ff5f1f'
                                            }}>
                                                {emp?.status_name}
                                            </Chip>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        <Button
                            onClick={handleAllocate}
                            loading={loading}
                            disabled={loading}
                            sx={{
                                mt: 1,
                                height: 48,
                                borderRadius: "14px",
                                fontWeight: 800,
                                color: "#fff",
                                background: "linear-gradient(135deg, #f97316 0%, #2563eb 100%)",
                                boxShadow: isDark ? "0 12px 24px rgba(37,99,235,0.3)" : "0 12px 24px rgba(37,99,235,0.18)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #ea580c 0%, #1d4ed8 100%)",
                                },
                            }}
                        >
                            {loading ? "Allocating..." : "Allocate Customers"}
                        </Button>
                    </Stack>
                </Card>

                <Card
                    sx={{
                        flex: 1,
                        borderRadius: "24px",
                        p: { xs: 2, md: 2.5 },
                        background: isDark
                            ? "linear-gradient(180deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.95) 100%)"
                            : "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,251,255,0.98) 100%)",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(148,163,184,0.18)",
                        boxShadow: isDark ? "0 12px 32px rgba(0, 0, 0, 0.4)" : "0 12px 32px rgba(15, 23, 42, 0.06)",
                        minHeight: 700,
                    }}
                >
                    <Stack spacing={1.8}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >
                            <Box>
                                <Typography level="h3" sx={{ fontWeight: 800, color: isDark ? "#f8fafc" : "#17324a" }}>
                                    Customers Awaiting Allocation
                                </Typography>
                                <Typography level="body-sm" sx={{ color: isDark ? "#94a3b8" : "#6b7d90", mt: 0.4 }}>
                                    Review and select customers from the filtered list.
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : undefined }} />

                        <Sheet
                            variant="outlined"
                            sx={{
                                borderRadius: "18px",
                                overflow: "hidden",
                                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(148,163,184,0.16)",
                                bgcolor: isDark ? "#0f172a" : undefined,
                            }}
                        >
                            <CustomerAllocationTable
                                data={newCustomers}
                                selectedRows={selectedCustomers}
                                setSelectedRows={setSelectedCustomers}
                            />
                        </Sheet>
                    </Stack>
                </Card>
            </Box>
        </Box>
    );
};

export default CustomerAllocation;
