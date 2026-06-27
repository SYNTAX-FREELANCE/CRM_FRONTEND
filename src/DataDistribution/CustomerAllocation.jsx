import React from "react";
import {
    Box,
    Typography,
    Card,
    Table,
    Sheet,
    Select,
    Option,
    Button,
    Checkbox,
} from "@mui/joy";
import { useCustomerMaster, useEmployeeMaster, useNewCustomers, useVehicleMaster } from "../CommonCode/useQuery";

const CustomerAllocation = () => {
    const { data: CustomerMasterDetail } = useCustomerMaster();
    const { data: VehicleMasterDetail } = useVehicleMaster();
    const { data: Employee_master } = useEmployeeMaster();
    const { data: newCustomers } = useNewCustomers();

    return (
        <Box sx={{ p: 3, background: "#f5f7fb", minHeight: "100vh" }}>
            {/* Heading */}
            <Typography level="h2" sx={{ mb: 3 }}>
                Customer Allocation
            </Typography>

            {/* Filter Card */}
            <Card
                sx={{
                    p: 2,
                    mb: 3,
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center",
                }}
            >
                <Typography level="title-md">Expiry Month</Typography>

                <Select sx={{ width: 180 }} defaultValue={8}>
                    <Option value={1}>January</Option>
                    <Option value={2}>February</Option>
                    <Option value={3}>March</Option>
                    <Option value={4}>April</Option>
                    <Option value={5}>May</Option>
                    <Option value={6}>June</Option>
                    <Option value={7}>July</Option>
                    <Option value={8}>August</Option>
                    <Option value={9}>September</Option>
                    <Option value={10}>October</Option>
                    <Option value={11}>November</Option>
                    <Option value={12}>December</Option>
                </Select>

                <Button>Search Customers</Button>
            </Card>

            {/* Allocation Card */}
            <Card sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                        alignItems: "center",
                    }}
                >
                    <Typography level="title-lg">
                        Customers Awaiting Allocation
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Select
                            placeholder="Select Employee"
                            sx={{ minWidth: 250 }}
                        >
                            {Employee_master?.map((emp) => (
                                <Option key={emp.user_id} value={emp.user_id}>
                                    {emp.name}
                                </Option>
                            ))}
                        </Select>

                        <Button color="primary">
                            Allocate Selected
                        </Button>
                    </Box>
                </Box>

                <Sheet
                    variant="outlined"
                    sx={{
                        borderRadius: "md",
                        overflow: "auto",
                    }}
                >
                    <Table hoverRow stickyHeader>
                        <thead>
                            <tr>
                                <th style={{ width: 50 }}>
                                    <Checkbox />
                                </th>
                                <th>Customer</th>
                                <th>Mobile</th>
                                <th>Registration No.</th>
                                <th>Registration Date</th>
                                <th>Expiry Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>
                                    <Checkbox />
                                </td>
                                <td>Arun Kumar</td>
                                <td>9876543210</td>
                                <td>KL07AB1234</td>
                                <td>10-03-2025</td>
                                <td>10-03-2026</td>
                            </tr>

                            <tr>
                                <td>
                                    <Checkbox />
                                </td>
                                <td>Rahul Raj</td>
                                <td>9988776655</td>
                                <td>KL08CD5678</td>
                                <td>18-03-2025</td>
                                <td>18-03-2026</td>
                            </tr>

                            <tr>
                                <td>
                                    <Checkbox />
                                </td>
                                <td>Anu Thomas</td>
                                <td>9123456789</td>
                                <td>KL11EF4321</td>
                                <td>25-03-2025</td>
                                <td>25-03-2026</td>
                            </tr>
                        </tbody>
                    </Table>
                </Sheet>
            </Card>
        </Box>
    );
};

export default CustomerAllocation;