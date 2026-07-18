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
import { useEmployeeMaster, useNewCustomers } from "../CommonCode/useQuery";
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

    const { data: Employee_master = [] } = useEmployeeMaster();
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
            alert("Please select customers.");
            return;
        }

        let allocations = [];

        if (allocationMode === "single") {
            if (!selectedEmployee) {
                alert("Please select an employee.");
                return;
            }

            const employee = employees.find((emp) => emp.user_id === selectedEmployee);
            if (!employee) {
                alert("Selected employee not found.");
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
                alert("Select available employees.");
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
                minHeight: "100vh",
                // background:
                //     "linear-gradient(135deg, #f7faff 0%, #eef4ff 45%, #ffffff 100%)",
            }}
        >

            <Stack
                direction={{ xs: "column", sm: 'column', md: 'row', lg: 'row', xl: "row" }}
                spacing={2.2}
                alignItems="stretch"
            >
                <Card
                    sx={{
                        width: { xs: "95%", xl: 340 },
                        flexShrink: 0,
                        borderRadius: "24px",
                        p: 2.2,
                        background:
                            "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(247,250,255,0.84) 100%)",
                        border: "1px solid rgba(148,163,184,0.18)",
                        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
                    }}
                >
                    <Stack spacing={2}>
                        <Box>
                            <Typography level="h3" sx={{ fontWeight: 800, color: "#17324a" }}>
                                Allocation Setup
                            </Typography>
                            <Typography level="body-sm" sx={{ color: "#6b7d90", mt: 0.5 }}>
                                Choose month and allocation preferences.
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography level="title-sm" sx={{ mb: 0.8, color: "#284862" }}>
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
                                                    backgroundColor: "#fff",
                                                },
                                            },
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>

                        <Box>
                            <Typography level="title-sm" sx={{ mb: 0.8, color: "#284862" }}>
                                Allocation Mode
                            </Typography>
                            <RadioGroup
                                value={allocationMode}
                                onChange={(e) => setAllocationMode(e.target.value)}
                                sx={{
                                    gap: 1,
                                    p: 1,
                                    borderRadius: "16px",
                                    background: "#f8fbff",
                                    border: "1px solid rgba(148,163,184,0.14)",
                                }}
                            >
                                <Radio value="single" label="Single Employee" />
                                <Radio value="equal" label="Equal Distribution" />
                            </RadioGroup>
                        </Box>

                        {allocationMode === "single" && (
                            <Box>
                                <Typography level="title-sm" sx={{ mb: 0.8, color: "#284862" }}>
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
                                        background: "#fff",
                                    }}
                                >
                                    {Employee_master?.map((emp) => (
                                        <Option key={emp.user_id} value={emp.user_id}>
                                            {emp.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Box>
                        )}

                        {allocationMode === "equal" && (
                            <Box>
                                <Typography level="title-sm" sx={{ mb: 1, color: "#284862" }}>
                                    Available Employees
                                </Typography>
                                <Stack spacing={1}>
                                    {Employee_master.map((emp) => (
                                        <Box
                                            key={emp.user_id}
                                            sx={{
                                                p: 1.2,
                                                borderRadius: "14px",
                                                background: availableEmployees.includes(emp.user_id)
                                                    ? "rgba(37,99,235,0.08)"
                                                    : "#fff",
                                                border: "1px solid rgba(148,163,184,0.16)",
                                            }}
                                        >
                                            <Checkbox
                                                label={emp.name}
                                                checked={availableEmployees.includes(emp.user_id)}
                                                onChange={() => handleAvailableEmployee(emp.user_id)}
                                            />
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
                                boxShadow: "0 12px 24px rgba(37,99,235,0.18)",
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
                        background:
                            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,251,255,0.98) 100%)",
                        border: "1px solid rgba(148,163,184,0.18)",
                        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
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
                                <Typography level="h3" sx={{ fontWeight: 800, color: "#17324a" }}>
                                    Customers Awaiting Allocation
                                </Typography>
                                <Typography level="body-sm" sx={{ color: "#6b7d90", mt: 0.4 }}>
                                    Review and select customers from the filtered list.
                                </Typography>
                            </Box>

                        </Box>

                        <Divider />

                        <Sheet
                            variant="outlined"
                            sx={{
                                borderRadius: "18px",
                                overflow: "hidden",
                                borderColor: "rgba(148,163,184,0.16)",
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
            </Stack>

        </Box>
    );
};

export default CustomerAllocation;