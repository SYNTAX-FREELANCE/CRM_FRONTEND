import React, { useState } from "react";
import {
    Box,
} from "@mui/material";
import LeadTransferForm from "./TransferComponents/LeadTransferForm";
import CustomerSearchToggle from "./TransferComponents/CustomerSearchToggle";
import LeadInfoCard from "./TransferComponents/LeadInfoCard";
import VehicleInfoCard from "./TransferComponents/VehicleInfoCard";
import LeadTransferHeader from "./TransferComponents/LeadTransferHeader";

const LeadTransfer = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);


    const [selectedEmployee, setSelectedEmployee] =
        useState("");


    const leads = selectedCustomer?.leads || [];
    const selectedLead = leads[0];

    const selectedVehicle =
        selectedCustomer?.vehicles?.find(
            (vehicle) =>
                vehicle.vehicle_id === selectedLead?.vehicle_id
        );

    const currentEmployee =
        selectedLead?.assigned_to_name || "Unassigned";

    const currentStatus =
        selectedLead?.status_name === "SOLD"
            ? "CAPTURED"
            : selectedLead?.status_name || "-";

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case "NEW":
                return "#0891b2";

            case "CALLBACK":
                return "#f97316";

            case "QUOTE":
                return "#2563eb";

            case "APPOINTMENT":
                return "#7c3aed";

            case "SOLD":
            case "CAPTURED":
                return "#16a34a";

            case "LOST":
                return "#ef4444";

            default:
                return "#64748b";
        }
    };

    const statusColor = getStatusColor(currentStatus);


    return (
        <Box
            sx={{
                minHeight: "92vh",
                px: { xs: 1.5, md: 2.5 },
                py: { xs: 1.5, md: 2 },
            }}
        >
            {/* HEADER */}
            <LeadTransferHeader
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
            />


            {/* SEARCH */}
            <Box sx={{ mb: selectedLead ? 1.5 : 0, }} >
                <CustomerSearchToggle
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                    setDetailLoading={setDetailLoading}
                />
            </Box>

            {/* SELECTED LEAD */}
            {selectedLead && (
                <>
                    {/* COMPACT LEAD INFO */}
                    <LeadInfoCard
                        selectedLead={selectedLead}
                        selectedCustomer={selectedCustomer}
                        selectedVehicle={selectedVehicle}
                        currentEmployee={currentEmployee}
                        currentStatus={currentStatus}
                        statusColor={statusColor}
                    />

                    <VehicleInfoCard
                        selectedVehicle={selectedVehicle}
                    />
                    {/* TRANSFER FORM */}
                    <LeadTransferForm
                        selectedLead={selectedLead}
                        selectedEmployee={selectedEmployee}
                        onCancel={() => {
                            setSelectedCustomer(null);
                        }}
                    />
                </>
            )}
        </Box>
    );
};



export default LeadTransfer;