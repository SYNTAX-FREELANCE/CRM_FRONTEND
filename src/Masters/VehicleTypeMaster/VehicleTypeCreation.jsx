import { Box } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
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

import { useVehicleTypeMaster } from "../../CommonCode/useQuery";

const VehicleTypeCreation = () => {
    const [vehicle, setVehicle] = useState({
        vehicleTypeName: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const { refetch: FetchVehicleTypeMaster } = useVehicleTypeMaster();

    const set = (field) => (e) =>
        setVehicle((prev) => ({
            ...prev,
            [field]: e.target.value
        }));


    const handleReset = () => {
        setVehicle({
            vehicleTypeName: "",
            isActive: "Active",
        });
    };

    const validateVehicleType = () => {
        if (!vehicle.vehicleTypeName.trim()) {
            warningNotify("Vehicle Type Name is required");
            return false;
        }

        if (vehicle.vehicleTypeName.trim().length < 2) {
            warningNotify("Vehicle Type Name must be at least 2 characters");
            return false;
        }

        if (vehicle.vehicleTypeName.trim().length > 100) {
            warningNotify("Vehicle Type Name must not exceed 100 characters");
            return false;
        }

        return true;
    };

    const getVehicleTypeById = async (id) => {
        try {
            const result = await axioslogin.get(`/vehicletype/getbyid/${id}`);
            const { success, data, message } = result.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setVehicle({
                vehicleTypeName: data.vehicle_type_name || "",
                isActive: data.is_active === 1 ? "Active" : "Inactive",
            });
        } catch (error) {
            console.error(error);
            warningNotify("Failed to load vehicle type details");
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getVehicleTypeById(id);
        }
    }, [id, mode]);

    const handleSave = async () => {
        if (!validateVehicleType()) return;

        setLoading(true);

        try {
            const vehicleTypeData = {
                vehicle_type_name: vehicle.vehicleTypeName.trim(),
                is_active: vehicle.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {
                response = await axioslogin.patch(
                    `/vehicletype/update/${id}`,
                    vehicleTypeData
                );
            } else {
                response = await axioslogin.post(
                    "/vehicletype/create",
                    vehicleTypeData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Vehicle Type updated successfully!"
                        : "Vehicle Type created successfully!"
                );

                FetchVehicleTypeMaster();
                handleReset();
                if (mode === "edit") {
                    navigate("/home/setting/commonview", {
                        state: {
                            title: "Vehicle Type Master",
                            type: "vehicletype",
                            idField: "vehicle_type_id",
                            editRoute: "vehicletypemaster",
                            columns: [
                                {
                                    field: "vehicle_type_name",
                                    headerName: "Vehicle Type Name"
                                },
                                {
                                    field: "is_active",
                                    headerName: "Status",
                                    type: "status"
                                }
                            ]
                        }
                    });
                }
            } else {
                warningNotify(
                    message ||
                    (mode === "edit"
                        ? "Failed to update vehicle type"
                        : "Failed to create vehicle type")
                );
            }
        } catch (error) {
            warningNotify(
                error?.response?.data?.message ||
                (mode === "edit"
                    ? "Error updating vehicle type"
                    : "Error creating vehicle type")
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
                title: "Vehicle Type Master",
                type: "vehicletype",
                idField: "vehicle_type_id",
                editRoute: "vehicletypemaster",
                columns: [
                    {
                        field: "vehicle_type_name",
                        headerName: "Vehicle Type Name"
                    },
                    {
                        field: "is_active",
                        headerName: "Status",
                        type: "status"
                    }
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
                title={mode === "edit" ? "Edit Vehicle Type" : "Vehicle Type Creation"}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px",
                    }}
                >
                    <Box sx={{ width: "70%" }}>
                        <FormRow
                            label="Vehicle Type Name"
                            required
                        >
                            <InputLg
                                value={vehicle.vehicleTypeName}
                                onChange={set("vehicleTypeName")}
                                placeholder="Enter vehicle type name"
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={vehicle.isActive}
                                onChange={set("isActive")}
                            />
                        </FormRow>
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

export default VehicleTypeCreation;
