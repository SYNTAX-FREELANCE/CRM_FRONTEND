import { Box } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import InputDate from "../../Settings/CommonMasterComponent/InputDate";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";

import { axioslogin } from "../../Connection/axios";
import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { useCustomerMaster, useVehicleMaster } from "../../CommonCode/useQuery";

const VehicleCreation = () => {
    const [vehicle, setVehicle] = useState({
        customerId: "",
        registrationNumber: "",
        rto: "",
        registrationData: "",
        model: "",
        vehicleMaker: "",
        engineNumber: "",
        chassisNumber: "",
        vehicleClass: "",
        vehicleCategory: "",
        fuelType: "",
        seatCapacity: "",
    });

    const [toast, setToast] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const { data: customers = [] } = useCustomerMaster();
    const { refetch: FetchVehicleMaster } = useVehicleMaster();

    // Map customers to options for SelectLg
    const customerOptions = customers.map((c) => ({
        id: c.customer_id,
        label: c.customer_name
    }));
    const set = (field) => (e) =>
        setVehicle((prev) => ({
            ...prev,
            [field]: e.target.value
        }));


    const handleReset = () => {
        setVehicle({
            customerId: "",
            registrationNumber: "",
            rto: "",
            registrationData: "",
            model: "",
            vehicleMaker: "",
            engineNumber: "",
            chassisNumber: "",
            vehicleClass: "",
            vehicleCategory: "",
            fuelType: "",
            seatCapacity: "",
        });
    };


    const validateVehicle = () => {
        if (!vehicle.customerId) {
            warningNotify("Please select a Customer");
            return false;
        }

        if (!vehicle.registrationNumber.trim()) {
            warningNotify("Registration Number is required");
            return false;
        }

        if (vehicle.registrationNumber.trim().length < 4) {
            warningNotify("Registration Number must be at least 4 characters");
            return false;
        }

        if (!vehicle.rto.trim()) {
            warningNotify("RTO Details is required");
            return false;
        }

        if (!vehicle.registrationData) {
            warningNotify("Registration Date is required");
            return false;
        }

        if (!vehicle.vehicleMaker.trim()) {
            warningNotify("Vehicle Maker is required");
            return false;
        }

        if (!vehicle.model.trim()) {
            warningNotify("Vehicle Model is required");
            return false;
        }

        if (!vehicle.engineNumber.trim()) {
            warningNotify("Engine Number is required");
            return false;
        }

        if (!vehicle.chassisNumber.trim()) {
            warningNotify("Chassis Number is required");
            return false;
        }

        if (!vehicle.vehicleClass.trim()) {
            warningNotify("Vehicle Class is required");
            return false;
        }

        if (!vehicle.vehicleCategory.trim()) {
            warningNotify("Vehicle Category is required");
            return false;
        }

        if (!vehicle.fuelType) {
            warningNotify("Fuel Type is required");
            return false;
        }

        if (!vehicle.seatCapacity || !vehicle.seatCapacity.toString().trim()) {
            warningNotify("Seating Capacity is required");
            return false;
        }

        if (!/^\d+$/.test(vehicle.seatCapacity.toString().trim())) {
            warningNotify("Seat Capacity must be numeric");
            return false;
        }

        return true;
    };

    const getVehicleById = async (id) => {
        try {
            const result = await axioslogin.get(`/customer/getbyid-vehicle/${id}`);
            const { success, data, message } = result.data;

            if (success !== 1) {
                return errorNotify(message || "Failed to load vehicle details");
            }

            if (data) {
                // Formatting date to YYYY-MM-DD for standard html date inputs
                let formattedDate = "";
                if (data.registration_date) {
                    formattedDate = new Date(data.registration_date).toISOString().split('T')[0];
                }

                setVehicle({
                    customerId: data.customer_id || "",
                    registrationNumber: data.registration_number || "",
                    rto: data.rto || "",
                    registrationData: formattedDate,
                    model: data.model || "",
                    vehicleMaker: data.vehicle_maker || "",
                    engineNumber: data.engine_number || "",
                    chassisNumber: data.chassis_number || "",
                    vehicleClass: data.vehicle_class || "",
                    vehicleCategory: data.vehicle_category || "",
                    fuelType: data.fuel_type || "",
                    seatCapacity: data.seat_capacity || "",
                });
            }
        } catch (error) {
            console.log(error);
            warningNotify("Failed to load vehicle details");
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getVehicleById(id);
        }
    }, [id, mode]);

    const handleSave = async () => {
        if (!validateVehicle()) return;

        setLoading(true);

        try {
            const vehicleData = {
                customer_id: vehicle.customerId,
                registration_number: vehicle.registrationNumber.trim().toUpperCase(),
                rto: vehicle.rto.trim() || null,
                registration_date: vehicle.registrationData || null,
                model: vehicle.model.trim() || null,
                vehicle_maker: vehicle.vehicleMaker.trim() || null,
                engine_number: vehicle.engineNumber.trim() || null,
                chassis_number: vehicle.chassisNumber.trim() || null,
                vehicle_class: vehicle.vehicleClass.trim() || null,
                vehicle_category: vehicle.vehicleCategory.trim() || null,
                fuel_type: vehicle.fuelType || null,
                seat_capacity: vehicle.seatCapacity || null
            };

            let response;

            if (mode === "edit") {
                response = await axioslogin.patch(
                    `/customer/update-vehicle/${id}`,
                    vehicleData
                );
            } else {
                response = await axioslogin.post(
                    "/customer/create-vehicle",
                    vehicleData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Vehicle updated successfully!"
                        : "Vehicle created successfully!"
                );
                FetchVehicleMaster();
                handleReset();
                if (mode === "edit") {
                    navigate(-1);
                }
            } else {
                warningNotify(
                    message ||
                    (mode === "edit"
                        ? "Failed to update vehicle"
                        : "Failed to create vehicle")
                );
            }
        } catch (error) {
            warningNotify(
                error?.response?.data?.message ||
                (mode === "edit"
                    ? "Error updating vehicle"
                    : "Error creating vehicle")
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = useCallback(() => {
        handleReset();

    }, []);

    const handleView = () => {
        navigate("/home/setting/commonview", {
            state: {
                title: "Vehicle Master",
                type: "vehicle",
                idField: "vehicle_id",
                editRoute: "vehiclemaster",
                columns: [
                    { field: "registration_number", headerName: "Reg No" },
                    { field: "customer_name", headerName: "Customer Name" },
                    { field: "model", headerName: "Model" },
                    { field: "vehicle_maker", headerName: "Maker" },
                    { field: "vehicle_class", headerName: "Class" },
                    { field: "fuel_type", headerName: "Fuel" }
                ]
            }
        });
    };

    const handleClose = useCallback(() => {
        navigate('/home/settings');
    }, [navigate]);

    return (
        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Vehicle Details"
                        : "Vehicle Detail Entry"
                } >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px",
                        padding: "10px",
                    }}
                >
                    <Box sx={{ width: "90%" }}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                            gap: "24px"
                        }}>
                            <div>
                                <FormRow label="Customer Name" required>
                                    <SelectLg
                                        value={vehicle.customerId}
                                        onChange={set("customerId")}
                                        options={customerOptions}
                                    />
                                </FormRow>

                                <FormRow label="Registration Number" required>
                                    <InputLg
                                        value={vehicle.registrationNumber}
                                        onChange={set("registrationNumber")}
                                        placeholder="Enter registration number"
                                    />
                                </FormRow>

                                <FormRow label="RTO Details" required>
                                    <InputLg
                                        value={vehicle.rto}
                                        onChange={set("rto")}
                                        placeholder="Enter RTO code"
                                    />
                                </FormRow>

                                <FormRow label="Registration Date" required>
                                    <InputDate
                                        value={vehicle.registrationData}
                                        onChange={set("registrationData")}
                                    />
                                </FormRow>

                                <FormRow label="Vehicle Maker" required>
                                    <InputLg
                                        value={vehicle.vehicleMaker}
                                        onChange={set("vehicleMaker")}
                                        placeholder="Enter vehicle manufacturer"
                                    />
                                </FormRow>

                                <FormRow label="Vehicle Model" required>
                                    <InputLg
                                        value={vehicle.model}
                                        onChange={set("model")}
                                        placeholder="Enter vehicle model"
                                    />
                                </FormRow>
                            </div>

                            <div>
                                <FormRow label="Engine Number" required>
                                    <InputLg
                                        value={vehicle.engineNumber}
                                        onChange={set("engineNumber")}
                                        placeholder="Enter engine number"
                                    />
                                </FormRow>

                                <FormRow label="Chassis Number" required>
                                    <InputLg
                                        value={vehicle.chassisNumber}
                                        onChange={set("chassisNumber")}
                                        placeholder="Enter chassis number"
                                    />
                                </FormRow>

                                <FormRow label="Vehicle Class" required>
                                    <InputLg
                                        value={vehicle.vehicleClass}
                                        onChange={set("vehicleClass")}
                                        placeholder="Enter vehicle class"
                                    />
                                </FormRow>

                                <FormRow label="Vehicle Category" required>
                                    <InputLg
                                        value={vehicle.vehicleCategory}
                                        onChange={set("vehicleCategory")}
                                        placeholder="Enter vehicle category"
                                    />
                                </FormRow>

                                <FormRow label="Fuel Type" required>
                                    <select
                                        style={{
                                            border: "1px solid #d1d5db",
                                            borderRadius: "4px",
                                            height: "30px",
                                            width: "100%",
                                            fontSize: "13px",
                                            outline: "none",
                                            backgroundColor: "#fff",
                                            padding: "0 8px",
                                            cursor: "pointer"
                                        }}
                                        value={vehicle.fuelType}
                                        onChange={set("fuelType")}
                                    >
                                        <option value="">-- Select Fuel Type --</option>
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="CNG">CNG</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </FormRow>

                                <FormRow label="Seating Capacity" required>
                                    <InputLg
                                        value={vehicle.seatCapacity}
                                        onChange={set("seatCapacity")}
                                        placeholder="Enter seating capacity"
                                    />
                                </FormRow>
                            </div>
                        </div>
                    </Box>
                </Box>

                <div
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        margin: "20px 0",
                    }}
                />

                <ButtonWrapper>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>

                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>

                    <Button onClick={handleView}>
                        View
                    </Button>

                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </ButtonWrapper>
            </Panel>
        </Wrapper>
    );
};

export default VehicleCreation;
