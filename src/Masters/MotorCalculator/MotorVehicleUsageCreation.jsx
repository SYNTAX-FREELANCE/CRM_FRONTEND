import { Box } from "@mui/joy";
import { memo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { axioslogin } from "../../Connection/axios";


const MotorVehicleUsageCreation = () => {

    const [vehicleUsage, setVehicleUsage] = useState({
        usageCode: "",
        usageName: "",
        description: "",
        isActive: "Active"
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};


    // SET FIELD
    const set = (field) => (e) =>
        setVehicleUsage((prev) => ({
            ...prev,
            [field]: e.target.value
        }));


    // GET BY ID
    const getVehicleUsageById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/motor/vehicle-usage/getbyid/${id}`
            );

            const {
                data,
                success,
                message
            } = result?.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setVehicleUsage({
                usageCode: data.usage_code || "",
                usageName: data.usage_name || "",
                description: data.description || "",
                isActive: data.is_active === 1
                    ? "Active"
                    : "Inactive"
            });

        } catch (error) {

            console.error(error);

            warningNotify(
                "Failed to load vehicle usage details"
            );
        }
    };


    // LOAD EDIT DATA
    useEffect(() => {

        if (mode === "edit" && id) {
            getVehicleUsageById(id);
        }

    }, [id, mode]);


    // VALIDATION
    const validateVehicleUsage = () => {

        if (
            !vehicleUsage.usageCode ||
            vehicleUsage.usageCode.trim() === ""
        ) {

            warningNotify(
                "Usage Code is required."
            );

            return false;
        }


        if (vehicleUsage.usageCode.trim().length > 50) {

            warningNotify(
                "Usage Code must not exceed 50 characters."
            );

            return false;
        }


        if (
            !vehicleUsage.usageName ||
            vehicleUsage.usageName.trim() === ""
        ) {

            warningNotify(
                "Usage Name is required."
            );

            return false;
        }


        if (vehicleUsage.usageName.trim().length < 2) {

            warningNotify(
                "Usage Name must be at least 2 characters."
            );

            return false;
        }


        if (vehicleUsage.usageName.trim().length > 150) {

            warningNotify(
                "Usage Name must not exceed 150 characters."
            );

            return false;
        }


        if (
            vehicleUsage.description &&
            vehicleUsage.description.length > 500
        ) {

            warningNotify(
                "Description must not exceed 500 characters."
            );

            return false;
        }


        return true;
    };


    // RESET
    const handleReset = useCallback(() => {

        setVehicleUsage({
            usageCode: "",
            usageName: "",
            description: "",
            isActive: "Active"
        });
        navigate(".", { replace: true, state: null });

    }, [navigate]);


    // SAVE / UPDATE
    const handleSave = async () => {

        if (!validateVehicleUsage()) {
            return;
        }

        setLoading(true);

        try {

            const usageData = {

                usage_code:
                    vehicleUsage.usageCode.trim(),

                usage_name:
                    vehicleUsage.usageName.trim(),

                description:
                    vehicleUsage.description?.trim() || null,

                is_active:
                    vehicleUsage.isActive === "Active"
                        ? 1
                        : 0
            };


            let response;


            // UPDATE
            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/motor/vehicle-usage/update/${id}`,
                    usageData
                );

            }
            // CREATE
            else {

                response = await axioslogin.post(
                    "/motor/vehicle-usage/create",
                    usageData
                );
            }


            const {
                success,
                message
            } = response.data;


            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Vehicle Usage updated successfully!"
                        : "Vehicle Usage created successfully!"
                );


                handleReset();


                // AFTER UPDATE GO TO VIEW
                if (mode === "edit") {

                    navigate(
                        "/home/setting/commonview",
                        {
                            state: {

                                title:
                                    "Motor Vehicle Usage Master",

                                type:
                                    "motorvehicleusage",

                                idField:
                                    "usage_id",

                                editRoute:
                                    "motorvehicleusage",

                                navigateback:
                                    "/home/settings",

                                columns: [

                                    {
                                        field:
                                            "usage_code",

                                        headerName:
                                            "Usage Code"
                                    },

                                    {
                                        field:
                                            "usage_name",

                                        headerName:
                                            "Usage Name"
                                    },

                                    {
                                        field:
                                            "description",

                                        headerName:
                                            "Description"
                                    },

                                    {
                                        field:
                                            "is_active",

                                        headerName:
                                            "Status",

                                        type:
                                            "status"
                                    }

                                ]
                            }
                        }
                    );
                }

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update vehicle usage"
                            : "Failed to create vehicle usage"
                    )
                );
            }

        } catch (error) {

            console.error(error);

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating vehicle usage"
                        : "Error creating vehicle usage"
                )
            );

        } finally {

            setLoading(false);
        }
    };


    // CANCEL
    const handleCancel = useCallback(() => {

        handleReset();

    }, [handleReset]);


    // VIEW
    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {
                state: {

                    title:
                        "Motor Vehicle Usage Master",

                    type:
                        "motorvehicleusage",

                    idField:
                        "usage_id",

                    editRoute:
                        "motorvehicleusage",

                    navigateback:
                        "/home/settings",

                    columns: [

                        {
                            field:
                                "usage_code",

                            headerName:
                                "Usage Code"
                        },

                        {
                            field:
                                "usage_name",

                            headerName:
                                "Usage Name"
                        },

                        {
                            field:
                                "description",

                            headerName:
                                "Description"
                        },

                        {
                            field:
                                "is_active",

                            headerName:
                                "Status",

                            type:
                                "status"
                        }

                    ]
                }
            }
        );
    };


    // CLOSE
    const handleClose = () => {

        navigate("/home/settings");

    };


    return (

        <Wrapper>

            <Panel title="Motor Vehicle Usage Creation">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "60%" }}>

                        {/* USAGE CODE */}

                        <FormRow
                            label="Usage Code"
                            required
                        >

                            <InputLg
                                value={
                                    vehicleUsage.usageCode
                                }
                                onChange={
                                    set("usageCode")
                                }
                                placeholder="Enter usage code"
                            />

                        </FormRow>


                        {/* USAGE NAME */}

                        <FormRow
                            label="Usage Name"
                            required
                        >

                            <InputLg
                                value={
                                    vehicleUsage.usageName
                                }
                                onChange={
                                    set("usageName")
                                }
                                placeholder="Enter usage name"
                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >

                            <InputLg
                                value={
                                    vehicleUsage.description
                                }
                                onChange={
                                    set("description")
                                }
                                placeholder="Enter description"
                            />

                        </FormRow>


                        {/* STATUS */}

                        <FormRow
                            label="Active Status"
                        >

                            <Checkbox
                                value={
                                    vehicleUsage.isActive
                                }
                                onChange={
                                    set("isActive")
                                }
                            />

                        </FormRow>

                    </Box>

                </Box>


                {/* DIVIDER */}

                <div
                    style={{
                        borderTop:
                            "1px solid #e5e7eb",

                        margin:
                            "20px 0"
                    }}
                />


                {/* BUTTONS */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        paddingTop: "8px"
                    }}
                >

                    <Button
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : "Save"}
                    </Button>


                    <Button
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>


                    <Button
                        onClick={handleView}
                    >
                        View
                    </Button>


                    <Button
                        onClick={handleClose}
                    >
                        Close
                    </Button>

                </div>

            </Panel>

        </Wrapper>
    );
};


export default memo(MotorVehicleUsageCreation);